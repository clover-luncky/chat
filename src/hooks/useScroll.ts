import type { Ref } from 'vue'
import { ref } from "vue";

type ScrollElement = HTMLDivElement | null

interface ScrollReturn {
    scrollRef: Ref
}

export function useScroll(): ScrollReturn {
    const scrollRef = ref<ScrollElement>(null)
    return {
        scrollRef
    }
}