<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent
      class="sm:max-w-3xl max-h-[90vh] grid-rows-[auto_minmax(0,1fr)_auto]"
    >
      <DialogHeader>
        <DialogTitle>眼疾识别</DialogTitle>
        <DialogDescription>眼疾识别结果</DialogDescription>
      </DialogHeader>
      <div class="flex gap-4">
        <div class="min-w-36 max-w-48">
          <img v-if="imageUrl" :src="imageUrl" alt="眼部图像" />
          <Accordion type="single" collapsible>
            <AccordionItem
              v-for="result in details?.results"
              :key="result.label"
              :value="result.label"
            >
              <AccordionTrigger class="cursor-pointer">
                {{ result.details.chinese_name }}：{{
                  (result.probability * 100).toFixed(2)
                }}%
              </AccordionTrigger>
              <AccordionContent>
                {{ result.details.details }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div class="overflow-y-auto size-full">
          <div
            v-if="suggestionIsPending"
            class="flex items-center justify-center flex-col gap-2 size-full"
          >
            <Loader class="animate-spin" :size="48" />
            <p>建议正在火速赶来</p>
          </div>
          <div
            v-if="suggestion"
            class="markdown-content"
            v-html="renderedSuggestion"
          ></div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "lucide-vue-next";
import MarkdownIt from "markdown-it";
import { useIdentify } from "~/api/useIdentify";
import { useMe } from "~/api/useMe";

const md = new MarkdownIt();
const { identification_id, open } = defineProps<{
  open: boolean;
  identification_id: number;
}>();
const emit = defineEmits(["update:open"]);

const {
  identifyEyeDetailQuery,
  identifyEyeImageQuery,
  identityEyeSuggestionQuery,
} = useIdentify();

const { meQuery } = useMe();

const { data: details } = identifyEyeDetailQuery(identification_id);
const { data: imageBlob } = identifyEyeImageQuery(identification_id);

const imageUrl = ref<string | null>(null);

// 当Blob数据加载后，创建对象URL
watch(
  () => imageBlob.value,
  (newBlob) => {
    if (newBlob) {
      // 如果之前有创建过URL，先释放它以避免内存泄漏
      if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value);
      }

      // 创建新的对象URL
      imageUrl.value = URL.createObjectURL(newBlob);
    }
  },
  { immediate: true },
);

// 组件卸载时释放URL资源
onBeforeUnmount(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
    imageUrl.value = null;
  }
});

const { data: me } = meQuery;

const identityEyeSuggestionRequest = computed(() => {
  if (me.value && details.value) {
    return {
      age:
        new Date().getFullYear() - new Date(me.value.birth_date).getFullYear(),
      disease: details.value.results[0].details.chinese_name,
      gender: me.value.gender,
    };
  }
});

const { data: suggestion, isPending: suggestionIsPending } =
  identityEyeSuggestionQuery(identityEyeSuggestionRequest.value);

// 使用 markdown-it 将 suggestion 内容渲染为 HTML
const renderedSuggestion = computed(() => {
  if (suggestion.value?.suggestion) {
    return md.render(suggestion.value.suggestion);
  }
  return "";
});
</script>

<style>
/* Markdown 样式 */
.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: bold;
}

.markdown-content p {
  margin-bottom: 1em;
}

.markdown-content ul,
.markdown-content ol {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

.markdown-content a {
  color: #3b82f6;
  text-decoration: underline;
}

.markdown-content blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
}

.markdown-content code {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
}

.markdown-content pre {
  background-color: #f3f4f6;
  padding: 1em;
  overflow-x: auto;
  border-radius: 0.25em;
  margin-bottom: 1em;
}
</style>
