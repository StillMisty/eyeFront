import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { toast } from "vue-sonner";
import type { MeDTO } from "~/types/DTO/MeDTO";
import type { MeUpdateDTO } from "~/types/DTO/MeUpdateDTO";

export function useMe() {
  const apiUrl = useRuntimeConfig().public.apiUrl;
  const queryClient = useQueryClient();

  const fetchMe = async () => {
    const response: MeDTO = await $fetch(`${apiUrl}/api/v1/users/me`, {
      method: "GET",
    });
    return response;
  };

  const updateMe = async (meUpdateDTO: MeUpdateDTO) => {
    const response: MeDTO = await $fetch(`${apiUrl}/api/v1/users/update`, {
      method: "PUT",
      body: meUpdateDTO,
    });
    return response;
  };

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  const meMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
      toast.success("个人信息修改成功");
    },
  });

  return {
    meQuery,
    meMutation,
  };
}
