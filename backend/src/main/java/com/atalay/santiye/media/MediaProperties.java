package com.atalay.santiye.media;

import java.nio.file.Path;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("app.media")
public record MediaProperties(Path root, String ffmpeg, String ffprobe, int maxVideoSeconds, int maxAudioSeconds) {
}
