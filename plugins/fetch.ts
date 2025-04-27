import { useAuth } from "~/api/useAuth";

export default defineNuxtPlugin((nuxtApp) => {
  const { getToken, logout } = useAuth();

  // 拦截所有 $fetch 请求
  nuxtApp.hook("app:created", () => {
    const originalFetch = globalThis.$fetch;

    const newFetch = async (url: any, options: any) => {
      const token = getToken();
      const headers = options?.headers || {};

      if (token) {
        options = {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
          },
        };
      }

      try {
        return await originalFetch(url, options);
      } catch (error: any) {
        // 如果响应状态是 401 (未授权)，清除cookie中的令牌
        if (error.response?.status === 401) {
          logout();
          console.warn("认证失败，已清除令牌");
          navigateTo("/login");
        }
        throw error;
      }
    };

    newFetch.raw = originalFetch.raw;
    newFetch.create = originalFetch.create;

    globalThis.$fetch = newFetch;
  });
});
