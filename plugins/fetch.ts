import { defineNuxtPlugin, useRuntimeConfig } from "#app";

export default defineNuxtPlugin(() => {
  const apiUrl = useRuntimeConfig().public.apiUrl;

  // 重新定义全局拦截器
  globalThis.$fetch = $fetch.create({
    onRequest({ request, options }) {
      const url = typeof request === "string" ? request : request.url;

      // 对 API 请求添加授权令牌，从 localStorage 获取
      // 仅在客户端执行
      // 仅在请求的 URL 包含 apiUrl 时添加令牌
      if (import.meta.client && url?.includes(apiUrl)) {
        const token = localStorage.getItem("auth-token");
        if (token) {
          options.headers.set("Authorization", `Bearer ${token}`);
        }
      }
    },

    onResponseError({ response }) {
      if (import.meta.client && response?.status === 401) {
        // 如果响应状态是 401 (未授权)，清除 localStorage 中的令牌
        localStorage.removeItem("auth-token");
      }
    },
  });
});
