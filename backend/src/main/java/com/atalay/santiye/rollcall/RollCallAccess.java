package com.atalay.santiye.rollcall;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;

/**
 * Yoklama modülünü (günün listesi, işaretleme, kişinin takvimi, Excel) yalnızca patron görür. Yoklama mesajını
 * atmak ve ona katılmak herkesindir; kimin gelip gelmediği ise patronun işidir.
 */
final class RollCallAccess {

    private RollCallAccess() {
    }

    static void requireOwner(CurrentUser user) {
        if (!user.isOwner()) {
            throw ApiException.forbidden("Yoklamayı yalnızca patron görür.");
        }
    }
}
