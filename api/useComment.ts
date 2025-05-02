import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/vue-query";
import { toast } from "vue-sonner";
import type { CommentRequest } from "~/types/DTO/CommentRequest";
import type { CommentResponse } from "~/types/DTO/CommentResponse";
import type { PageRequest } from "~/types/DTO/PageRequest";
import type { PageResponse } from "~/types/DTO/PageResponse";

export function useComment() {
  const apiUrl = useRuntimeConfig().public.apiUrl;

  const queryClient = useQueryClient();

  const fetchComments = async (pageRequest: PageRequest) => {
    const res: PageResponse<CommentResponse[]> = await $fetch(
      `${apiUrl}/api/v1/users/ratings/all`,
      {
        method: "GET",
        query: pageRequest,
      },
    );

    return res;
  };

  const postComment = async (comment: CommentRequest) => {
    const res: CommentResponse = await $fetch(
      `${apiUrl}/api/v1/users/ratings`,
      {
        method: "POST",
        body: comment,
      },
    );
    return res;
  };

  const fetchCommentsQuery = (pageRequest: PageRequest) => {
    return useQuery({
      queryKey: ["comments", pageRequest],
      queryFn: () => fetchComments(pageRequest),
      placeholderData: keepPreviousData,
    });
  };

  const postCommentMutation = useMutation({
    mutationFn: (comment: CommentRequest) => postComment(comment),
    onSuccess: () => {
      toast.success("上传评论成功");
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
    onError: () => {
      toast.error("上传评论失败: 评论无意义或内容不当");
    },
  });

  return {
    fetchCommentsQuery,
    postCommentMutation,
  };
}
