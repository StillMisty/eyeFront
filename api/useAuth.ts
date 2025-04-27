import type { RegisterDTO } from "~/types/DTO/RegisterDTO";
import type { TokenDTO } from "~/types/DTO/TokenDTO";

export function useAuth() {
  const apiUrl = useRuntimeConfig().public.apiUrl;

  const isAuthenticated = ref(false);

  const register = async (registerDTO: RegisterDTO) => {
    const response: TokenDTO = await $fetch(`${apiUrl}/api/v1/auth/register`, {
      method: "POST",
      body: registerDTO,
    });
    return response;
  };

  const login = async (account: string, password: string) => {
    const response: TokenDTO = await $fetch(`${apiUrl}/api/v1/auth/login`, {
      method: "POST",
      body: { account, password },
    });
    return response;
  };

  return {
    isAuthenticated,
  };
}
