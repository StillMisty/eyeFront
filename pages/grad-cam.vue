<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">眼部疾病Grad-CAM热力图分析</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 图片上传区域 -->
      <div
        class="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-4"
      >
        <Input
          type="file"
          accept="image/*"
          @change="handleFileChange"
          class="w-48 cursor-pointer"
        />

        <div v-if="file" class="mt-4">
          <p class="text-sm text-gray-500 mb-2">已选择文件: {{ file.name }}</p>
          <div
            class="relative aspect-square max-h-80 w-full overflow-hidden rounded-md border bg-gray-100"
          >
            <img
              v-if="imagePreview"
              :src="imagePreview"
              class="h-full w-full object-contain"
              alt="图片预览"
            />
          </div>
          <Button
            class="mt-4 w-full cursor-pointer"
            :disabled="isGenerating"
            @click="generateGradCam"
          >
            {{ isGenerating ? "生成中..." : "生成Grad-CAM热力图" }}
          </Button>
        </div>

        <div v-else>
          <p class="text-gray-500">请选择一张眼部图片进行分析</p>
        </div>
      </div>

      <!-- 结果展示区域 -->
      <div class="border border-dashed border-gray-300 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Grad-CAM结果</h2>

        <div v-if="isGenerating" class="flex items-center justify-center h-64">
          <div class="flex flex-col items-center gap-4">
            <LoaderCircle class="animate-spin" :size="48" />
            <p>正在生成Grad-CAM热力图...</p>
          </div>
        </div>

        <div v-else-if="gradCamResult" class="mt-4">
          <div
            class="relative aspect-square max-h-80 w-full overflow-hidden rounded-md border bg-gray-100"
          >
            <img
              :src="gradCamResult"
              class="h-full w-full object-contain"
              alt="Grad-CAM结果"
            />
          </div>
          <p class="mt-4 text-sm text-gray-600">
            Grad-CAM热力图可以帮助理解AI模型在诊断时关注的眼部区域。红色区域表示模型在做决策时更为关注的地方。
          </p>
          <Button class="mt-4 w-full cursor-pointer" @click="downloadGradCam">
            下载Grad-CAM图像
          </Button>
        </div>

        <div v-else class="flex items-center justify-center h-64">
          <p class="text-gray-500">
            在左侧上传图片并点击"生成Grad-CAM热力图"按钮
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LoaderCircle } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { useIdentify } from "~/api/useIdentify";

const { generateGridCamMutation } = useIdentify();

// 状态变量
const file = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const gradCamResult = ref<string | null>(null);
const isGenerating = ref(false);

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];

    // 创建图片预览
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file.value);

    // 重置结果
    gradCamResult.value = null;
  }
};

// 生成Grad-CAM热力图
const generateGradCam = async () => {
  if (!file.value) {
    toast.error("请先选择一张图片");
    return;
  }

  try {
    isGenerating.value = true;

    // 创建FormData对象
    const formData = new FormData();
    formData.append("file", file.value);

    // 调用mutation生成Grad-CAM
    const result = await generateGridCamMutation.mutateAsync(formData);

    // 转换Blob为URL
    gradCamResult.value = URL.createObjectURL(result);

    toast.success("Grad-CAM热力图生成成功");
  } catch (error: any) {
    toast.error("生成失败: " + (error.message || "未知错误"));
  } finally {
    isGenerating.value = false;
  }
};

// 下载Grad-CAM图像
const downloadGradCam = () => {
  if (gradCamResult.value) {
    const link = document.createElement("a");
    link.href = gradCamResult.value;
    link.download = `gradcam_${new Date().getTime()}.jpg`;
    link.click();
  }
};
</script>
