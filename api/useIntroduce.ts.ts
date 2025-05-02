import { useQuery, useQueryClient } from "@tanstack/vue-query";
import type { DiseaseIntroduceResponse } from "~/types/DTO/DiseaseIntroduceResponse";

export function useIntroduce() {
  const apiUrl = useRuntimeConfig().public.apiUrl;

  const fetchDiseaseIntroduce = async () => {
    const res: DiseaseIntroduceResponse[] = await $fetch(
      `${apiUrl}/api/v1/introduce/`,
      {
        method: "get",
      },
    );

    return res;
  };

  const DiseaseIntroduceQuery = useQuery({
    queryKey: ["DiseaseIntroduce"],
    queryFn: fetchDiseaseIntroduce,
  });

  return { DiseaseIntroduceQuery };
}
