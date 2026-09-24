package com.atalay.santiye.team;

/**
 * Aynı numara farklı yazılabilir: "0532 123 45 67", "+90 532 123 4567" ve "5321234567" aynı kişidir.
 * Karşılaştırma ülke kodu ve baştaki sıfır atılmış rakamlarla yapılır.
 */
final class PhoneNumbers {

    private static final int MIN_DIGITS = 10;
    private static final int MAX_DIGITS = 15;

    private PhoneNumbers() {
    }

    static boolean looksValid(String phone) {
        int digits = digitsOf(phone).length();
        return digits >= MIN_DIGITS && digits <= MAX_DIGITS;
    }

    static boolean same(String first, String second) {
        return nationalDigits(first).equals(nationalDigits(second));
    }

    private static String nationalDigits(String phone) {
        String digits = digitsOf(phone);
        if (digits.length() == 12 && digits.startsWith("90")) {
            return digits.substring(2);
        }
        if (digits.length() == 11 && digits.startsWith("0")) {
            return digits.substring(1);
        }
        return digits;
    }

    private static String digitsOf(String phone) {
        return phone.replaceAll("\\D", "");
    }
}
