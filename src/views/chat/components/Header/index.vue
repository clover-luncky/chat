<template>
  <header class="sticky top-0 left-0 right-0 z-30 border-b dark:border-neutral-800 bg-white/80 dark:bg-black/20 backdrop-blur">
    <div>
        <div>1111</div>
        <!-- <h1>{{ currentChatHistory?.title ?? '' }}</h1> -->
        <div></div>
    </div>
  </header>
</template>
<script setup lang='ts'>
    import { computed } from 'vue';
    import { useChatStore } from '../../../../store'
    const chatStore = useChatStore()
    // const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)
</script>