<template>
  <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 95%; max-width: 640px;">
    <div>
      <NTabs v-model:value="active" type="line" animated>
        <NTabPane name="General" tab="General">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:file-user-line" />
            <span>{{ $t('setting.general') }}</span>
          </template>
          <div class="min-h-[100px]">
            <General />
          </div>
        </NTabPane>
        <NTabPane v-if="isChatGPTAPI" name="Advanced" tab="Advanced">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:equalizer-line" />
            <span class="ml-2">{{ $t('setting.advanced') }}</span>
          </template>
          <div class="min-h-[100px]">
            <Advanced />
          </div>
        </NTabPane>
        <NTabPane name="Config" tab="Config">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:list-settings-line" />
            <span class="ml-2">{{ $t('setting.config') }}</span>
          </template>
          <About />
        </NTabPane>
      </NTabs>
    </div>
  </NModal>
</template>
<script setup lang='ts'>
import { useAuthStore } from '@/store';
import { NModal, NTabs, NTabPane } from 'naive-ui'
import { computed, ref } from 'vue';
import General from './General.vue'
import Advanced from './Advanced.vue'
import About from './About.vue'
import { SvgIcon } from '@/components/common'

interface Props {
  visible: boolean
}
interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  }
})
const active = ref('General')
const authStore = useAuthStore()
const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)
</script>