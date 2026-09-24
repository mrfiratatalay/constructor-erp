<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import { usePostActions } from '@/core/posts/usePostActions'

/**
 * Gönderiyi düzeltme penceresi: yalnızca yazı; gönderide "düzenlendi" izi kalır.
 * Fotoğraf yanlışsa gönderi silinip yeniden atılır.
 */
const post = defineModel<PostView | null>({ required: true })
const { correctPost, isSaving } = usePostActions()
const body = ref('')

watch(post, (target) => {
  body.value = target?.body ?? ''
})

async function save() {
  if (!post.value) return
  try {
    await correctPost(post.value, body.value.trim() || null)
    post.value = null
    ElMessage.success('Düzeltildi')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-dialog :model-value="post !== null" title="Mesajı düzelt" width="520px"
    @update:model-value="(open: boolean) => !open && (post = null)">
    <el-form label-position="top" @submit.prevent="save">
      <el-form-item label="Yazı">
        <el-input v-model="body" type="textarea" :autosize="{ minRows: 3, maxRows: 10 }" maxlength="4000"
          show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="post = null">Vazgeç</el-button>
      <el-button type="primary" :loading="isSaving" @click="save">Kaydet</el-button>
    </template>
  </el-dialog>
</template>
