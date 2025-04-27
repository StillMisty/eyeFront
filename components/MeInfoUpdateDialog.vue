<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>个人信息</DialogTitle>
        <DialogDescription> 更新个人信息 </DialogDescription>
      </DialogHeader>
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

      <RadioGroup v-model="meUpdateDTO.gender">
        <Label>性别</Label>
        <div class="flex gap-4 mt-1">
          <Label class="inline-flex items-center">
            <RadioGroupItem name="gender" :value="Gender.Male" />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >男性</span
            >
          </Label>
          <Label class="inline-flex items-center">
            <RadioGroupItem name="gender" :value="Gender.Female" />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >女性</span
            >
          </Label>
        </div>
      </RadioGroup>
      <DialogFooter>
        <Button @click="handleUpdateMeInfo">保存</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMe } from "~/api/useMe";
import type { MeDTO } from "~/types/DTO/MeDTO";
import type { MeUpdateDTO } from "~/types/DTO/MeUpdateDTO";
import { Gender } from "~/types/Gender";

const { open, meInfo } = defineProps<{
  open: boolean;
  meInfo: MeDTO;
}>();

const emit = defineEmits(["update:open"]);

const { meMutation } = useMe();

const meUpdateDTO = reactive<MeUpdateDTO>({
  birth_date: meInfo.birth_date,
  gender: meInfo.gender,
});

// 日期验证相关
const today = new Date();
const maxDateStr = ref(today.toISOString().split("T")[0]);
const dateError = ref("");

// 用于日期输入 - 使用用户已有的出生日期
const birthDateStr = ref(
  meInfo.birth_date
    ? new Date(meInfo.birth_date).toISOString().split("T")[0]
    : "",
);
watch(birthDateStr, (newValue) => {
  if (newValue) {
    const selectedDate = new Date(newValue);
    if (selectedDate > today) {
      dateError.value = "出生日期不能超过当前日期";
      return;
    }
    dateError.value = "";
    meUpdateDTO.birth_date = selectedDate;
  }
});

const handleUpdateMeInfo = async () => {
  // 验证出生日期
  if (meUpdateDTO.birth_date > today) {
    dateError.value = "出生日期不能超过当前日期";
    return;
  }

  try {
    await meMutation.mutateAsync(meUpdateDTO);
    emit("update:open", false);
  } catch (error) {
    // 注册失败时的错误处理已在useAuth中配置
  }
};
</script>
