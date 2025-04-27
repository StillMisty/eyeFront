<template>
  <div>
    <Input v-model="loginDTO.account"></Input>
    <Input v-model="loginDTO.password"></Input>
    <Button @click="login">Login</Button>
  </div>
</template>

<script lang="ts" setup>
import { useAuth } from "~/api/useAuth";
import type { LoginDTO } from "~/types/DTO/LoginDTO";

definePageMeta({
  layout: "auth",
});

const { loginMutation } = useAuth();

const loginDTO: LoginDTO = {
  account: "",
  password: "",
};

const login = async () => {
  await loginMutation.mutateAsync(loginDTO);
};
</script>
