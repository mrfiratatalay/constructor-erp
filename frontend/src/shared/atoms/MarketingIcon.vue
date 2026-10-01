<script setup lang="ts">
import { BarChart3, Camera, ClipboardCheck, ListChecks, Monitor, RefreshCw, ShieldCheck, Smartphone, Truck } from 'lucide-vue-next'

/** Tanıtım metnindeki simge adının (core/marketing/marketingCopy) çizimi. */
const ICONS = { camera: Camera, clipboard: ClipboardCheck, truck: Truck, chart: BarChart3, tasks: ListChecks,
  shield: ShieldCheck, phone: Smartphone, monitor: Monitor, sync: RefreshCw }
const { name, size = 22 } = defineProps<{ name: keyof typeof ICONS; size?: number }>()
</script>

<template>
  <component :is="ICONS[name]" :size="size" aria-hidden="true" />
</template>
