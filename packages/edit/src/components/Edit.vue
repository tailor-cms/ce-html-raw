<template>
  <div ref="rootEl">
    <Codemirror
      v-if="isFocused"
      v-model="code"
      :extensions="extensions"
      :style="{ height: '400px' }"
      :tab-size="2"
      placeholder="Code goes here..."
      indent-with-tab
      @blur="save"
      @change="onChange"
      @paste="save"
    />
    <iframe ref="displayFrame" class="mt-4" title="Preview" width="100%" />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, onMounted, ref, useTemplateRef } from 'vue';
import { Codemirror } from 'vue-codemirror';
import debounce from 'lodash-es/debounce';
import { Element } from '@tailor-cms/ce-html-raw-manifest';
import { html } from '@codemirror/lang-html';

import sanitize from './sanitize';

const props = defineProps<{
  element: Element;
  isDragged: boolean;
  isReadonly: boolean;
  isFocused: boolean;
}>();
const emit = defineEmits(['save']);

const extensions = [html()];
const placeholder = '<div>Click to edit the code... </div>';

const rootEl = useTemplateRef('rootEl');
const displayFrame = useTemplateRef('displayFrame');
const code = ref(props.element.data?.content?.trim() || placeholder);

function updateFrameContent(iframe: any, content: string) {
  iframe.contentDocument.body.innerHTML = content;
  updateHeight(iframe);
  // Trigger aditional adjustment, ensure content is loaded
  setTimeout(() => updateHeight(iframe), 2000);
}

function updateHeight(frame: any) {
  const height = frame.contentWindow.document.body.scrollHeight;
  frame.height = height > 180 ? height : 180;
}

const save = () => {
  const content = sanitize(code.value);
  updateFrameContent(displayFrame.value, content);
  emit('save', { content });
};

const autosave = debounce(save, 2000);

const onChange = (val: string) => {
  updateFrameContent(displayFrame.value, val);
  autosave();
};

onMounted(() => {
  updateFrameContent(displayFrame.value, code.value);
  displayFrame.value.contentDocument.body.addEventListener('click', () =>
    rootEl.value?.click(),
  );
});
</script>

<style scoped>
iframe {
  border: 1px solid #ddd;
}
</style>
