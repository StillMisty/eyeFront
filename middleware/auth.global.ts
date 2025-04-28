import { useAuth } from "~/api/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth();

  // 如果路由需要认证且用户未登录，重定向到登录页
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    const redirectPath = to.fullPath;
    return navigateTo({
      path: "/login",
      query: { redirect: redirectPath },
    });
  }
});
