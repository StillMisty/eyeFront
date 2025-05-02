<template>
  <div
    class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 group"
  >
    <div class="relative">
      <div class="aspect-video w-full bg-slate-100 overflow-hidden">
        <img
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          :src="get_image_url(introduce.image)"
          alt="疾病图片"
          loading="lazy"
        />
      </div>
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"
      ></div>
      <h2
        class="absolute bottom-0 left-0 right-0 text-white px-6 py-4 m-0 text-xl font-semibold transition-all group-hover:pb-5"
      >
        {{ introduce.name }}
      </h2>
    </div>

    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center">
          <Badge variant="outline" class="mr-2">{{
            introduce.category || "眼科"
          }}</Badge>
          <span class="text-xs text-slate-500">ID: {{ introduce.id }}</span>
        </div>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <Info class="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>详细了解{{ introduce.name }}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div class="relative">
        <p
          class="text-gray-700 leading-relaxed whitespace-pre-line break-words text-sm"
          :class="{ 'line-clamp-4': !isExpanded }"
        >
          {{ introduce.description }}
        </p>

        <div v-if="introduce.description.length > 150" class="mt-2 text-right">
          <Button
            variant="link"
            size="sm"
            class="p-0 h-auto text-xs cursor-pointer"
            @click="isExpanded = !isExpanded"
          >
            {{ isExpanded ? "收起" : "展开全文" }}
          </Button>
        </div>
      </div>

      <div
        class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center"
      >
        <div class="text-xs text-slate-500">更新时间：{{ formattedDate }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Info } from "lucide-vue-next";
import { ref, computed } from "vue";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { DiseaseIntroduceResponse } from "~/types/DTO/DiseaseIntroduceResponse";
import get_image_url from "~/utils/get_image_url";

const props = defineProps<{
  introduce: DiseaseIntroduceResponse;
}>();

const isExpanded = ref(false);

const formattedDate = computed(() => {
  if (!props.introduce.updated_at) return "暂无";

  const date = new Date(props.introduce.updated_at);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
});
</script>
