<template>
  <div>
    <HeaderComponent
      :using-context="usingContext"
      @export="handleExport"
      @handle-clear="handleClear" />
    <main class="flex-1 overflow-hidden">
      <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
        <div class="w-full max-w-screen-xl m-auto dark:bg-[#101014]" :class="[isMobile ? 'p-2' : 'p-4']">
          <div id="image-wrapper" class="relative">
            <template v-if="!dataSources.length">
              <div class="flex items-center justify-center mt-4 text-center text-neutral-300">
                <SvgIcon icon="ri:bubble-chart-fill" class="mr-2 text-3xl"></SvgIcon>
                <span>{{ t('chat.newChatTitle') }}</span>
              </div>
            </template>
            <template v-else>
              <div>
                <Message 
                  v-for="(item, index) of dataSources"
                  :key="index"
                  :date-time="item.dateTime"
                  :text="item.text"
                  :inversion="item.inversion"
                  :error="item.error"
                  :loading="item.loading"
                  @regenerate="onRegenerate(index)"
                />
                <div class="sticky bottom-0 left-0 flex justify-center">
                  <NButton v-if="loading" type="warning" @click="handleStop">
                    <template #icon>
                      <SvgIcon icon="ri:stop-circle-line" />
                    </template>
                    {{ t('common.stopResponding') }}
                  </NButton>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </main>
    <footer :class="footerClass">
      <div class="w-full max-w-screen-xl m-auto">
        <div class="flex items-center justify-between space-x-2">
          <HoverButton v-if="!isMobile" @click="handleClear">
            <span class="text-xl text-[#4f555e] dark:text-white">
              <SvgIcon icon="ri:delete-bin-line" />
            </span>
          </HoverButton>
          <HoverButton v-if="!isMobile" @click="handleExport">
            <span class="text-xl text-[#4f555e] dark:text-white">
              <SvgIcon icon="ri:download-2-line" />
            </span>
          </HoverButton>
          <HoverButton @click="toggleUsingContext">
            <span class="text-xl" :class="{ 'text-[#4b9e5f]': usingContext, 'text-[#a8071a]': !usingContext }">
              <SvgIcon icon="ri:chat-history-line" />
            </span>
          </HoverButton>
          <NAutoComplete
            v-model:value="prompt"
            :options="searchOptions"
            :render-label="renderOption"
          >
            <template #default="{ handleInput, handleBlur, handleFocus }">
              <NInput
                ref="inputRef"
                v-model:value="prompt"
                type="textarea"
                :placeholder="placeholder"
                :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @keypress="handleEnter"
              />
            </template>
          </NAutoComplete>
          <NButton type="primary" :disabled="buttonDisabled" @click="handleSubmit">
            <template #icon>
              <span class="dark:text-black">
                <SvgIcon icon="ri:send-plane-fill" />
              </span>
            </template>
          </NButton>
        </div>
      </div>
    </footer>
  </div>
</template>
<script setup lang='ts'>
  import { useUseingContext } from './hooks/useUsingContext';
  import HeaderComponent from './components/Header/index.vue';
  import { computed, ref } from 'vue';
  import { useDialog, useMessage, NButton, NAutoComplete, NInput } from 'naive-ui';
  import { toPng } from 'html-to-image';
  import { t } from '@/locales'
  import { useChatStore, usePromptStore } from '@/store';
  import { useRoute } from 'vue-router';
  import { useBasicLayout } from '@/hooks/useBasicLayout'
  import { SvgIcon, HoverButton } from '@/components/common';
  import { useChat } from './hooks/useChat';
  import { storeToRefs } from 'pinia';
  const { usingContext, toggleUsingContext } = useUseingContext()
  import { useScroll } from './hooks/useScroll'

  const dialog = useDialog()
  const ms = useMessage()
  const chatStore = useChatStore()
  const route = useRoute()
  const { isMobile } = useBasicLayout()
  const { updateChat, addChat, updateChatSome, getChatByUuidAndIndex } = useChat()

  const loading = ref<boolean>(false)
  const { uuid } = route.params as { uuid: string }
  // 数据源
  const dataSources = computed(() => chatStore.getChatByUuid(+uuid))
  let controller = new AbortController()
  const footerClass = computed(() => {
    let classes = ['p-4']
    if(isMobile.value) {
      classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden']
    }
    return classes
  })
  const prompt = ref<string>('')
  const promptStore = usePromptStore()
  const { promptList: promptTemplate } = storeToRefs<any>(promptStore)
  const searchOptions = computed(() => {
    if(prompt.value.startsWith('/')) {
      return promptTemplate.value.filter((item: { key: string }) => item.key.toLowerCase().includes(prompt.value.substring(1).toLowerCase())).map((obj: { value: any }) => {
        return {
          label: obj.value,
          value: obj.value
        }
      })
    } else {
      return []
    }
  })
  // value反渲染key
  const renderOption = (option: { label: string }) => {
    for(const i of promptTemplate.value) {
      if(i.value === option.label) {
        return [i.key]
      }
    }
    return []
  }
  // 提示信息
  const placeholder = computed(() => {
    return isMobile.value ? t('chat.placeholderMobile') : t('chat.placeholder')
  })
  const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
  const conversationList = computed(() => dataSources.value.filter(item => (!item.inversion && !!item.conversationOptions)))
  const openLongReply = import.meta.env.VITE_GLOB_LONG_REPLY === 'true'
  // 按钮置灰事件
  const buttonDisabled = computed(() => {
    return loading.value || !prompt.value || prompt.value.trim() === ''
  })

  // 导出
  function handleExport() {
    if(loading.value) {
      return
    }
    const d = dialog.warning({
      title: t('chat.exportImage'),
      content: t('chat.exportImageConfirm'),
      positiveText: t('common.yes'),
      negativeText: t('common.no'),
      onPositiveClick: async () => {
        try {
          d.loading = true
          const ele = document.getElementById('image-wrapper')
          const imgUrl = await toPng(ele as HTMLDivElement)
          const tempLink = document.createElement('a')
          tempLink.style.display = 'none'
          tempLink.href = imgUrl
          tempLink.setAttribute('download', 'chat-shot.png')
          if(typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank')
          }
          document.body.appendChild(tempLink)
          tempLink.click()
          document.body.removeChild(tempLink)
          window.URL.revokeObjectURL(imgUrl)
          d.loading = false
          ms.success('chat.exportSuccess')
          Promise.resolve()
        } catch(error: any) {
          ms.success('chat.exportFailed')
        } finally {
          d.loading = false
        }
      }
    })
  }

  // 清除
  function handleClear() {
    if(loading.value) {
      return
    }

    dialog.warning({
      title: t('chat.clearChat'),
      content: t('chat.clearChatConfirm'),
      positiveText: t('common.yes'),
      negativeText: t('common.no'),
      onPositiveClick: () => {
        chatStore.clearChatByUuid(+uuid)
      },
    })
  }

  async function onRegenerate(index: number) {
    if(loading.value) {
      return
    }
    controller = new AbortController()
    const { requestOptions }  = dataSources.value[index]
    let message = requestOptions?.prompt ?? ''
    let options: Chat.ConversationOptions = {}
    if(requestOptions.options) {
      options = { ...requestOptions.options }
    }
    loading.value = true
    updateChat(
      +uuid,
      index,
      {
        dateTime: new Date().toLocaleString(),
        text: '',
        inversion: false,
        error: false,
        loading: true,
        conversationOptions: null,
        requestOptions: {
          prompt: message,
          options: { ...options }
        }
      }
    )
  }

  // 暂停
  function handleStop() {
    if(loading.value) {
      controller.abort()
      loading.value = false
    }
  }

  async function onConversation() {
    let message = prompt.value
    if(loading.value) {
      return
    }
    if(!message || message.trim() === '') {
      return
    }
    controller = new AbortController()
    addChat(
      +uuid,
      {
        dateTime: new Date().toLocaleString(),
        text: message,
        inversion: true,
        error: false,
        conversationOptions: null,
        requestOptions: { prompt: message, options: null }
      }
    )
    scrollToBottom()

    loading.value = true
    prompt.value = ''

    let options: Chat.ConversationRequest = {}
    const lastContext = conversationList.value[conversationList.value.length -1]?.conversationOptions

    if(lastContext && usingContext.value) {
      options = { ...lastContext }
    }

    addChat(
      +uuid,
      {
        dateTime: new Date().toLocaleDateString(),
        text: t('chat.thinking'),
        loading: true,
        inversion: false,
        error: false,
        conversationOptions: null,
        requestOptions: {
          prompt: message,
          options: { ...options }
        }
      }
    )
    scrollToBottom()
    
    try {
      let lastText = ''
      const fetchChatAPIOnce = async () => {
        await fetchChatAPIProcess<Chat.ConversationResponse>({
          prompt: message,
          options,
          signal: controller.signal,
          onDownloadProgress: ({ event }) => {
            const xhr = event.target
            const { responseText } = xhr
            const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
            let chunk = responseText
            if(lastIndex !== -1) {
              chunk = responseText.substring(lastIndex)
            }
            try {
              const data = JSON.parse(chunk)
              updateChat(
                +uuid,
                dataSources.value.length - 1,
                {
                  dateTime: new Date().toLocaleDateString(),
                  text: lastText + (data.text ?? ''),
                  inversion: false,
                  error: false,
                  loading: true,
                  conversationOptions: { 
                    conversationId: data.conversationId,
                    parentMessageId: data.id
                  },
                  requestOptions: {
                    prompt: message,
                    options: { ...options }
                  }
                }
              )
              
              if(openLongReply && data.detail.choices[0].finish_reason === 'length' ) {
                options.parentMessageId = data.id
                lastText = data.text
                message = ''
                return fetchChatAPIOnce()
              }
            } catch (error) {}
          }
        })
        updateChatSome(+uuid, dataSources.value.length - 1, { loading: false})
      }
      await fetchChatAPIOnce()
    } catch(error: any) {
      const errorMessage = error?.message ?? t('common.wrong')
      if(errorMessage.message === 'canceled') {
        updateChatSome(
          +uuid,
          dataSources.value.length - 1,
          {
            loading: false
          }
        )
        scrollToBottomIfAtBottom()
        return
      }
      
      const currentChat = getChatByUuidAndIndex(+uuid, dataSources.value.length - 1)
      if(currentChat?.text && currentChat.text !== '') {
        updateChatSome(
          +uuid,
          dataSources.value.length - 1,
          {
            text: `${currentChat.text}\n[${errorMessage}}]`,
            error: true,
            loading: false
          }
        )
        return
      }
      
      updateChat(
        +uuid,
        dataSources.value.length - 1,
        {
          dateTime: new Date().toLocaleDateString(),
          text: errorMessage,
          inversion: false,
          error: true,
          loading: false,
          conversationOptions: null,
          requestOptions: { prompt: message, options: { ...options } }
        }
      )
      scrollToBottomIfAtBottom()
    } finally {
      loading.value = false
    }
  }

  // 提交事件
  function handleSubmit() {
    onConversation()
  }

  // enter键事件
  function handleEnter(event: KeyboardEvent) {
    if(!isMobile.value) {
      if(event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        handleSubmit()
      }
    } else {
      if(event.key === 'Enter' && event.ctrlKey) {
        event.preventDefault()
        handleSubmit()
      }
    }
  }
</script>