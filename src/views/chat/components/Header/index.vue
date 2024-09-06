<template>
  <header class="sticky top-0 left-0 right-0 z-30 border-b dark:border-neutral-800 bg-white/80 dark:bg-black/20 backdrop-blur">
    <div class="relative flex items-center justify-between min-w-0 overflow-hidden h-14">
        <div class="flex items-center">
          <button class="flex items-center justify-center w-11 h-11" @click="handleUpdateCollapsed">
            <SvgIcon v-if="collapsed" class="text-2xl" icon="ri:align-justify" />
            <SvgIcon v-else class="text-2xl" icon="ri:align-right" />
          </button>
        </div>
        <h1>{{ currentChatHistory?.title ?? '' }}</h1>
        <div></div>
    </div>
  </header>
</template>
<script setup lang='ts'>
    import { computed } from 'vue';
    import { useAppStore, useChatStore } from '../../../../store'
    import { SvgIcon } from '../../../../components/common'

    const appStore = useAppStore()
    const chatStore = useChatStore()
    const collapsed = computed(() => appStore.siderCollapsed)
    const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)

    function handleUpdateCollapsed() {
      appStore.setSiderCollapsed(!collapsed.value)
    }
</script>