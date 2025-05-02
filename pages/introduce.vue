<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-12">
    <DiseaseIntroduceCard
      v-for="item in data"
      :key="item.name"
      :introduce="item"
    />
  </div>
</template>

<script lang="ts" setup>
import { useIntroduce } from "~/api/useIntroduce.ts";

const { DiseaseIntroduceQuery } = useIntroduce();

const { data, isLoading, error } = DiseaseIntroduceQuery;
</script>
