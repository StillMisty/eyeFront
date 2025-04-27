<template>
  <div class="w-full max-w-md px-6">
    <div
      class="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700"
    >
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          注册账户
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          创建您的账户以开始使用
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
            v-model="registerDTO.account"
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
            v-model="registerDTO.password"
            type="password"
            placeholder="请输入密码"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <Label
            for="birth_date"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >出生日期</Label
          >
          <Input
            id="birth_date"
            v-model="birthDateStr"
            type="date"
            :max="maxDateStr"
            class="w-full"
          />
          <p v-if="dateError" class="text-xs text-red-500 mt-1">
            {{ dateError }}
          </p>
        </div>

        <div class="space-y-2">
          <Label>性别</Label>
          <div class="flex gap-4 mt-1">
            <Label class="inline-flex items-center">
              <Input
                type="radio"
                v-model="registerDTO.gender"
                name="gender"
                :value="Gender.Male"
                class="h-4 w-4 text-primary border-gray-300 focus:ring-primary/30"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >男性</span
              >
            </Label>
            <Label class="inline-flex items-center">
              <Input
                type="radio"
                v-model="registerDTO.gender"
                name="gender"
                :value="Gender.Female"
                class="h-4 w-4 text-primary border-gray-300 focus:ring-primary/30"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >女性</span
              >
            </Label>
          </div>
        </div>

        <Button
          class="w-full"
          @click="register"
          :disabled="registerMutation.isPending.value"
        >
          <span
            v-if="registerMutation.isPending.value"
            class="flex items-center justify-center"
          >
            <span
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"
            ></span>
            注册中...
          </span>
          <span v-else>注册</span>
        </Button>

        <div class="text-center text-sm mt-5">
          已有账户?
          <NuxtLink
            to="/login"
            class="font-medium text-primary hover:text-primary/80"
          >
            返回登录
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuth } from "~/api/useAuth";
import type { RegisterDTO } from "~/types/DTO/RegisterDTO";
import { Gender } from "~/types/Gender";

definePageMeta({
  layout: "auth",
});

const { registerMutation } = useAuth();
const router = useRouter();

const registerDTO = reactive<RegisterDTO>({
  account: "",
  password: "",
  birth_date: new Date(),
  gender: Gender.Male,
});

// 日期验证相关
const today = new Date();
const maxDateStr = ref(today.toISOString().split("T")[0]);
const dateError = ref("");

// 用于日期输入
const birthDateStr = ref(today.toISOString().split("T")[0]);
watch(birthDateStr, (newValue) => {
  if (newValue) {
    const selectedDate = new Date(newValue);
    if (selectedDate > today) {
      dateError.value = "出生日期不能超过当前日期";
      return;
    }
    dateError.value = "";
    registerDTO.birth_date = selectedDate;
  }
});

const register = async () => {
  // 验证出生日期
  if (registerDTO.birth_date > today) {
    dateError.value = "出生日期不能超过当前日期";
    return;
  }

  try {
    await registerMutation.mutateAsync(registerDTO);
    router.push("/login");
  } catch (error) {
    // 注册失败时的错误处理已在useAuth中配置
  }
};
</script>
