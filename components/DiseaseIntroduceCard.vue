<template>
  <div
    class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 mb-6"
  >
    <div class="relative">
      <div class="aspect-video w-full bg-black">
        <img
          class="w-full h-full object-contain"
          :src="get_image_url(introduce.image)"
          alt="疾病图片"
        />
      </div>
      <h2
        class="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-4 py-3 m-0 text-xl font-semibold"
      >
        {{ introduce.name }}
      </h2>
    </div>
    <p
      class="p-6 text-gray-600 leading-relaxed whitespace-pre-line break-words max-h-72 overflow-auto"
    >
      {{ introduce.description }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { DiseaseIntroduceResponse } from "~/types/DTO/DiseaseIntroduceResponse";
import get_image_url from "~/utils/get_image_url";

defineProps<{
  introduce: DiseaseIntroduceResponse;
}>();
</script>
