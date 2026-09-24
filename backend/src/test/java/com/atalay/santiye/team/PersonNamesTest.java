package com.atalay.santiye.team;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class PersonNamesTest {

    @Test
    void allCapsAndAllLowerNamesAreTidied() {
        assertThat(PersonNames.tidy("FIRAT ATALAY")).isEqualTo("Fırat Atalay");
        assertThat(PersonNames.tidy("  musa   kusbey ")).isEqualTo("Musa Kusbey");
        assertThat(PersonNames.tidy("irem ışık")).isEqualTo("İrem Işık");
    }

    @Test
    void deliberatelyMixedNamesAreKept() {
        assertThat(PersonNames.tidy("Ahmet McAllister")).isEqualTo("Ahmet McAllister");
    }
}
