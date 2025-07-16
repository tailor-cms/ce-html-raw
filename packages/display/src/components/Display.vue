<template>
  <div class="tce-root">
    <iframe ref="displayFrame" class="mt-4" title="Preview" width="100%" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { Element } from '@tailor-cms/ce-html-raw-manifest';

const props = defineProps<{ element: Element; userState: any }>();
defineEmits(['interaction']);

const displayFrame = useTemplateRef('displayFrame');

function updateFrameContent(iframe: any, content: string) {
  iframe.contentDocument.body.innerHTML = content;
  updateHeight(displayFrame.value);
  // Trigger aditional adjustment, ensure content is loaded
  setTimeout(() => updateHeight(displayFrame.value), 1000);
}

function updateHeight(frame: any) {
  const height = frame.contentWindow.document.body.scrollHeight;
  frame.height = height > 180 ? height : 180;
}

onMounted(() => {
  updateFrameContent(displayFrame.value, props.element.data.content || '');
});
</script>

<style scoped>
.tce-root {
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
