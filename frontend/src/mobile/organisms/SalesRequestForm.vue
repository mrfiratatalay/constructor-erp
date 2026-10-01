<script setup lang="ts">
import { computed } from 'vue'
import { usePublicPlans } from '@/core/marketing/usePublicPlans'
import { useSalesRequest } from '@/core/marketing/useSalesRequest'
import ChoiceChips from '@/mobile/molecules/ChoiceChips.vue'

/** Başvuru formu telefonda. Gönderilince teşekkür görünür; ekip başvuruyu platform yönetiminde görür. */
const { plans } = usePublicPlans()
const { form, submit, isSending, isSent, problem } = useSalesRequest(() => plans.value)
const planOptions = computed(() => plans.value.map((plan) => ({ value: plan.id, label: plan.name })))
</script>

<template>
  <!-- Vant'ın hazır resimleri yalnızca error/search/network: "success" adı kırık bir <img> çiziyordu. -->
  <van-empty v-if="isSent" description="Başvurunuz bize ulaştı. En geç bir iş günü içinde sizi arıyoruz.">
    <template #image><van-icon name="checked" size="64" color="var(--status-success)" /></template>
    <RouterLink :to="{ name: 'landing' }"><van-button round>Ana sayfaya dön</van-button></RouterLink>
  </van-empty>
  <van-form v-else @submit="submit">
    <van-cell-group inset>
      <van-field v-model="form.companyName" label="Firma adı" required maxlength="120" />
      <van-field v-model="form.contactName" label="Adınız" required maxlength="120" autocomplete="name" />
      <van-field v-model="form.phone" label="Telefon" type="tel" required maxlength="20" placeholder="05xx xxx xx xx" />
      <van-field v-model="form.email" label="E-posta" type="email" maxlength="254" />
      <van-field v-model="form.city" label="Şehir" maxlength="60" />
      <van-field label="Şantiye sayısı" input-align="right">
        <template #input>
          <van-stepper :model-value="form.siteCount ?? 0" :min="0" :max="999" integer
            @update:model-value="(count) => (form.siteCount = Number(count) || null)" />
        </template>
      </van-field>
      <van-field label="Paket">
        <template #input><ChoiceChips v-model="form.planId" :options="planOptions" /></template>
      </van-field>
      <van-field v-model="form.message" label="Not" type="textarea" rows="2" autosize maxlength="1000"
        placeholder="Ekip büyüklüğü, uygun arama saati…" />
    </van-cell-group>
    <!-- Bal küpü: ekranda görünmez, yalnızca botlar doldurur. -->
    <input v-model="form.website" class="apply-trap" tabindex="-1" autocomplete="off" aria-hidden="true" name="website" />
    <van-notice-bar v-if="problem" class="apply-problem" wrapable :scrollable="false" color="var(--status-danger)"
      background="var(--status-danger-bg)" :text="problem" />
    <div class="apply-submit">
      <van-button type="primary" block round native-type="submit" :loading="isSending">Başvuruyu gönder</van-button>
      <small>Bilgileriniz yalnızca sizinle iletişim için kullanılır.</small>
    </div>
  </van-form>
</template>

<style scoped>
.apply-trap {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.apply-problem {
  margin-top: var(--space-3);
  border-radius: var(--radius-md);
}

.apply-submit {
  display: grid;
  gap: var(--space-2);
  padding-top: var(--space-5);
  text-align: center;
}

.apply-submit small {
  color: var(--text-subtle);
  font-size: var(--text-xs);
}
</style>
