package com.atalay.santiye.media;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

/**
 * Dönüşüm kuyruğu. Aynı anda en fazla iki dönüşüm: video kodlamak işlemciyi yorar,
 * sunucu bu sırada diğer isteklere cevap vermeye devam etmeli.
 */
@Component
class MediaQueue implements DisposableBean {

    private static final int PARALLEL_CONVERSIONS = 2;

    private final ExecutorService executor =
        Executors.newFixedThreadPool(PARALLEL_CONVERSIONS, Thread.ofVirtual().name("medya-", 0).factory());

    void submit(Runnable task) {
        executor.execute(task);
    }

    @Override
    public void destroy() {
        executor.shutdown();
    }
}
