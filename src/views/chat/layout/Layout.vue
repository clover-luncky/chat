<template>
  <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" >
        <Sider />
        <NLayoutContent>
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>
    <!-- 登录验证 -->
    <!-- <Permission :visible="needPermission" /> -->
  </div>
</template>
<script setup lang='ts'>
  import { NLayout, NLayoutContent } from 'naive-ui'
  import { useBasicLayout } from '../../../hooks/useBasicLayout'
  import { computed } from 'vue';
  import { useAppStore, useAuthStore, useChatStore } from '@/store'
  import Permission from './Permission.vue';
  import Sider from './sider/index.vue'
  
  const appStore = useAppStore()
  const { isMobile } = useBasicLayout()
  const collapsed = computed(() => appStore.siderCollapsed)
  const getMobileClass = computed(() => {
    if(isMobile.value) {
      return ['rounded-none', 'shadow-none']
    }
    return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
  })
  const getContainerClass = computed(() => {
    return [
      'h-full',
      { 'pl-[260px]': isMobile.value && !collapsed.value }
    ]
  })
  const needPermission = computed(() => {
    return isMobile.value ? ['rounded-none', 'shadow-none'] : ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
  })
</script>
