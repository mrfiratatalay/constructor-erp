<script setup lang="ts">
import { ArrowRight, CircleCheck } from 'lucide-vue-next'
import { usePublicPlans } from '@/core/marketing/usePublicPlans'
import { useSalesRequest } from '@/core/marketing/useSalesRequest'

const { plans, isLoading, isError } = usePublicPlans()
const { form, submit, isSending, isSent, problem } = useSalesRequest(() => plans.value)
</script>

<template>
  <el-card shadow="never" class="apply-card">
    <template v-if="!isSent" #header>
      <h2>Tanıtım talebiniz</h2>
      <p>Firma adı, adınız ve telefonunuzla başlayın.</p>
    </template>
    <el-result v-if="isSent" title="Talebiniz bize ulaştı"
      sub-title="Ekibimiz paylaştığınız iletişim bilgileri üzerinden sizinle görüşecek.">
      <template #icon><span class="apply-card__done"><CircleCheck :size="36" aria-hidden="true" /></span></template>
      <template #extra>
        <RouterLink :to="{ name: 'landing' }" custom v-slot="{ href, navigate }">
          <el-button tag="a" :href="href" @click="navigate">Ana sayfaya dön</el-button>
        </RouterLink>
      </template>
    </el-result>
    <el-form v-else :model="form" label-position="top" :disabled="isSending" @submit.prevent="submit">
      <div class="apply-card__fields">
        <el-form-item label="Firma adı" required>
          <el-input v-model="form.companyName" maxlength="120" placeholder="Firmanızın adı" autocomplete="organization" name="companyName" />
        </el-form-item>
        <el-form-item label="Adınız soyadınız" required>
          <el-input v-model="form.contactName" maxlength="120" placeholder="Adınız ve soyadınız" autocomplete="name" name="contactName" />
        </el-form-item>
        <el-form-item label="Telefon" required>
          <el-input v-model="form.phone" type="tel" maxlength="20" placeholder="05xx xxx xx xx" autocomplete="tel" name="phone" />
        </el-form-item>
        <el-form-item label="E-posta">
          <el-input v-model="form.email" type="email" maxlength="254" placeholder="E-posta adresiniz" autocomplete="email" name="email" />
        </el-form-item>
        <el-form-item label="Şehir">
          <el-input v-model="form.city" maxlength="60" placeholder="Firmanızın bulunduğu şehir" autocomplete="address-level2" name="city" />
        </el-form-item>
        <el-form-item label="Aktif şantiye sayısı">
          <el-input-number v-model="form.siteCount" :min="0" :max="999" :precision="0" controls-position="right"
            placeholder="Şantiye sayısı" class="apply-card__number" />
        </el-form-item>
      </div>
      <el-form-item label="İlgilendiğiniz paket">
        <el-select v-model="form.planId" clearable :loading="isLoading" :disabled="isLoading || isError"
          placeholder="Paket seçebilirsiniz" class="apply-card__plan">
          <el-option v-for="plan in plans" :key="plan.id" :label="plan.name" :value="plan.id" />
        </el-select>
        <small v-if="isError" class="apply-card__field-note">Paketler şu an yüklenemedi. Talebinizi paket seçmeden gönderebilirsiniz.</small>
      </el-form-item>
      <el-form-item label="Eklemek istedikleriniz">
        <el-input v-model="form.message" type="textarea" :rows="3" maxlength="1000" show-word-limit
          placeholder="Ekibinizin büyüklüğü, ihtiyaçlarınız veya uygun görüşme saati…" autocomplete="off" name="message" />
      </el-form-item>
      <!-- Bal küpü yalnızca botların doldurması için görünmez tutulur. -->
      <input v-model="form.website" class="apply-card__trap" :disabled="isSending" tabindex="-1"
        autocomplete="off" aria-hidden="true" name="website" />
      <el-alert v-if="problem" :title="problem" type="error" :closable="false" show-icon class="apply-card__alert" />
      <el-button type="primary" size="large" native-type="submit" :loading="isSending" :disabled="isSending"
        class="apply-card__submit">Tanıtım talebini gönder<ArrowRight :size="16" aria-hidden="true" /></el-button>
      <p class="apply-card__note">Bilgileriniz yalnızca sizinle iletişim kurmak için kullanılır.</p>
    </el-form>
  </el-card>
</template>

<style scoped>
.apply-card { min-width: 0; border: 1px solid var(--mk-line); border-radius: 16px; background: var(--surface); }
.apply-card :deep(.el-card__header) { padding: 28px 28px 24px; border-bottom-color: var(--mk-line); }
.apply-card :deep(.el-card__body) { padding: 28px; }
.apply-card h2 { margin: 0; color: var(--mk-ink); font-size: 20px; font-weight: var(--weight-semibold); letter-spacing: -.025em; }
.apply-card :deep(.el-card__header) > p { margin: 8px 0 0; color: var(--mk-muted); font-size: 13px; line-height: 1.7; }
.apply-card__fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr)); column-gap: 16px; }
.apply-card :deep(.el-form-item) { margin-bottom: 20px; }
.apply-card :deep(.el-form-item__label) { height: auto; margin-bottom: 7px; padding: 0; color: var(--mk-ink); font-size: 12px; font-weight: var(--weight-medium); line-height: 1.6; }
.apply-card :deep(.el-input), .apply-card :deep(.el-textarea) { --el-input-border-color: var(--mk-line); --el-input-hover-border-color: var(--mk-muted); --el-input-focus-border-color: var(--mk-ink); --el-input-text-color: var(--mk-ink); --el-input-border-radius: 8px; }
.apply-card :deep(.el-input__wrapper) { min-height: 42px; }
.apply-card :deep(.el-select__wrapper) { min-height: 42px; border-radius: 8px; }
.apply-card :deep(.el-textarea__inner) { padding: 12px; font-size: 13px; line-height: 1.7; }
.apply-card__number, .apply-card__plan { width: 100%; }
.apply-card__field-note { display: block; margin-top: 8px; color: var(--mk-muted); font-size: 11px; line-height: 1.6; }
.apply-card__trap { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.apply-card__alert { margin-bottom: 20px; }
.apply-card__submit { --el-button-bg-color: var(--mk-ink); --el-button-border-color: var(--mk-ink); --el-button-hover-bg-color: var(--brand-deep); --el-button-hover-border-color: var(--brand-deep); --el-button-active-bg-color: var(--mk-dark); --el-button-active-border-color: var(--mk-dark); width: 100%; height: 48px; border-radius: 10px; font-size: 13px; font-weight: var(--weight-semibold); }
.apply-card__submit :deep(span) { display: inline-flex; align-items: center; gap: 12px; }
.apply-card__note { margin: 14px 0 0; color: var(--mk-muted); font-size: 11px; line-height: 1.7; text-align: center; }
.apply-card__done { display: inline-grid; place-items: center; width: 64px; height: 64px; border-radius: 50%; background: var(--status-success-bg); color: var(--status-success); }
.apply-card :deep(.el-result) { padding: 28px 0; }
.apply-card :deep(.el-result__title p) { color: var(--mk-ink); font-size: 22px; font-weight: var(--weight-semibold); }
.apply-card :deep(.el-result__subtitle p) { max-width: 40ch; color: var(--mk-muted); font-size: 14px; line-height: 1.8; }
</style>
