<script setup lang="ts">
import { CircleCheck } from 'lucide-vue-next'
import { usePublicPlans } from '@/core/marketing/usePublicPlans'
import { useSalesRequest } from '@/core/marketing/useSalesRequest'

/** Başvuru formu. Gönderilince teşekkür ve "ne olacak" görünür; ekip platform yönetiminde başvuruyu görür. */
const { plans } = usePublicPlans()
const { form, submit, isSending, isSent, problem } = useSalesRequest(() => plans.value)
</script>

<template>
  <el-card shadow="never" class="apply-card">
    <el-result v-if="isSent" title="Başvurunuz bize ulaştı" sub-title="En geç bir iş günü içinde sizi arıyoruz.">
      <template #icon><CircleCheck :size="64" class="apply-card__done" /></template>
      <template #extra>
        <RouterLink :to="{ name: 'landing' }"><el-button round>Ana sayfaya dön</el-button></RouterLink>
      </template>
    </el-result>
    <el-form v-else label-position="top" @submit.prevent="submit">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="Firma adı" required><el-input v-model="form.companyName" maxlength="120" /></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Adınız soyadınız" required>
            <el-input v-model="form.contactName" maxlength="120" autocomplete="name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Telefon" required>
            <el-input v-model="form.phone" type="tel" maxlength="20" placeholder="05xx xxx xx xx" autocomplete="tel" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="E-posta"><el-input v-model="form.email" type="email" maxlength="254" /></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Şehir"><el-input v-model="form.city" maxlength="60" /></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Aktif şantiye sayısı">
            <el-input-number v-model="form.siteCount" :min="0" :max="999" controls-position="right" class="apply-card__number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="İlgilendiğiniz paket">
        <el-radio-group v-model="form.planId">
          <el-radio-button v-for="plan in plans" :key="plan.id" :value="plan.id">{{ plan.name }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Eklemek istedikleriniz">
        <el-input v-model="form.message" type="textarea" :rows="3" maxlength="1000" show-word-limit
          placeholder="Ekip büyüklüğü, uygun arama saati…" />
      </el-form-item>
      <!-- Bal küpü: ekranda görünmez, yalnızca botlar doldurur. -->
      <input v-model="form.website" class="apply-card__trap" tabindex="-1" autocomplete="off" aria-hidden="true" name="website" />
      <el-alert v-if="problem" :title="problem" type="error" :closable="false" show-icon class="apply-card__alert" />
      <el-button type="primary" size="large" round native-type="submit" :loading="isSending" class="apply-card__submit">
        Başvuruyu gönder
      </el-button>
      <p class="apply-card__note">Bilgileriniz yalnızca sizinle iletişim için kullanılır.</p>
    </el-form>
  </el-card>
</template>

<style scoped>
.apply-card {
  border-radius: var(--radius-xl);
  padding: var(--space-2);
}

.apply-card__number {
  width: 100%;
}

.apply-card__trap {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.apply-card__alert {
  margin-bottom: var(--space-4);
}

.apply-card__submit {
  width: 100%;
}

.apply-card__note {
  margin: var(--space-3) 0 0;
  color: var(--text-subtle);
  font-size: var(--text-xs);
  text-align: center;
}

.apply-card__done {
  color: var(--status-success);
}
</style>
