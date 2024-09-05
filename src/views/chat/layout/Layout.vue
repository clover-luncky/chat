<template>
  <div>
    <div>
      <NLayout>
        <NLayoutContent>
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>

  </div>
</template>
<script setup lang='ts'>
  import { NLayout, NLayoutContent } from 'naive-ui'
  import { useBasicLayout } from '../../../hooks/useBasicLayout'
  const { isMobile } = useBasicLayout()
</script>
