package com.atalay.santiye.material;

/** Formdan gelen yazı: baştaki ve sondaki boşluk atılır, boş bırakılan alan hiç yazılmamış sayılır. */
final class MaterialTexts {

    private MaterialTexts() {
    }

    static String tidy(String text) {
        if (text == null || text.isBlank()) {
            return null;
        }
        return text.strip();
    }
}
