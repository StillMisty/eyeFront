<template>
  <div>
    <SidebarProvider>
      <AppSidebar />
      <main class="flex-1 relative">
        <SidebarTrigger class="fixed cursor-pointer" />
        <slot></slot>
      </main>
    </SidebarProvider>
  </div>
</template>

<script lang="ts" setup></script>
