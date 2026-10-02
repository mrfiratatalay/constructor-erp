import { Config } from '@remotion/cli/config'

// Ekran çekimlerindeki ince arayüz yazıları JPEG sıkıştırmasında bulanıklaşır: kareler PNG olarak alınır.
Config.setVideoImageFormat('png')
Config.setPixelFormat('yuv420p')
Config.setCodec('h264')
// Koyu lacivert geçişlerde bantlaşma olmasın diye yüksek kalite (düşük CRF).
Config.setCrf(14)
Config.setOverwriteOutput(true)
