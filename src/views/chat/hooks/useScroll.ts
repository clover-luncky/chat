import type { Ref } from 'vue';
import { nextTick, ref } from 'vue';

type ScrollElement = HTMLDivElement | null

interface ScrollReturn {
    scrollRef: Ref
    scrollToBottom: () => Promise<void>
    scrollToBottomIfAtBottom: () => Promise<void>
}

export function useScroll(): ScrollReturn {
    const scrollRef = ref<ScrollElement>(null)

    const scrollToBottom = async () => {
        await nextTick()
        if(scrollRef.value) {
            scrollRef.value.scrollTop = scrollRef.value.scrollHeight
        }
    }

    const scrollToBottomIfAtBottom = async () => {
        await nextTick()
        if(scrollRef.value) {
            const threshold = 100
            const distanceToBottom = scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight
            if(distanceToBottom <= threshold) {
                scrollRef.value.scrollTop = scrollRef.value.scrollHeight
            }
        }
    }

    return {
        scrollRef,
        scrollToBottom,
        scrollToBottomIfAtBottom
    }
}