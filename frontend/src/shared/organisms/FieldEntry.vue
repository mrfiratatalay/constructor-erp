<script setup lang="ts">
import { computed } from 'vue'
import type { FieldMaterialRef, PostView } from '@/core/api/generated/model'
import { fieldKind } from '@/core/field/fieldKind'
import FieldMedia from '@/shared/molecules/FieldMedia.vue'
import FieldRow from '@/shared/molecules/FieldRow.vue'
import MaterialFieldCard from '@/shared/molecules/MaterialFieldCard.vue'

/**
 * Bir saha güncellemesi: ne oldu (yazının kendisi başlıktır), kim yazdı, altında kanıtı (fotoğraf, video, ses).
 * Silinen güncellemenin yerinde iz kalır (İlke 6). ⋯ menüsü kabuktan yuvayla gelir. Malzeme hareketinden gelen
 * gönderinin altında hareketin kartı durur (güncel durumuyla; dokununca hareketin ayrıntısı).
 */
const { post, material = undefined } = defineProps<{ post: PostView; material?: FieldMaterialRef }>()
const emit = defineEmits<{ openPhotos: [urls: string[], index: number]; openMaterial: [movementId: string] }>()

const kind = computed(() => (post.deletion ? 'note' : fieldKind(post)))
</script>

<template>
  <FieldRow :at="post.createdAt" :kind="kind">
    <p v-if="post.deletion" class="field-entry__deleted">
      Bu güncelleme silindi · {{ post.deletion.deletedByName }}
    </p>
    <template v-else>
      <div class="field-entry__head">
        <p v-if="post.body" class="field-entry__title">{{ post.body }}</p>
        <p class="field-entry__author">
          {{ post.author.fullName }}<span v-if="post.editedAt"> · düzenlendi</span>
        </p>
      </div>
      <MaterialFieldCard v-if="material" :reference="material" @open="(id) => emit('openMaterial', id)" />
      <FieldMedia :media="post.media" @open-photos="(urls, index) => emit('openPhotos', urls, index)" />
    </template>
    <template v-if="$slots.menu && !post.deletion" #menu><slot name="menu" /></template>
  </FieldRow>
</template>

<style scoped>
.field-entry__head {
  display: grid;
  gap: 2px;
}

.field-entry__title {
  margin: 0;
  color: var(--text-strong);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  line-height: 1.4;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.field-entry__author,
.field-entry__deleted {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.field-entry__deleted {
  padding-top: 4px;
  font-style: italic;
}
</style>
