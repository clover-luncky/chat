<template>
  <div>
    <HeaderComponent
      :using-context="usingContext"
      @export="handleExport" />
  </div>
</template>
<script setup lang='ts'>
  import { useUseingContext } from '@/hooks/useUsingContext';
  import HeaderComponent from './components/Header/index.vue';
  import { ref } from 'vue';
  import { useDialog } from 'naive-ui';

  const { usingContext } = useUseingContext()
  const dialog = useDialog()

  const loading = ref<boolean>(false)

  // 导出
  function handleExport() {
    if(loading.value) {
      return
    }
    const d = dialog.warning({
      
    })
  }
</script>