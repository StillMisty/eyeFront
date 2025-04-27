import { useMutation } from "@tanstack/vue-query";
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
    onSuccess: (data) => {
      // 注册成功后可以执行一些操作，比如跳转到登录页
      console.log("Registration successful:", data);
    },
    onError: (error) => {
      // 处理注册错误
      console.error("Registration error:", error);
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // 登录成功后可以执行一些操作，比如跳转到首页
      console.log("Login successful:", data);
    },
    onError: (error) => {
      // 处理登录错误
      console.error("Login error:", error);
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
