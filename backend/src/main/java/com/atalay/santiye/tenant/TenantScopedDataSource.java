package com.atalay.santiye.tenant;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.jdbc.datasource.DelegatingDataSource;

/**
 * Havuzdan alınan her bağlantıya o anki firmayı yazar: RLS politikaları app.company_id'ye bakar (V26). Değer her
 * alışta yeniden yazılır, bu yüzden bir önceki isteğin firması bağlantıda kalmaz. Uygulama süper kullanıcıyla
 * bağlanıyorsa firma isteklerinde yetkisiz role geçilir; süper kullanıcı RLS'e takılmaz.
 */
class TenantScopedDataSource extends DelegatingDataSource {

    static final String TENANT_ROLE = "constructor_tenant";
    static final String PRIVILEGED = "select rolsuper or rolbypassrls from pg_roles where rolname = session_user";
    private static final String APPLY = "select set_config('app.company_id', ?, false), set_config('role', ?, false)";

    /** İlk firma bağlantısında öğrenilir: o ana kadar migration'lar bitmiş, rol (V26) açılmıştır. */
    private volatile Boolean switchRole;

    TenantScopedDataSource(DataSource target) {
        super(target);
    }

    @Override
    public Connection getConnection() throws SQLException {
        return scoped(super.getConnection());
    }

    @Override
    public Connection getConnection(String username, String password) throws SQLException {
        return scoped(super.getConnection(username, password));
    }

    private Connection scoped(Connection connection) throws SQLException {
        try {
            String company = TenantContext.current().map(UUID::toString).orElse("");
            String role = !company.isEmpty() && switchesRole(connection) ? TENANT_ROLE : "none";
            try (PreparedStatement statement = connection.prepareStatement(APPLY)) {
                statement.setString(1, company);
                statement.setString(2, role);
                statement.execute();
            }
            return connection;
        } catch (SQLException error) {
            connection.close();
            throw error;
        }
    }

    private boolean switchesRole(Connection connection) throws SQLException {
        Boolean known = switchRole;
        if (known == null) {
            try (PreparedStatement statement = connection.prepareStatement(PRIVILEGED);
                ResultSet result = statement.executeQuery()) {
                known = result.next() && result.getBoolean(1);
            }
            switchRole = known;
        }
        return known;
    }
}
