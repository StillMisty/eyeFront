import { useMutation } from "@tanstack/vue-query";
import { toast } from "vue-sonner";
import type { ApiError } from "~/types/DTO/ApiError";
import type { LoginDTO } from "~/types/DTO/LoginDTO";
import type { RegisterDTO } from "~/types/DTO/RegisterDTO";
import type { TokenDTO } from "~/types/DTO/TokenDTO";

export function useAuth() {
  const apiUrl = useRuntimeConfig().public.apiUrl;
  const cookie = useCookie("auth-token", {
    // httpOnly设置为false，因为客户端JavaScript需要读取它
    httpOnly: false,
    // 设置 cookie 路径为根路径
    path: "/",
    // 根据需要设置有效期
    maxAge: 60 * 60 * 24 * 7, // 7天
    // 在生产环境中建议设置为 true
    secure: process.env.NODE_ENV === "production",
  });

  const isAuthenticated = computed(() => !!cookie.value);

  const register = async (registerDTO: RegisterDTO) => {
    const res: TokenDTO = await $fetch(`${apiUrl}/api/v1/auth/register`, {
      method: "POST",
      body: registerDTO,
    });

    // 保存 jwt 到 cookie
    if (res.token_type === "bearer" && res.access_token) {
      cookie.value = res.access_token;
    }

    return res;
  };

  const login = async (loginDTO: LoginDTO) => {
    const res: TokenDTO = await $fetch(`${apiUrl}/api/v1/auth/login`, {
      method: "POST",
      body: loginDTO,
    });

    // 保存 jwt 到 cookie
    if (res.token_type === "bearer" && res.access_token) {
      cookie.value = res.access_token;
    }

    return res;
  };

  const logout = () => {
    cookie.value = null;
  };

  // 获取 token 的辅助方法
  const getToken = () => cookie.value;

  const registerMutation = useMutation({
    mutationFn: register,
    onError: (error: ApiError) => {
      toast.error("注册失败：" + error?.data?.detail || "请稍后再试！");
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onError: (error: ApiError) => {
      toast.error("登录失败：" + error?.data?.detail || "请稍后再试！");
    },
  });

  return {
    isAuthenticated,
    loginMutation,
    registerMutation,
    logout,
    getToken,
  };
}
