<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>使用技巧</DialogTitle>
        <DialogDescription class="grid text-xl gap-2">
          <p>
            1.
            <strong>上传图片</strong
            >：点击“上传图片”按钮，选择要识别的眼底照片，上传图片需清晰、无遮挡。
          </p>
          <p>
            2.
            <strong>热力图解</strong
            >：点击“生成热力图”按钮，系统将自动分析图片并生成热力图，帮助识别眼部疾病。
          </p>
          <p>
            3.
            <strong>疾病介绍</strong
            >：点击“疾病介绍”按钮，查看常见眼疾的详细信息。
          </p>
          <p>
            4.
            <strong>历史记录</strong
            >：点击“历史记录”按钮，查看之前上传的图片和识别结果。
          </p>
          <p>
            5.
            <strong>个人信息</strong
            >：点击右上角的用户头像，查看和编辑个人信息。
          </p>
          <p>
            6.
            <strong>退出账号</strong
            >：在个人信息菜单中选择“退出账号”，安全退出当前账号。
          </p>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

defineProps<{
  open: boolean;
}>();
</script>
