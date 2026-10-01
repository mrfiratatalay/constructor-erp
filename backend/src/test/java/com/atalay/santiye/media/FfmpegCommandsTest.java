package com.atalay.santiye.media;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;

class FfmpegCommandsTest {

    private static final MediaProperties LIMITS = new MediaProperties(Path.of("x"), "ffmpeg", "ffprobe", 60, 180);
    private static final MediaFiles FILES = new MediaFiles(Path.of("in"), Path.of("out.mp4"), Path.of("thumb.jpg"));

    @Test
    void videoIsCutAtTheLimitAndStartsPlayingBeforeFullyDownloaded() {
        List<String> video = FfmpegCommands.forMedia(MediaKind.VIDEO, FILES, LIMITS).getFirst();

        assertThat(String.join(" ", video))
            .contains("-t 60", "-c:v libx264", "-c:a aac", "-movflags +faststart", "-map_metadata -1");
    }

    @Test
    void photoAndVideoGetAThumbnailButAudioDoesNot() {
        assertThat(FfmpegCommands.forMedia(MediaKind.PHOTO, FILES, LIMITS)).hasSize(2);
        assertThat(FfmpegCommands.forMedia(MediaKind.VIDEO, FILES, LIMITS)).hasSize(2);
        assertThat(FfmpegCommands.forMedia(MediaKind.AUDIO, FILES, LIMITS)).hasSize(1);
    }

    @Test
    void everyCommandReadsItsInputOnlyFromALocalFile() {
        for (MediaKind kind : MediaKind.values()) {
            for (List<String> command : FfmpegCommands.forMedia(kind, FILES, LIMITS)) {
                assertThat(String.join(" ", command)).contains("-protocol_whitelist file -i ");
            }
        }
    }

    @Test
    void longSideLimitKeepsPortraitAndLandscapeProportions() {
        assertThat(FfmpegCommands.longSide(1280))
            .isEqualTo("scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'");
    }
}
