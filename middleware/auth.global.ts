import { useAuth } from "~/api/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const { isAuthenticated } = useAuth();

    // 如果路由需要认证且用户未登录，重定向到登录页
    if (to.meta.requiresAuth) {
      // 在客户端检查认证状态
      // 如果用户未登录，重定向到登录页
      if (!isAuthenticated.value) {
        const redirectPath = to.fullPath;
        return navigateTo({
          path: "/login",
          query: { redirect: redirectPath },
        });
      }
    }
  }
});
