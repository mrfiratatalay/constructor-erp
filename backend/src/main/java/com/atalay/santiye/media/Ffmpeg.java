package com.atalay.santiye.media;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.springframework.stereotype.Component;

/** ffmpeg ve ffprobe'u ayrı bir işlem olarak çalıştırır. */
@Component
class Ffmpeg {

    /** Takılan bir dönüşüm sonsuza kadar beklemesin. */
    private static final Duration TIMEOUT = Duration.ofMinutes(5);

    private final MediaProperties properties;

    Ffmpeg(MediaProperties properties) {
        this.properties = properties;
    }

    /**
     * Çıktı dosyaya yazılır: okunmayan çıktı işletim sisteminin tamponunu doldurur ve işlemi dondurur.
     * Başarısızlıkta ffmpeg'in hata mesajı istisnaya eklenir.
     */
    String run(List<String> command) throws IOException, InterruptedException {
        Path log = Files.createTempFile("ffmpeg-", ".log");
        try {
            Process process = new ProcessBuilder(command).redirectErrorStream(true).redirectOutput(log.toFile()).start();
            if (!process.waitFor(TIMEOUT.toSeconds(), TimeUnit.SECONDS)) {
                process.destroyForcibly();
                throw new IOException("ffmpeg zaman aşımına uğradı");
            }
            String output = Files.readString(log, StandardCharsets.UTF_8).trim();
            if (process.exitValue() != 0) {
                throw new IOException("ffmpeg başarısız (" + process.exitValue() + "): " + output);
            }
            return output;
        } finally {
            Files.deleteIfExists(log);
        }
    }

    double probeDuration(Path file) throws IOException, InterruptedException {
        String output = run(List.of(properties.ffprobe(), "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", file.toString()));
        return Double.parseDouble(output);
    }
}
