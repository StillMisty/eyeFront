import { useAuth } from "~/api/useAuth";

export default defineNuxtPlugin((nuxtApp) => {
  const { getToken } = useAuth();

  // 拦截所有 $fetch 请求
  nuxtApp.hook("app:created", () => {
    const originalFetch = globalThis.$fetch;

    const newFetch = (url: any, options: any) => {
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

      return originalFetch(url, options);
    };

    newFetch.raw = originalFetch.raw;
    newFetch.create = originalFetch.create;

    globalThis.$fetch = newFetch;
  });
});
