package com.atalay.santiye.media;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/** Sunucu dönüşüm ortasında kapandıysa, açılışta yarım kalan medyalar yeniden kuyruğa alınır. */
@Component
class ProcessingRecovery implements ApplicationRunner {

    private final MediaRepository media;
    private final MediaProcessor processor;

    ProcessingRecovery(MediaRepository media, MediaProcessor processor) {
        this.media = media;
        this.processor = processor;
    }

    @Override
    public void run(ApplicationArguments args) {
        media.findByStatus(MediaStatus.PROCESSING).forEach(item -> processor.enqueue(item.getId()));
    }
}
