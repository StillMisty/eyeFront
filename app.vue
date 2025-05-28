<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <ClientOnly>
    <Toaster richColors />
  </ClientOnly>
</template>

<script setup lang="ts">
import { Toaster } from "vue-sonner";
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
