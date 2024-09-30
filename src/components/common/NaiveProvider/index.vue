<template>
  <NLoadingBarProvider>
    <NDialogProvider>
        <NNotificationProvider>
            <NMessageProvider>
                <slot />
                <NaiveProviderContent />
            </NMessageProvider>
        </NNotificationProvider>
    </NDialogProvider>
  </NLoadingBarProvider>
</template>
<script setup lang='ts'>
    import { NLoadingBarProvider, NDialogProvider, NNotificationProvider, NMessageProvider, useLoadingBar, useDialog, useMessage, useNotification } from 'naive-ui'
    import { defineComponent, h } from 'vue';

    const NaiveProviderContent = defineComponent({
        name: 'NaiveProviderContent',
        setup() {
            registerNaiveTools()
        },
        render() {
            return h('div')
        }
    })

    function registerNaiveTools() {
        window.$loadingBar = useLoadingBar()
        window.$dialog = useDialog()
        window.$message = useMessage()
        window.$notification = useNotification()
    }
</script>