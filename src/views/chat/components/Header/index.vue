<template>
  <header class="sticky top-0 left-0 right-0 z-30 border-b dark:border-neutral-800 bg-white/80 dark:bg-black/20 backdrop-blur">
    <div class="relative flex items-center justify-between min-w-0 overflow-hidden h-14">
        <div class="flex items-center">
          <button class="flex items-center justify-center w-11 h-11" @click="handleUpdateCollapsed">
            <SvgIcon v-if="collapsed" class="text-2xl" icon="ri:align-justify" />
            <SvgIcon v-else class="text-2xl" icon="ri:align-right" />
          </button>
        </div>
        <h1 class="flex-1 px-4 pr-6 overflow-hidden cursor-pointer select-none text-ellipsis whitespace-nowrap" @dblclick="onScrollToTop">
          {{ currentChatHistory?.title ?? '' }}
        </h1>
        <div class="flex items-center space-x-2">
          <HoverButton @click="handleExport">
            <span class="text-xl text-[#4f555e] dark:text-white">
              <SvgIcon icon="ri:download-2-line" />
            </span>
          </HoverButton>
          <HoverButton @click="handleClear">
            <span class="text-xl text-[#4f555e] dark:text-white">
              <SvgIcon icon="ri:delete-bin-line" />
            </span>
          </HoverButton>
        </div>
    </div>
  </header>
</template>
<script setup lang='ts'>
    import { computed, nextTick } from 'vue';
    import { useAppStore, useChatStore } from '../../../../store'
    import { SvgIcon, HoverButton } from '../../../../components/common'

    interface Props {
      usingContext: boolean
    }

    defineProps<Props>()

    interface Emit {
      (ev: 'export'): void
      (ev: 'handleClear'): void
    }
    const emit = defineEmits<Emit>()

    const appStore = useAppStore()
    const chatStore = useChatStore()
    const collapsed = computed(() => appStore.siderCollapsed)
    const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)

    function handleUpdateCollapsed() {
      appStore.setSiderCollapsed(!collapsed.value)
    }

    // 滚动到最顶部
    function onScrollToTop() {
      const scrollRef = document.querySelector('#scrollRef')
      if(scrollRef) {
        nextTick(() => scrollRef.scrollTop = 0)
      }
    }

    // 导出
    function handleExport() {
      emit('export')
    }
    // 清除
    function handleClear() {
      emit('handleClear')
    }
</script>