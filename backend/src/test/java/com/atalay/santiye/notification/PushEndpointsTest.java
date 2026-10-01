package com.atalay.santiye.notification;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

/** Sunucu yalnızca tarayıcıların push servislerine istek atar; başka her adres reddedilir (SSRF). */
class PushEndpointsTest {

    @ParameterizedTest
    @ValueSource(strings = {
        "https://fcm.googleapis.com/fcm/send/eXyz:APA91bH",
        "https://updates.push.services.mozilla.com/wpush/v2/gAAAAABk",
        "https://web.push.apple.com/QOsaBn4",
        "https://wns2-par02p.notify.windows.com/w/?token=BQYAAAB%2bXy",
        "https://FCM.googleapis.com:443/fcm/send/abc"})
    void browserPushServicesAreAccepted(String endpoint) {
        assertThat(PushEndpoints.isAllowed(endpoint)).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "https://169.254.169.254/latest/meta-data",
        "https://api:8080/actuator/health",
        "https://10.0.0.5/internal",
        "https://evil.example/collect",
        "http://fcm.googleapis.com/fcm/send/abc",
        "https://fcm.googleapis.com.evil.example/fcm/send/abc",
        "https://evilpush.apple.com/x",
        "https://user@fcm.googleapis.com/fcm/send/abc",
        "https://fcm.googleapis.com:8443/fcm/send/abc",
        "https://a b",
        "ftp://fcm.googleapis.com/x"})
    void anythingElseIsRefused(String endpoint) {
        assertThat(PushEndpoints.isAllowed(endpoint)).isFalse();
    }
}
