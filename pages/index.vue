<template>
  <div
    class="w-full h-full flex flex-col items-center justify-center p-6 bg-gray-50"
  >
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">眼疾识别</h1>
        <p class="text-gray-500 mb-6">上传眼睛图片进行分析</p>
      </div>

      <!-- 文件上传区域 -->
      <div
        class="border-2 border-dashed rounded-lg p-6"
        :class="[
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-primary/50',
          imagePreview ? 'border-primary' : '',
        ]"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleFileDrop"
      >
        <div v-if="!imagePreview" class="text-center space-y-3">
          <div class="flex justify-center">
            <CloudUpload :size="64" />
          </div>
          <div class="text-gray-600 font-medium">
            <p>拖放图片到此处或</p>
            <Label
              for="picture"
              class="inline-flex text-primary cursor-pointer hover:underline"
            >
              选择文件
            </Label>
          </div>
          <p class="text-xs text-gray-500">支持 JPG, PNG 格式</p>
        </div>

        <div v-else class="relative">
          <img
            :src="imagePreview"
            class="w-full h-auto rounded-lg object-cover max-h-64"
            alt="Eye image preview"
          />
          <Button
            @click="clearImage"
            class="absolute top-2 right-2 bg-black/50 text-white cursor-pointer rounded-full p-1 hover:bg-black/70"
          >
            <X />
          </Button>
        </div>

        <Input
          id="picture"
          ref="fileInput"
          type="file"
          accept="image/jpeg, image/png"
          class="hidden"
          @change="handleFileChange"
        />
      </div>

      <!-- 进度条 -->
      <div v-if="uploading" class="space-y-2">
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-700">处理进度</span>
          <span class="text-primary font-medium">{{ progress }}%</span>
        </div>
        <Progress v-model="progress" class="w-full h-2" />
      </div>

      <!-- 按钮 -->
      <div class="flex justify-center">
        <Button
          @click="handleIdentifyEye"
          class="px-6 py-2 transition-all duration-200 w-full"
          :disabled="!hasFile || uploading"
          :class="{
            'opacity-50 cursor-not-allowed': !hasFile || uploading,
          }"
        >
          <span v-if="uploading">处理中...</span>
          <span v-else>开始识别</span>
        </Button>
      </div>

      <!-- 结果状态 -->
      <div
        v-if="resultStatus"
        class="mt-4 p-3 rounded-md text-center"
        :class="resultStatusClass"
      >
        {{ resultMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { X, CloudUpload } from "lucide-vue-next";
import { useIdentify } from "~/api/useIdentify";
import { Progress } from "~/components/ui/progress";

definePageMeta({
  requiresAuth: true,
});

const progress = ref(0);
const imagePreview = ref<string | null>(null);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const hasFile = ref(false);
const resultStatus = ref<"success" | "error" | null>(null);
const resultMessage = ref("");
// 添加一个变量来存储当前选择的文件
const currentFile = ref<File | null>(null);

const resultStatusClass = computed(() => {
  if (resultStatus.value === "success") {
    return "bg-green-50 text-green-700 border border-green-200";
  } else if (resultStatus.value === "error") {
    return "bg-red-50 text-red-700 border border-red-200";
  }
  return "";
});

const { identifyEyeMutation } = useIdentify();

const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false;

  if (event.dataTransfer?.files.length) {
    handleFiles(event.dataTransfer.files);
  }
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    handleFiles(input.files);
  }
};

const handleFiles = (files: FileList) => {
  const file = files[0];

  // 检查文件类型
  if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
    resultStatus.value = "error";
    resultMessage.value = "请上传 JPG 或 PNG 格式的图片";
    return;
  }

  // 保存文件对象
  currentFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
    hasFile.value = true;
    resultStatus.value = null;
  };
  reader.readAsDataURL(file);
};

const clearImage = () => {
  imagePreview.value = null;
  hasFile.value = false;
  currentFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  progress.value = 0;
  resultStatus.value = null;
};

const handleIdentifyEye = async () => {
  if (!currentFile.value && !hasFile.value) return;

  uploading.value = true;
  progress.value = 0;
  resultStatus.value = null;

  // 模拟进度更新
  const progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.floor(Math.random() * 10) + 1;
    }
  }, 300);

  try {
    const formData = new FormData();

    // 使用保存的文件对象
    if (currentFile.value) {
      formData.append("file", currentFile.value);
    }

    const response = await identifyEyeMutation.mutateAsync(formData);
    clearInterval(progressInterval);
    progress.value = 100;

    // 显示成功消息
    resultStatus.value = "success";
    resultMessage.value = "眼睛识别成功！";

    // 可以根据实际返回处理更多逻辑
    console.log(response);
  } catch (error) {
    clearInterval(progressInterval);
    console.error("Error during upload:", error);

    // 显示错误消息
    progress.value = 0;
    resultStatus.value = "error";
    resultMessage.value = "识别过程中出错，请重试";
  } finally {
    uploading.value = false;
  }
};
</script>
