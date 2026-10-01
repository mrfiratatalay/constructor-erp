<script setup lang="ts">
import LinkFailed from '@/desktop/molecules/LinkFailed.vue'
import { reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { useCompanyJoin } from '@/core/auth/useCompanyJoin'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'

/**
 * Firmanın bağlantısını açan kişinin sayfası: hangi firma çağırıyor, adın ve numaran, Katıl. Katılınca bütün
 * şantiyeleri görür. Bu cihazda zaten içerideyse beklemeden şantiyelere gider.
 */
const { invite, isLoading, loadError, join, openSites, isJoining } = useCompanyJoin()
const formRef = ref<FormInstance>()
const form = reactive({ fullName: '', phone: '' })
const rules: FormRules = {
  fullName: [{ required: true, message: 'Adını yaz', trigger: 'blur' }],
  phone: [{ required: true, message: 'Numaranı yaz', trigger: 'blur' }],
}

watch(invite, (value) => value?.alreadyInside && void openSites(), { immediate: true })

async function submit() {
  if (!(await formRef.value?.validate().catch(() => false))) return
  try {
    await join({ fullName: form.fullName.trim(), phone: form.phone.trim() })
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <main class="join-page">
    <BrandLogo />
    <el-skeleton v-if="isLoading" :rows="3" animated class="join-page__card" />
    <LinkFailed v-else-if="loadError" title="Katılınamadı" :message="loadError" />
    <section v-else-if="invite && !invite.alreadyInside" class="join-page__card">
      <header class="join-page__head">
        <p>Şantiye ekibine katıl</p>
        <h1>{{ invite.companyName }}</h1>
      </header>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
        <el-form-item label="Adın soyadın" prop="fullName">
          <el-input v-model="form.fullName" maxlength="120" placeholder="Ahmet Yılmaz" />
        </el-form-item>
        <el-form-item label="Telefonun" prop="phone">
          <el-input v-model="form.phone" type="tel" maxlength="20" placeholder="0532 123 45 67" />
        </el-form-item>
      </el-form>
      <el-button type="primary" size="large" :loading="isJoining" @click="submit">Katıl</el-button>
    </section>
  </main>
</template>

<style scoped>
.join-page {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: var(--space-6);
  min-height: var(--layout-app-height);
  padding: var(--space-6);
}

.join-page__card {
  display: grid;
  gap: var(--space-4);
  width: min(100%, 400px);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-md);
}

.join-page__head {
  display: grid;
  gap: var(--space-1);
  text-align: center;
}

.join-page__head p {
  margin: 0;
  color: var(--text-muted);
}

.join-page__head h1 {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
}
</style>
