package com.atalay.santiye.material;

/**
 * Saha gönderisinin yazısı. Saha simgesi yazıdan okunur ("geldi" teslimattır, 📦): gelen malzeme "geldi" der,
 * yoldaki "yolda", çıkan "gönderildi", kullanım "kullanıldı". Tarih ve saat gönderinin kendisindedir.
 */
record FieldTexts(MaterialMovement movement, Material material, String from, String to) {

    String body(boolean arriving) {
        String what = material.getName() + ", " + Quantities.withUnit(movement.getQuantity(), material.getUnit());
        return headline(arriving) + ": " + what + route();
    }

    private String headline(boolean arriving) {
        return switch (movement.getType()) {
            case USED -> "Malzeme kullanıldı";
            case OUTBOUND -> "Malzeme dışarı verildi";
            case RETURN -> "İade geldi";
            default -> arriving ? arrivingHeadline() : "Malzeme gönderildi";
        };
    }

    private String arrivingHeadline() {
        return movement.getStatus() == MovementStatus.IN_TRANSIT ? "Malzeme yolda" : "Malzeme geldi";
    }

    private String route() {
        if (from != null && to != null) {
            return " (" + from + " → " + to + ")";
        }
        String only = from != null ? from : to;
        return only == null ? "" : " (" + only + ")";
    }
}
