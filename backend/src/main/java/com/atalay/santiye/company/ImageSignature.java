package com.atalay.santiye.company;

/** Dosyanın ilk baytlarından resim türü: PNG, JPEG, WEBP; tanınmazsa null. */
final class ImageSignature {

    private static final byte[] PNG = {(byte) 0x89, 'P', 'N', 'G'};
    private static final byte[] JPEG = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] RIFF = {'R', 'I', 'F', 'F'};
    private static final byte[] WEBP = {'W', 'E', 'B', 'P'};
    private static final int WEBP_OFFSET = 8;

    private ImageSignature() {
    }

    static String detect(byte[] head) {
        if (startsWith(head, PNG, 0)) {
            return "image/png";
        }
        if (startsWith(head, JPEG, 0)) {
            return "image/jpeg";
        }
        if (startsWith(head, RIFF, 0) && startsWith(head, WEBP, WEBP_OFFSET)) {
            return "image/webp";
        }
        return null;
    }

    private static boolean startsWith(byte[] data, byte[] prefix, int offset) {
        for (int i = 0; i < prefix.length; i++) {
            if (data[offset + i] != prefix[i]) {
                return false;
            }
        }
        return true;
    }
}
