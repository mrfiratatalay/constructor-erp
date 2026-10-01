package com.atalay.santiye.common.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/**
 * Kullanıcıya gösterilecek hatalar. Spring bu sınıfı kendiliğinden RFC 9457 formatına çevirir;
 * ayrı bir hata yakalayıcı yazmıyoruz. Mesajlar arayüzde gösterildiği için Türkçedir.
 */
public class ApiException extends ErrorResponseException {

    private ApiException(HttpStatus status, String detail) {
        super(status, ProblemDetail.forStatusAndDetail(status, detail), null);
    }

    /** code: arayüzün mesajı değil durumu tanıdığı sabit (ör. WORKSPACE_LOCKED, FEATURE_NOT_IN_PLAN). */
    private ApiException(HttpStatus status, String detail, String code) {
        this(status, detail);
        getBody().setProperty("code", code);
    }

    public static ApiException badRequest(String detail) {
        return new ApiException(HttpStatus.BAD_REQUEST, detail);
    }

    public static ApiException unauthorized(String detail) {
        return new ApiException(HttpStatus.UNAUTHORIZED, detail);
    }

    /** Kaydı görebiliyor ama bu işi yapmaya yetkisi yok (ör. başkasının gönderisini düzeltmek). */
    public static ApiException forbidden(String detail) {
        return new ApiException(HttpStatus.FORBIDDEN, detail);
    }

    public static ApiException forbidden(String detail, String code) {
        return new ApiException(HttpStatus.FORBIDDEN, detail, code);
    }

    /** Başka firmanın kaydı da "bulunamadı" döner: varlığını bile belli etmeyiz. */
    public static ApiException notFound(String detail) {
        return new ApiException(HttpStatus.NOT_FOUND, detail);
    }

    public static ApiException conflict(String detail) {
        return new ApiException(HttpStatus.CONFLICT, detail);
    }

    /** Kısa sürede çok deneme (kaba kuvvet, sel): istemci biraz bekleyip yeniden dener. */
    public static ApiException tooManyRequests(String detail) {
        return new ApiException(HttpStatus.TOO_MANY_REQUESTS, detail);
    }
}
