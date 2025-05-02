<template>
  <div
    class="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white"
  >
    <div
      class="max-w-md w-full bg-white rounded-xl shadow-xl p-8 space-y-6 border border-gray-100"
    >
      <div class="text-center">
        <div
          class="mb-4 inline-flex items-center justify-center p-2 bg-blue-50 rounded-full"
        >
          <Eye class="h-8 w-8 text-blue-500" />
        </div>
        <h1 class="text-2xl font-bold text-gray-800">眼疾识别</h1>
        <p class="text-gray-500 mt-2">上传眼睛图片，AI 快速分析诊断</p>
      </div>

      <!-- 文件上传区域 -->
      <div
        class="border-2 border-dashed rounded-xl transition-all duration-300"
        :class="[
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-gray-300 hover:border-primary/50',
          imagePreview ? 'border-primary bg-blue-50/30' : '',
        ]"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleFileDrop"
      >
        <div v-if="!imagePreview" class="text-center space-y-4 py-8 px-4">
          <div class="flex justify-center">
            <div class="p-3 rounded-full bg-blue-100 inline-flex">
              <CloudUpload :size="40" class="text-blue-500" />
            </div>
          </div>
          <div class="text-gray-700 space-y-1">
            <p>拖放图片到此处或</p>
            <Label
              for="picture"
              class="inline-flex items-center gap-1 text-primary cursor-pointer hover:underline font-medium"
            >
              <span>点击上传</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CircleHelp
                      class="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    class="bg-white p-0 rounded-lg shadow-lg border-0"
                  >
                    <div class="p-3 space-y-2">
                      <h3 class="text-sm font-medium text-gray-700 mb-1">
                        示例图片
                      </h3>
                      <img
                        src="~/assets/images/example.jpg"
                        alt="眼睛图片示例"
                        class="w-40 h-auto rounded-md border border-gray-200"
                      />
                      <p class="text-xs text-gray-500">
                        请上传类似清晰的眼睛图像
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
          </div>
          <p class="text-xs text-gray-500">支持 JPG, PNG 格式，最大 10MB</p>
        </div>

        <div v-else class="relative p-3">
          <div class="overflow-hidden rounded-lg">
            <img
              :src="imagePreview"
              class="w-full h-auto object-cover max-h-64 transition-transform hover:scale-105 duration-500"
              alt="Eye image preview"
            />
          </div>
          <Button
            @click="clearImage"
            variant="destructive"
            size="icon"
            class="absolute top-6 right-6 rounded-full shadow-md cursor-pointer"
          >
            <X class="h-4 w-4" />
          </Button>
          <p class="text-xs text-gray-500 text-center mt-2">
            已上传：{{ currentFileName }}
          </p>
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
          <span class="text-gray-700">{{ progressStatus }}</span>
          <span class="text-primary font-medium">{{ progress }}%</span>
        </div>
        <Progress v-model="progress" class="w-full h-3" />
      </div>

      <!-- 按钮 -->
      <div class="flex justify-center gap-4">
        <Button
          @click="handleIdentifyEye"
          :disabled="!hasFile || uploading"
          :class="{
            'opacity-50': !hasFile || uploading,
          }"
          size="lg"
          class="px-6 font-medium cursor-pointer"
        >
          <Loader2 v-if="uploading" class="mr-2 h-4 w-4 animate-spin" />
          <ScanSearch v-else class="mr-2 h-4 w-4" />
          <span>{{ uploading ? "处理中..." : "开始识别" }}</span>
        </Button>
        <Button
          v-if="identification_id"
          @click="handleShowResult"
          variant="outline"
          size="lg"
          class="px-6 font-medium cursor-pointer"
        >
          <ScanEye class="mr-2 size-4" />
          查看结果
        </Button>
      </div>

      <!-- 结果状态 -->
      <div
        v-if="resultStatus"
        class="mt-4 p-4 rounded-lg text-center flex items-center justify-center"
        :class="resultStatusClass"
      >
        <CheckCircle2 v-if="resultStatus === 'success'" class="mr-2 h-5 w-5" />
        <AlertCircle
          v-else-if="resultStatus === 'error'"
          class="mr-2 h-5 w-5"
        />
        <span class="font-medium">{{ resultMessage }}</span>
      </div>
    </div>

    <p class="text-gray-500 text-sm mt-6 max-w-md text-center">
      本系统使用先进的人工智能技术识别常见眼部疾病，仅供参考，不能替代专业医生诊断。
    </p>

    <IdentifyDetailsDialog
      v-if="identification_open && identification_id"
      v-model:open="identification_open"
      :identification_id="identification_id"
      :key="identification_id"
    />
    <NewUserDialog
      v-if="newUser_open"
      v-model:open="newUser_open"
    ></NewUserDialog>
  </div>
</template>

<script lang="ts" setup>
import {
  X,
  CloudUpload,
  CircleHelp,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ScanSearch,
  ScanEye,
  Eye,
} from "lucide-vue-next";
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
const currentFileName = computed(() => {
  return currentFile.value?.name
    ? currentFile.value.name.length > 25
      ? currentFile.value.name.substring(0, 22) + "..."
      : currentFile.value.name
    : "未知文件";
});
// 当前页面识别后返回的识别ID
const identification_id = ref<number | null>(null);
// 识别结果详细信息是否显示
const identification_open = ref(false);
const resultStatusClass = computed(() => {
  if (resultStatus.value === "success") {
    return "bg-green-50 text-green-700 border border-green-100";
  } else if (resultStatus.value === "error") {
    return "bg-red-50 text-red-700 border border-red-100";
  }
  return "";
});

const progressStatus = ref("正在处理图像...");
const progressMessages = [
  "分析图像特征...",
  "应用神经网络模型...",
  "对比疾病数据库...",
  "生成诊断结果...",
];

const newUser_open = ref(false);
const route = useRoute();
if (route.query.new) {
  newUser_open.value = true;
}

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

  // 检查文件大小（10MB 限制）
  if (file.size > 10 * 1024 * 1024) {
    resultStatus.value = "error";
    resultMessage.value = "图片大小不能超过 10MB";
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

  // 模拟进度更新及处理状态变化
  const progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.floor(Math.random() * 8) + 3;

      // 根据处理进度更新状态信息
      if (progress.value < 30) {
        progressStatus.value = progressMessages[0];
      } else if (progress.value < 60) {
        progressStatus.value = progressMessages[1];
      } else if (progress.value < 85) {
        progressStatus.value = progressMessages[2];
      } else {
        progressStatus.value = progressMessages[3];
      }
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
    progressStatus.value = "分析完成!";

    // 显示成功消息
    resultStatus.value = "success";
    resultMessage.value = "眼睛识别成功！点击查看详细分析结果";

    // 将识别ID存储到变量中
    identification_id.value = response.id;

    // 打开识别结果详情对话框
    setTimeout(() => {
      identification_open.value = true;
    }, 500);
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

const handleShowResult = () => {
  if (identification_id.value) {
    identification_open.value = true;
  }
};
</script>
