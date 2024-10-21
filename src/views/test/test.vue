<template>
  <div class="carousel" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <div class="slide-container" :style="{ transform: `translateX(${currentTranslateX}px)` }">
      <div v-for="(page, index) in pages" :key="index" class="slide" :style="{ opacity: getOpacity(index) }">
        {{ page.content }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const pages = ref([
  // 这里可以添加多个页面的内容
  { content: 'Page 1' },
  { content: 'Page 2' },
  { content: 'Page 3' }
]);

const currentTranslateX = ref(0);
const startX = ref(0);
const currentIndex = ref(0);

function handleTouchStart(event) {
  startX.value = event.touches[0].clientX;
}

function handleTouchMove(event) {
  const touchX = event.touches[0].clientX;
  const diff = touchX - startX.value;
  currentTranslateX.value = -currentIndex.value * 100 + diff;
}

function handleTouchEnd() {
  const diff = currentTranslateX.value + currentIndex.value * 100;
  if (diff > 50) {
    currentIndex.value = Math.max(0, currentIndex.value - 1);
  } else if (diff < -50) {
    currentIndex.value = Math.min(pages.value.length - 1, currentIndex.value + 1);
  }
  currentTranslateX.value = -currentIndex.value * 100;
}

const getOpacity = computed(() => (index) => {
  if (index === currentIndex.value) {
    return 1;
  } else if (index === currentIndex.value - 1 || index === currentIndex.value + 1) {
    return 0.5;
  } else {
    return 0.3;
  }
});

// 假设有一个方法 clearPromptTemplate 用于处理点击事件
function clearPromptTemplate() {
  console.log('Clear prompt template clicked');
}
</script>
<style>
.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slide-container {
  display: flex;
  transition: transform 0.5s ease;
}

.slide {
  width: 100%;
  height: 100%;
  transition: opacity 0.5s ease;
}
</style>