<template>
  <div class="w-full max-w-md px-6">
    <div
      class="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700"
    >
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          登录账户
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          欢迎回来！请输入您的账户信息
        </p>
      </div>

      <div class="space-y-5">
        <div class="space-y-2">
          <Label
            for="account"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >账号</Label
          >
          <Input
            id="account"
            v-model="loginDTO.account"
            placeholder="请输入账号"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <Label
            for="password"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >密码</Label
          >
          <Input
            id="password"
            v-model="loginDTO.password"
            type="password"
            placeholder="请输入密码"
            class="w-full"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Checkbox id="remember-me" class="cursor-pointer" />
            <Label for="remember-me">记住我</Label>
          </div>

          <div class="text-sm">
            <NuxtLink
              to="#"
              class="font-medium text-primary hover:text-primary/80"
            >
              忘记密码?
            </NuxtLink>
          </div>
        </div>

        <Button
          class="w-full cursor-pointer"
          @click="login"
          :disabled="loginMutation.isPending.value"
        >
          <span
            v-if="loginMutation.isPending.value"
            class="flex items-center justify-center"
          >
            <span
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"
            ></span>
            登录中...
          </span>
          <span v-else>登录</span>
        </Button>

        <div class="text-center text-sm mt-5">
          还没有账户?
          <NuxtLink
            to="/register"
            class="font-medium text-primary hover:text-primary/80"
          >
            注册新账户
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from "vue-sonner";
import { useAuth } from "~/api/useAuth";
import type { LoginDTO } from "~/types/DTO/LoginDTO";

definePageMeta({
  layout: "auth",
});

const { loginMutation } = useAuth();
const route = useRoute();
const router = useRouter();

const loginDTO: LoginDTO = {
  account: "",
  password: "",
};

const login = async () => {
  if (!loginDTO.account || !loginDTO.password) {
    toast.error("请输入账号和密码");
    return;
  }

  if (loginDTO.account.length < 6) {
    toast.error("账号长度至少为6位");
    return;
  }

  if (loginDTO.password.length < 6) {
    toast.error("密码长度至少为6位");
    return;
  }

  await loginMutation.mutateAsync(loginDTO);
  router.push((route.query.redirect as string) || "/");
};
</script>
