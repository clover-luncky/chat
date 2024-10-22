<template>
  <div class="text-black" :class="wrapClass">
    <div ref="textRef" class="leading-relaxed break-words">
        <div v-if="inversion">
            <div 
                v-if="asRawText" 
                class="markdown-body"
                :class="{ 'markdown-body-generate': loading }"
                v-html="text" />
            <div 
                v-else
                class="whitespace-pre-wrap"
                v-text="text" />
        </div>
        <div 
            v-else
            class="whitespace-pre-wrap"
            v-text="text" />
    </div>
  </div>
</template>
<script setup lang='ts'>
    import { useBasicLayout } from '@/hooks/useBasicLayout';
    import { t } from '@/locales';
    import { copyToClip } from '@/utils/copy';
    import hljs from 'highlight.js';
    import mila from 'markdown-it-link-attributes';
    import MarkdownIt from 'markdown-it';
    import mdKatex from '@vscode/markdown-it-katex';
    import { computed, onMounted, onUnmounted, onUpdated, ref } from 'vue';

    interface Props {
        inversion?: boolean
        error?: boolean
        text?: string
        loading?: boolean
        asRawText?: boolean
    }

    const props = defineProps<Props>()
    const { isMobile } = useBasicLayout()
    const textRef = ref<HTMLElement>()

    const wrapClass = computed(() => {
        return [
            'text-wrap',
            'min-w-[20px]',
            'rounded-md',
            isMobile.value ? 'p-2' : 'px-3 py-2',
            props.inversion ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]',
            props.inversion ? 'dark:bg-[#a1dc95]' : 'dark:bg-[#1e1e20]',
            props.inversion ? 'message-request' : 'message-reply',
            { 'text-red-500': props.error },
        ]
    })

    const mdi = new MarkdownIt({
        html: false,
        linkify: true,
        highlight(code, language) {
            const validLang = !!(language && hljs.getLanguage(language))
            if(validLang) {
                const lang = language ?? ''
                return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
            }
            return highlightBlock(hljs.highlightAuto(code).value, '')
        }
    })
    mdi.use(mila, { attr: { target: '_blank', rel: 'noopener' } })
    mdi.use(mdKatex)

    onMounted(() => {
        addCopyEvents()
    })
    onUpdated(() => {
        addCopyEvents()
    })
    onUnmounted(() => {
        removeCopyEvents()
    })

    // 复制文本
    function addCopyEvents() {
        if(textRef.value) {
            const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
            copyBtn.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const code = btn.parentElement?.nextElementSibling?.textContent
                    if(code) {
                        copyToClip(code).then(() => {
                            btn.textContent = t('chat.copied')
                            setTimeout(() => {
                                btn.textContent = t('chat.copyCode')
                            })
                        })
                    }
                })
            })
        }
    }

    // 卸载复制文本事件挂载
    function removeCopyEvents() {
        if(textRef.value) {
            const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
            copyBtn.forEach((btn) => {
                btn.removeEventListener('click', () => {})
            })
        }
    }

    function highlightBlock(str: string, lang?: string) {
        return `<pre class="code-block-wrapper">
            <div class="code-block-header">
                <span class="code-block-header__lang">${lang}</span>
                <span class="code-block-header__copy">${t('chat.copyCode')}</span>
            </div>
            <code class="hljs code-block-body ${lang}">${str}</code>
        </pre>`
    }
</script>
<style lang="less">
@import url(./style.less);
</style>