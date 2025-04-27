import { useMutation } from "@tanstack/vue-query";

export function useIdentify() {
  const apiUrl = useRuntimeConfig().public.apiUrl;

  const identifyEye = async (file: FormData) => {
    const res = await $fetch(`${apiUrl}/api/v1/identify/eye?threshold=0.1`, {
      method: "POST",
      body: file,
    });

    return res;
  };

  const identifyEyeMutation = useMutation({
    mutationFn: identifyEye,
    onSuccess: (data) => {
      // 识别成功后可以执行一些操作，比如显示结果
      console.log("Eye identification successful:", data);
    },
    onError: (error) => {
      // 处理识别错误
      console.error("Eye identification error:", error);
    },
  });

  return {
    identifyEyeMutation,
  };
}
