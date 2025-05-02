<template>
  <div
    class="h-screen w-screen flex justify-center items-center auth-bg bg-cover bg-no-repeat bg-center"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup></script>

<style>
.auth-bg {
  background-image: url("~/assets/images/auth_bg.jpg");
}
</style>
