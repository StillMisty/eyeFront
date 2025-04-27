import { useAuth } from "~/api/useAuth";

export default defineNuxtPlugin((nuxtApp) => {
  const { getToken } = useAuth();

  // 全局请求拦截
  nuxtApp.hook("app:created", () => {
    $fetch.create({
      onRequest({ options }) {
        const token = getToken();
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          };
        }
      },
    });
  });
});
