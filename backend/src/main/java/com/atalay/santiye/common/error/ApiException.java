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

    public static ApiException badRequest(String detail) {
        return new ApiException(HttpStatus.BAD_REQUEST, detail);
    }

    public static ApiException unauthorized(String detail) {
        return new ApiException(HttpStatus.UNAUTHORIZED, detail);
    }

    /** Başka firmanın kaydı da "bulunamadı" döner: varlığını bile belli etmeyiz. */
    public static ApiException notFound(String detail) {
        return new ApiException(HttpStatus.NOT_FOUND, detail);
    }

    public static ApiException conflict(String detail) {
        return new ApiException(HttpStatus.CONFLICT, detail);
    }
}
