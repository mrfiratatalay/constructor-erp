<script setup lang="ts">
const day = defineModel<string>('day', { required: true })
const description = defineModel<string>('description', { required: true })
defineProps<{ disabled: boolean }>()
</script>

<template>
  <el-form label-position="top" class="movement-edit" :disabled="disabled">
    <el-form-item label="Hareket tarihi" required>
      <el-date-picker v-model="day" type="date" format="DD MMMM YYYY" value-format="YYYY-MM-DD"
        :clearable="false" style="width: 100%" aria-label="Hareket tarihi" />
    </el-form-item>
    <el-form-item label="Açıklama">
      <el-input v-model="description" type="textarea" :rows="3" maxlength="500" show-word-limit
        placeholder="Teslim alan kişi veya not..." aria-label="Hareket açıklaması" />
    </el-form-item>
  </el-form>
</template>

<style scoped>
.movement-edit { padding: 20px; border-radius: var(--radius-md); background: var(--surface-muted); }
.movement-edit :deep(.el-form-item:last-child) { margin-bottom: 0; }
.movement-edit :deep(.el-form-item__label) { font-size: var(--text-xs); font-weight: var(--weight-semibold); }
</style>
