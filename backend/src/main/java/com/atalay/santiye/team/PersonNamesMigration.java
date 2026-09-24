package com.atalay.santiye.team;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import org.flywaydb.core.api.MigrationVersion;
import org.flywaydb.core.api.migration.Context;
import org.flywaydb.core.api.migration.JavaMigration;
import org.springframework.stereotype.Component;

/**
 * Flyway V12, bir kereye mahsus: ad düzeltme kuralı (PersonNames) gelmeden önce kaydedilmiş adlar da Türkçe
 * kurallarla yazılır ("musa" → "Musa", "FIRAT ATALAY" → "Fırat Atalay"). SQL ile yapılmaz: veritabanının initcap'i
 * Türkçe I/ı'yı bilmez ve bilerek karışık yazılmış adı ("McAllister") bozar; kural tek yerde, PersonNames'te kalır.
 */
@Component
class PersonNamesMigration implements JavaMigration {

    @Override
    public MigrationVersion getVersion() {
        return MigrationVersion.fromVersion("12");
    }

    @Override
    public String getDescription() {
        return "tidy person names";
    }

    @Override
    public Integer getChecksum() {
        return null;
    }

    @Override
    public boolean canExecuteInTransaction() {
        return true;
    }

    @Override
    public void migrate(Context context) throws SQLException {
        Connection connection = context.getConnection();
        try (Statement select = connection.createStatement();
            ResultSet people = select.executeQuery("select id, full_name from users");
            PreparedStatement rename = connection.prepareStatement("update users set full_name = ? where id = ?")) {
            while (people.next()) {
                String name = people.getString("full_name");
                String tidy = PersonNames.tidy(name);
                if (!tidy.equals(name)) {
                    rename.setString(1, tidy);
                    rename.setObject(2, people.getObject("id"));
                    rename.executeUpdate();
                }
            }
        }
    }
}
