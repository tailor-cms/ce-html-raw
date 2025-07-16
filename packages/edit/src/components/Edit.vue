<template>
  <div ref="rootEl" class="tce-html-raw">
    <ElementPlaceholder
      v-if="showPlaceholder"
      :icon="manifest.ui.icon"
      :is-disabled="isReadonly"
      :is-focused="isFocused"
      :name="`${manifest.name} component`"
      active-icon="mdi-arrow-up"
      active-placeholder="Use toolbar to upload the file"
    />
    <div v-show="!showPlaceholder">
      <div v-show="showEditor">
        <div class="my-2 text-body-2 font-weight-bold">Code</div>
        <Codemirror
          v-model="code"
          :extensions="extensions"
          :style="{ 'min-height': '212px', 'max-height': '400px' }"
          :tab-size="2"
          placeholder="Code goes here..."
          indent-with-tab
          @blur="save"
          @change="onChange"
          @paste="save"
        />
      </div>
      <VExpandTransition>
        <div v-show="!isEmpty">
          <div v-if="isFocused" class="mt-5 mb-2 text-body-2 font-weight-bold">
            Preview
          </div>
          <iframe ref="displayFrame" title="Preview" width="100%" />
        </div>
      </VExpandTransition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineEmits,
  defineProps,
  onMounted,
  ref,
  useTemplateRef,
} from 'vue';
import manifest, { Element } from '@tailor-cms/ce-html-raw-manifest';
import { Codemirror } from 'vue-codemirror';
import debounce from 'lodash-es/debounce';
import { ElementPlaceholder } from '@tailor-cms/core-components';
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

const rootEl = useTemplateRef('rootEl');
const displayFrame = useTemplateRef('displayFrame') as any;
const code = ref(props.element.data?.content || '');

const isEmpty = computed(() => code.value.trim() === '');

const showPlaceholder = computed(() => {
  return isEmpty.value && !props.isFocused;
});

const showEditor = computed(() => {
  return props.isFocused && !props.isReadonly;
});

function updateFrameContent(iframe: any, content: string = '') {
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
