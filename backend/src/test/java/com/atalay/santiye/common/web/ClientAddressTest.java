package com.atalay.santiye.common.web;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ClientAddressTest {

    @Test
    void anIpv4AddressIsItsOwnKey() {
        assertThat(ClientAddress.normalize("203.0.113.7")).isEqualTo("203.0.113.7");
    }

    /** Aynı /64 bloğundaki her adres aynı kişidir: adres değiştirerek sınırdan kaçılamaz. */
    @Test
    void ipv6AddressesOfTheSameBlockShareOneKey() {
        String first = ClientAddress.normalize("2001:db8:1:2:aaaa::1");
        String second = ClientAddress.normalize("2001:db8:1:2:ffff:ffff:ffff:ffff");

        assertThat(first).isEqualTo(second).isEqualTo("20010db800010002/64");
        assertThat(ClientAddress.normalize("2001:db8:1:3::1")).isNotEqualTo(first);
    }

    @Test
    void somethingThatIsNotAnAddressIsLeftAsItIs() {
        assertThat(ClientAddress.normalize("not:an:address!")).isEqualTo("not:an:address!");
    }
}
