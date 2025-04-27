<script setup lang="ts"></script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="flex-1 relative">
      <SidebarTrigger class="fixed cursor-pointer" />
      <NuxtPage />
    </main>
  </SidebarProvider>
</template>
