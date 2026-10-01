<script setup lang="ts">
import { usePublicPlans } from '@/core/marketing/usePublicPlans'
import { useSalesRequest } from '@/core/marketing/useSalesRequest'

const { plans, isLoading, isError } = usePublicPlans()
const { form, submit, isSending, isSent, problem } = useSalesRequest(() => plans.value)

function selectPlan(id: string) {
  if (!isSending.value) form.planId = form.planId === id ? undefined : id
}
</script>

<template>
  <section class="sales-request">
    <div v-if="isSent" class="sales-request__success" role="status">
      <span class="sales-request__done"><van-icon name="passed" size="32" /></span>
      <h2>Talebiniz bize ulaştı</h2>
      <p>Ekibimiz paylaştığınız iletişim bilgileri üzerinden sizinle görüşecek.</p>
      <RouterLink :to="{ name: 'landing' }" custom v-slot="{ href, navigate }">
        <van-button tag="a" :href="href" @click="navigate">Ana sayfaya dön</van-button>
      </RouterLink>
    </div>
    <van-form v-else :disabled="isSending" @submit="submit">
      <header class="sales-request__header">
        <h2>Tanıtım talebiniz</h2>
        <p>Firma adı, adınız ve telefonunuzla başlayın.</p>
      </header>
      <van-cell-group :border="false">
        <van-field v-model="form.companyName" name="companyName" label="Firma adı" label-align="top" required
          maxlength="120" placeholder="Firmanızın adı" autocomplete="organization" :disabled="isSending" />
        <van-field v-model="form.contactName" name="contactName" label="Adınız soyadınız" label-align="top" required
          maxlength="120" placeholder="Adınız ve soyadınız" autocomplete="name" :disabled="isSending" />
        <van-field v-model="form.phone" name="phone" label="Telefon" label-align="top" type="tel" required
          maxlength="20" placeholder="05xx xxx xx xx" autocomplete="tel" :disabled="isSending" />
        <van-field v-model="form.email" name="email" label="E-posta" label-align="top" type="email"
          maxlength="254" placeholder="E-posta adresiniz" autocomplete="email" :disabled="isSending" />
        <van-field v-model="form.city" name="city" label="Şehir" label-align="top" maxlength="60"
          placeholder="Firmanızın bulunduğu şehir" autocomplete="address-level2" :disabled="isSending" />
        <van-field label="Aktif şantiye sayısı" label-align="top" :disabled="isSending">
          <template #input>
            <van-stepper :model-value="form.siteCount ?? 0" :min="0" :max="999" integer :disabled="isSending"
              @update:model-value="(count) => !isSending && (form.siteCount = Number(count) || null)" />
          </template>
        </van-field>
        <van-field label="İlgilendiğiniz paket" label-align="top" :disabled="isSending">
          <template #input>
            <van-loading v-if="isLoading" size="16" class="sales-request__plan-hint">Paketler yükleniyor…</van-loading>
            <p v-else-if="isError" class="sales-request__plan-hint">Paketler şu an yüklenemedi. Talebinizi paket seçmeden gönderebilirsiniz.</p>
            <van-space v-else-if="plans.length" wrap :size="8" class="sales-request__plans">
              <van-button v-for="plan in plans" :key="plan.id" size="small" native-type="button"
                :type="form.planId === plan.id ? 'primary' : 'default'" :aria-pressed="form.planId === plan.id"
                :disabled="isSending" @click="selectPlan(plan.id)">{{ plan.name }}</van-button>
            </van-space>
            <p v-else class="sales-request__plan-hint">Talebinizi paket seçmeden gönderebilirsiniz.</p>
          </template>
        </van-field>
        <van-field v-model="form.message" name="message" label="Eklemek istedikleriniz" label-align="top"
          type="textarea" rows="3" autosize maxlength="1000" show-word-limit autocomplete="off" :disabled="isSending"
          placeholder="Ekibinizin büyüklüğü, ihtiyaçlarınız veya uygun görüşme saati…" />
      </van-cell-group>
      <!-- Bal küpü yalnızca botların doldurması için görünmez tutulur. -->
      <input v-model="form.website" class="sales-request__trap" :disabled="isSending" tabindex="-1"
        autocomplete="off" aria-hidden="true" name="website" />
      <van-notice-bar v-if="problem" class="sales-request__problem" wrapable :scrollable="false" left-icon="warning-o"
        color="var(--status-danger)" background="var(--status-danger-bg)" :text="problem" />
      <div class="sales-request__submit">
        <van-button type="primary" block native-type="submit" :loading="isSending" :disabled="isSending">
          Tanıtım talebini gönder<van-icon name="arrow" />
        </van-button>
        <small>Bilgileriniz yalnızca sizinle iletişim kurmak için kullanılır.</small>
      </div>
    </van-form>
  </section>
</template>

<style scoped>
.sales-request { position: relative; min-width: 0; padding: 25px 20px; border: 1px solid var(--mk-line); border-radius: 16px; background: #fff; }
.sales-request__header { margin-bottom: 24px; }
.sales-request__header h2 { margin: 0; color: var(--mk-ink); font-size: 20px; font-weight: 700; letter-spacing: -.025em; }
.sales-request__header p { margin: 9px 0 0; color: var(--mk-muted); font-size: 12px; line-height: 1.75; }
.sales-request .van-field { padding: 0; margin-bottom: 20px; }
.sales-request :deep(.van-cell::after) { display: none; }
.sales-request :deep(.van-field__label) { width: 100%; margin-bottom: 8px; color: var(--mk-ink); font-size: 12px; font-weight: 600; }
.sales-request :deep(.van-field__control) { min-height: 44px; padding: 11px 12px; border: 1px solid var(--mk-line); border-radius: 8px; color: var(--mk-ink); font-size: 12px; line-height: 1.7; background: #fff; }
.sales-request :deep(.van-field__control:focus) { border-color: var(--mk-muted); }
.sales-request :deep(.van-field--disabled .van-field__control) { background: var(--mk-paper); }
.sales-request :deep(.van-field__control--custom) { padding: 0; border: none; min-height: 0; }
.sales-request :deep(.van-field__word-limit) { margin-top: 6px; color: var(--mk-muted); font-size: 10px; }
.sales-request :deep(.van-stepper__minus), .sales-request :deep(.van-stepper__plus) { width: 36px; height: 36px; border-radius: 7px; background: var(--mk-paper); }
.sales-request :deep(.van-stepper__input) { width: 52px; height: 36px; margin-inline: 5px; border-radius: 7px; background: var(--mk-paper); }
.sales-request__plans .van-button { height: 34px; padding-inline: 13px; border-radius: 8px; font-size: 11px; }
.sales-request__plans .van-button--default { border-color: var(--mk-line); color: var(--mk-muted); }
.sales-request__plan-hint { margin: 0; color: var(--mk-muted); font-size: 11px; line-height: 1.75; }
.sales-request__trap { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.sales-request__problem { margin-top: 6px; border-radius: 8px; font-size: 12px; }
.sales-request__submit { display: grid; gap: 14px; margin-top: 26px; text-align: center; }
.sales-request__submit .van-button { height: 48px; border-radius: 10px; border-color: var(--mk-ink); background: var(--mk-ink); font-size: 12px; font-weight: 650; }
.sales-request__submit .van-icon { margin-left: 10px; font-size: 12px; }
.sales-request__submit small { color: var(--mk-muted); font-size: 10px; line-height: 1.75; }
.sales-request__success { display: grid; justify-items: center; gap: 20px; padding-block: 25px; text-align: center; }
.sales-request__done { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 50%; color: var(--status-success); background: var(--status-success-bg); }
.sales-request__success h2 { margin: 0; color: var(--mk-ink); font-size: 23px; line-height: 1.4; font-weight: 700; letter-spacing: -.03em; }
.sales-request__success p { max-width: 38ch; margin: -6px 0 0; color: var(--mk-muted); font-size: 13px; line-height: 1.85; }
.sales-request__success a { margin-top: 3px; text-decoration: none; }
.sales-request__success .van-button { border-color: var(--mk-line); border-radius: 8px; color: var(--mk-ink); font-size: 12px; }
</style>
