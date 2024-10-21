<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    position="absolute"
    bordered
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NButton dashed block @click="handleAdd">{{ $t('chat.newChatButton') }}</NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>
        <div class="flex items-center p-4 space-x-4">
          <div class="flex-1">
            <NButton block @click="show = true">
              {{ $t('store.siderButton') }}
            </NButton>
          </div>
          <NButton @click="handleClearAll">
            <SvgIcon icon="ri:close-circle-line" />
          </NButton>
        </div>
      </main>
      <Footer />
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed"></div>
  </template>
  <PromptStore v-model:visible="show" />
</template>
<script setup lang='ts'>
import { NLayoutSider, NButton, useDialog } from 'naive-ui'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useChatStore } from '@/store';
import { computed, ref } from 'vue';
import type { CSSProperties } from 'vue';
import Footer from './Footer.vue'
import List from './List.vue'
import { t } from '@/locales';
import { PromptStore, SvgIcon } from '@/components/common'

const { isMobile } = useBasicLayout()
const appStore = useAppStore()
const collapsed = computed(() => appStore.siderCollapsed)
const getMobileClass = computed<CSSProperties>(() => {
  return isMobile.value ? {
    position: 'fixed',
    zIndex: 50
  } : {}
})
const mobileSafeArea = computed(() => {
  return isMobile.value ? {
    paddingBottom: 'env(safe-area-inset-bottom)'
  } : {}
})
const chatStore = useChatStore()
const show = ref(false)
const dialog = useDialog()
function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

function handleAdd() {
  chatStore.addHistory({
    title: t('chat.newChatTitle'),
    uuid: Date.now(),
    isEdit: false
  })
}

function handleClearAll() {
  dialog.warning({
    title: t('chat.deleteMessage'),
    content: t('chat.clearHistoryConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.clearHistory()
      if(isMobile.value) {
        appStore.setSiderCollapsed(true)
      }
    },
  })
}
</script>