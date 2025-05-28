<template>
  <div>
    <SidebarProvider :defaultOpen="defaultOpen">
      <AppSidebar />
      <main class="flex-1 relative">
        <SidebarTrigger class="fixed cursor-pointer" />
        <slot></slot>
      </main>
    </SidebarProvider>
  </div>
</template>

<script lang="ts" setup>
import AppSidebar from "@/components/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const defaultOpen = useCookie<boolean>("sidebar:state");
</script>
