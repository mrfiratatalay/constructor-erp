package com.atalay.santiye.media;

import java.util.ArrayList;
import java.util.List;

/**
 * Her medya türü için ffmpeg komutları. Saf fonksiyonlar: yalnızca komut üretir, çalıştırmaz.
 * Ortak kurallar: meta veri (konum dahil) silinir, uzun kenar sınırlanır, çıktı her cihazda oynar.
 */
final class FfmpegCommands {

    private static final List<String> QUIET = List.of("-hide_banner", "-loglevel", "error", "-y");
    private static final List<String> NO_METADATA = List.of("-map_metadata", "-1");

    private FfmpegCommands() {
    }

    static List<List<String>> forMedia(MediaKind kind, MediaFiles files, MediaProperties limits) {
        return switch (kind) {
            case PHOTO -> List.of(photo(files, limits), thumbnail(files, limits));
            case VIDEO -> List.of(video(files, limits), thumbnail(files, limits));
            case AUDIO -> List.of(audio(files, limits));
        };
    }

    private static List<String> photo(MediaFiles files, MediaProperties limits) {
        return command(limits, files.original().toString(),
            List.of("-vf", longSide(1600), "-q:v", "3"), files.display().toString());
    }

    /** H.264 + AAC, "faststart": video indirilmesi bitmeden oynamaya başlar. */
    private static List<String> video(MediaFiles files, MediaProperties limits) {
        return command(limits, files.original().toString(), List.of(
            "-t", String.valueOf(limits.maxVideoSeconds()),
            "-vf", longSide(1280) + ",format=yuv420p",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
            "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart"), files.display().toString());
    }

    private static List<String> audio(MediaFiles files, MediaProperties limits) {
        return command(limits, files.original().toString(), List.of(
            "-t", String.valueOf(limits.maxAudioSeconds()), "-vn",
            "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart"), files.display().toString());
    }

    /** Videoda "thumbnail" süzgeci ilk karelerden en temsili olanı seçer (siyah ilk kareye düşmez). */
    private static List<String> thumbnail(MediaFiles files, MediaProperties limits) {
        return command(limits, files.display().toString(),
            List.of("-vf", "thumbnail=30," + longSide(480), "-frames:v", "1", "-q:v", "5"), files.thumbnail().toString());
    }

    private static List<String> command(MediaProperties limits, String input, List<String> options, String output) {
        var command = new ArrayList<String>();
        command.add(limits.ffmpeg());
        command.addAll(QUIET);
        command.addAll(List.of("-i", input));
        command.addAll(NO_METADATA);
        command.addAll(options);
        command.add(output);
        return command;
    }

    /** Uzun kenarı en fazla `max` piksel yapar; en boy oranı korunur, kenarlar çift sayı olur. */
    static String longSide(int max) {
        return "scale='if(gt(iw,ih),min(%1$d,iw),-2)':'if(gt(iw,ih),-2,min(%1$d,ih))'".formatted(max);
    }
}
