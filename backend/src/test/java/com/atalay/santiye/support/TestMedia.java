package com.atalay.santiye.support;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.mock.web.MockMultipartFile;

/** Gerçek medya dosyaları: testler sahte baytla değil, telefonların ürettiği türde dosyalarla çalışır. */
public final class TestMedia {

    private static final Map<String, byte[]> CACHE = new ConcurrentHashMap<>();

    private TestMedia() {
    }

    public static MockMultipartFile photo() {
        return file("photo.jpg", "image/jpeg", "-f lavfi -i testsrc=size=1920x1080:rate=1 -frames:v 1");
    }

    /** iPhone gibi: dikey, .mov kabı. */
    public static MockMultipartFile portraitVideo() {
        return file("clip.mov", "video/quicktime",
            "-f lavfi -i testsrc=size=720x1280:rate=25 -f lavfi -i sine=frequency=440 -t 2 -c:v libx264 -pix_fmt yuv420p -c:a aac");
    }

    /** Android Chrome'un kaydettiği biçim: WebM kabında Opus ses. */
    public static MockMultipartFile chromeVoiceNote() {
        return file("voice.webm", "audio/webm", "-f lavfi -i sine=frequency=300 -t 2 -c:a libopus");
    }

    private static MockMultipartFile file(String name, String contentType, String ffmpegArgs) {
        byte[] bytes = CACHE.computeIfAbsent(name, key -> generate(key, ffmpegArgs));
        return new MockMultipartFile("files", name, contentType, bytes);
    }

    private static byte[] generate(String name, String ffmpegArgs) {
        try {
            Path output = Files.createTempDirectory("test-media").resolve(name);
            List<String> command = new ArrayList<>(List.of("ffmpeg", "-hide_banner", "-loglevel", "error", "-y"));
            command.addAll(List.of(ffmpegArgs.split(" ")));
            command.add(output.toString());
            int exit = new ProcessBuilder(command).inheritIO().start().waitFor();
            if (exit != 0) {
                throw new IllegalStateException("Test dosyası üretilemedi: " + name);
            }
            return Files.readAllBytes(output);
        } catch (IOException | InterruptedException error) {
            throw new IllegalStateException(error);
        }
    }
}
