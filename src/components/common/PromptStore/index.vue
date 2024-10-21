<template>
  <NModal v-model:show="show" preset="card" style="width: 90%; max-width: 900px;">
    <div class="space-y-4">
        <NTabs type="segment">
            <NTabPane name="local" :tab="$t('store.local')">
                <div class="flex gap-3 mb-4" :class="[isMobile ? 'flex-col' : 'flex-row justify-between']">
                    <div class="flex items-center space-x-4">
                        <NButton 
                            type="primary" 
                            size="small"
                            @click="changeShowModal('add')">
                            {{ $t('common.add') }}
                        </NButton>
                        <NButton
                            size="small"
                            @click="changeShowModal('local_import')">
                            {{ $t('common.import') }}
                        </NButton>
                        <NButton
                            size="small"
                            @click="exportPromptTemplate()">
                            {{ $t('common.export') }}
                        </NButton>
                        <NPopconfirm @positive-click="clearPromptTemplate">
                            <template></template>
                        </NPopconfirm>
                    </div>
                    <div class="flex items-center">
                        <NInput v-model:value="searchValue" style="width: 100%" />
                    </div>
                </div>
            </NTabPane>
        </NTabs>
    </div>
  </NModal>
</template>
<script setup lang='ts'>
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { usePromptStore } from '@/store';
import { NModal, NTabs, NTabPane, NInput, NButton } from 'naive-ui'
import { ref } from 'vue';

const show = ref(false)
const { isMobile } = useBasicLayout()
const searchValue = ref('')
const tempPromptKey = ref('')
const tempPromptValue = ref('')
const tempModifiedItem = ref<any>({})
const showModal = ref(false)
const modalMode = ref('')
const exportLoading = ref(false)
const promptStore = usePromptStore()
const promptList = ref<any>(promptStore.promptList)

// 添加修改导入都使用一个Modal, 临时修改内容占用tempPromptKey,切换状态前先将内容都清楚
const changeShowModal = (mode: 'add' | 'modify' | 'local_import', selected = { key: '', value: '' }) => {
    if(mode === 'add') {
        tempPromptKey.value = ''
        tempPromptValue.value = ''
    } else if(mode === 'modify') {
        tempModifiedItem.value = { ...selected }
        tempPromptKey.value = selected.key
        tempPromptValue.value = selected.value
    } else if(mode === 'local_import') {
        tempPromptKey.value = 'local_import'
        tempPromptValue.value = ''
    }
    showModal.value = !showModal.value
    modalMode.value = mode
}

// 模板导出
const exportPromptTemplate = () => {
    exportLoading.value = true
    const jsonDataStr = JSON.stringify(promptList.value)
    const blob = new Blob([jsonDataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ChatGPTPromptTemplate.json'
    link.click()
    URL.revokeObjectURL(url)
    exportLoading.value = false
}
</script>