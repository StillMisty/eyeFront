import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/vue-query";
import { toast } from "vue-sonner";
import type { EyeIdentificationResponse } from "~/types/DTO/EyeIdentificationResponse";
import type { EyeIdentificationSuggestionResponse } from "~/types/DTO/EyeIdentificationSuggestionResponse";
import type { IdentityEyeSuggestionRequest } from "~/types/DTO/IdentityEyeSuggestionRequest";
import type { PageRequest } from "~/types/DTO/PageRequest";
import type { PageResponse } from "~/types/DTO/PageResponse";

export function useIdentify() {
  const apiUrl = useRuntimeConfig().public.apiUrl;
  const queryClient = useQueryClient();
  const identifyEye = async (file: FormData, threshold: number = 0.1) => {
    const res: EyeIdentificationResponse = await $fetch(
      `${apiUrl}/api/v1/identify/eye`,
      {
        method: "POST",
        query: {
          threshold,
        },
        body: file,
      },
    );

    return res;
  };

  const fetchIdentifyEyeDetail = async (identification_id: number) => {
    const res: EyeIdentificationResponse = await $fetch(
      `${apiUrl}/api/v1/identify/history/${identification_id}`,
      {
        method: "GET",
      },
    );

    return res;
  };

  const fetchIdentifyEyeImage = async (identification_id: number) => {
    const res: Blob = await $fetch(
      `${apiUrl}/api/v1/identify/images/${identification_id}`,
      {
        method: "GET",
        responseType: "blob",
      },
    );

    return res;
  };

  const postIdentityEyeSuggestion = async (
    identityEyeSuggestionRequest: IdentityEyeSuggestionRequest,
  ) => {
    const res: EyeIdentificationSuggestionResponse = await $fetch(
      `${apiUrl}/api/v1/identify/suggestion`,
      {
        method: "POST",
        query: identityEyeSuggestionRequest,
      },
    );

    return res;
  };

  const fetchIdentifyEyeHistory = async (pageRequest: PageRequest) => {
    const res: PageResponse<EyeIdentificationResponse[]> = await $fetch(
      `${apiUrl}/api/v1/identify/history`,
      {
        method: "GET",
        query: pageRequest,
      },
    );

    return res;
  };

  const deleteEyeHistory = async (identification_id: number) => {
    const res = await $fetch(
      `${apiUrl}/api/v1/identify/history/${identification_id}`,
      {
        method: "DELETE",
      },
    );

    return res;
  };

  const generateGridCam = async (file: FormData) => {
    const res: Blob = await $fetch(`${apiUrl}/api/v1/identify/gradcam`, {
      method: "POST",
      body: file,
      responseType: "blob",
    });

    return res;
  };

  /**
   * 识别眼部
   */
  const identifyEyeMutation = useMutation({
    mutationFn: identifyEye,
    onSuccess: (data) => {
      queryClient.setQueryData(["identifyEyeDetail", data.id], data);
    },
    onError: (error) => {
      toast.error("识别失败：" + error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["identifyEyeDetail"],
      });
    },
  });

  /**
   * 获取眼部识别记录详情
   */
  const identifyEyeDetailQuery = (identification_id: number) =>
    useQuery({
      queryKey: ["identifyEyeDetail", identification_id],
      queryFn: () => fetchIdentifyEyeDetail(identification_id),
      enabled: !!identification_id,
    });

  /**
   * 获取眼部识别记录详情图片
   */
  const identifyEyeImageQuery = (identification_id: number) =>
    useQuery({
      queryKey: ["identifyEyeImage", identification_id],
      queryFn: () => fetchIdentifyEyeImage(identification_id),
      enabled: !!identification_id,
    });

  /**
   * 获取眼部识别建议
   */
  const identityEyeSuggestionQuery = (
    identityEyeSuggestionRequest: Ref<IdentityEyeSuggestionRequest>,
    enabled: ComputedRef<boolean> = computed(
      () => !!identityEyeSuggestionRequest.value,
    ),
  ) =>
    useQuery({
      queryKey: ["identityEyeSuggestion", identityEyeSuggestionRequest],
      queryFn: () =>
        postIdentityEyeSuggestion(identityEyeSuggestionRequest.value),
      enabled,
    });

  const identifyEyeHistoryQuery = (pageRequest: Ref<PageRequest>) =>
    useQuery({
      queryKey: ["identifyEyeHistory", pageRequest],
      queryFn: () => fetchIdentifyEyeHistory(pageRequest.value),
      enabled: !!pageRequest,
      placeholderData: keepPreviousData,
    });

  const deleteEyeHistoryMutation = useMutation({
    mutationFn: deleteEyeHistory,
    onSuccess: () => {
      toast.success("删除成功");
      queryClient.invalidateQueries({
        queryKey: ["identifyEyeHistory"],
      });
    },
    onError: (error) => {
      toast.error("删除失败：" + error.message);
    },
  });

  /**
   * 生成眼部识别的Grad-CAM
   */
  const generateGridCamMutation = useMutation({
    mutationFn: generateGridCam,
    onError: (error) => {
      toast.error("生成Grad-CAM失败：" + error.message);
    },
  });

  return {
    identifyEyeMutation,
    identifyEyeDetailQuery,
    identifyEyeImageQuery,
    identityEyeSuggestionQuery,
    identifyEyeHistoryQuery,
    postIdentityEyeSuggestion,
    deleteEyeHistoryMutation,
    generateGridCamMutation,
  };
}
