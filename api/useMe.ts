import { useQuery } from "@tanstack/vue-query";
import { useAuth } from "~/api/useAuth";
import type { MeDTO } from "~/types/DTO/MeDTO";

export function useMe() {
  const apiUrl = useRuntimeConfig().public.apiUrl;

  const fetchMe = async () => {
    const response: MeDTO = await $fetch(`${apiUrl}/api/v1/users/me`, {
      method: "GET",
    });
    return response;
  };

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  return {
    meQuery,
  };
}
