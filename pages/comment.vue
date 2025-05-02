<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8">用户评论</h1>

    <!-- 提交评论表单 -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">提交新评论</h2>
      <form @submit.prevent="submitComment" class="space-y-6">
        <div class="space-y-2">
          <Label for="rating" class="text-sm font-medium">评分</Label>
          <div class="flex items-center mt-2">
            <div v-for="star in 5" :key="star" class="relative group">
              <button
                type="button"
                @click="newComment.rating = star"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                class="focus:outline-none p-1 cursor-pointer transition-transform hover:scale-110"
              >
                <Star
                  :size="32"
                  :class="[
                    hoverRating >= star ||
                    (!hoverRating && newComment.rating >= star)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300',
                    'transition-all duration-200',
                  ]"
                />
              </button>
              <span
                v-if="showRatingTooltip && hoverRating === star"
                class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {{ getRatingLabel(star) }}
              </span>
            </div>
          </div>
          <div class="text-sm text-slate-500 mt-1 h-5">
            {{
              newComment.rating > 0
                ? `您的评分：${newComment.rating}星 - ${getRatingLabel(newComment.rating)}`
                : "请选择评分"
            }}
          </div>
        </div>

        <div class="space-y-2">
          <Label for="comment" class="text-sm font-medium">评论内容</Label>
          <div class="relative">
            <Textarea
              id="comment"
              v-model="newComment.comment"
              placeholder="请分享您的体验和建议..."
              class="w-full resize-none min-h-[120px] pr-12"
              :minRows="3"
            ></Textarea>
            <div class="absolute bottom-2 right-2 text-xs text-gray-400">
              {{ newComment.comment.length }}/200
            </div>
          </div>
          <p class="text-xs text-slate-500">
            您的反馈对我们非常重要，感谢分享您的使用体验
          </p>
        </div>

        <div class="pt-2">
          <Button
            class="cursor-pointer w-full sm:w-auto"
            type="submit"
            :disabled="commentsIsPending || !isFormValid"
            :loading="commentsIsPending"
          >
            <MessageSquarePlus v-if="!commentsIsPending" class="mr-2 h-4 w-4" />
            <span>{{ commentsIsPending ? "提交中..." : "提交评论" }}</span>
          </Button>
        </div>
      </form>
    </div>

    <!-- 评论列表 -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold">全部评论</h2>
      </div>

      <div v-if="fetchCommentsIsPending" class="p-6 flex justify-center">
        <div class="space-y-4 w-full">
          <Skeleton class="h-24 w-full" />
          <Skeleton class="h-24 w-full" />
          <Skeleton class="h-24 w-full" />
        </div>
      </div>

      <div
        v-else-if="comments?.length === 0"
        class="p-16 text-center text-gray-500"
      >
        <MessageSquareOff class="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>暂无评论</p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div v-for="comment in comments" :key="comment.id" class="p-6">
          <div class="flex justify-between">
            <div class="flex items-center space-x-1">
              <span class="text-sm text-gray-500"
                >用户ID: {{ comment.user_id }}</span
              >
              <span class="text-sm text-gray-400">•</span>
              <span class="text-sm text-gray-500">{{
                formatDate(comment.created_at)
              }}</span>
            </div>
            <div class="flex">
              <Star
                :size="20"
                v-for="i in 5"
                :key="i"
                :class="
                  i <= comment.rating
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                "
              />
            </div>
          </div>
          <p class="mt-2 text-gray-700">
            {{ comment.comment || "无评论内容" }}
          </p>
        </div>
      </div>

      <!-- 分页 -->
      <div
        class="p-6 border-t border-gray-100 flex justify-between items-center"
      >
        <span class="text-sm text-gray-500">
          共 {{ commentsResponse?.total }} 条评论，当前页
          {{ commentsResponse?.page }}/{{ totalPages }}
        </span>
        <div v-if="commentsResponse" class="flex space-x-2">
          <Button
            class="cursor-pointer"
            variant="outline"
            size="sm"
            :disabled="commentsResponse?.page <= 1"
            @click="changePage(commentsResponse?.page - 1)"
          >
            上一页
          </Button>
          <Button
            class="cursor-pointer"
            variant="outline"
            size="sm"
            :disabled="commentsResponse?.page >= totalPages"
            @click="changePage(commentsResponse?.page + 1)"
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Textarea } from "@/components/ui/textarea";
import {
  RefreshCw,
  Loader,
  MessageSquareOff,
  Star,
  MessageSquarePlus,
} from "lucide-vue-next";
import { ref, computed, onMounted } from "vue";
import { toast } from "vue-sonner";
import { useComment } from "~/api/useComment";
import { Order } from "~/types/Order";

const { fetchCommentsQuery, postCommentMutation } = useComment();

// 新评论表单
const newComment = ref({
  comment: "",
  rating: 0,
});

const pageRequest = ref({
  skip: 0,
  limit: 10,
  sort: "created_at",
  order: Order.Desc,
});

const { isPending: commentsIsPending, mutateAsync } = postCommentMutation;
const { isPending: fetchCommentsIsPending, data: commentsResponse } =
  fetchCommentsQuery(pageRequest.value);
const totalPages = computed(() => {
  return commentsResponse.value?.pages || 1;
});

const comments = computed(() => {
  return commentsResponse.value?.items;
});

const isFormValid = computed(() => {
  return (
    newComment.value.rating > 0 && newComment.value.comment.trim().length > 0
  );
});

// 提交新评论
const submitComment = async () => {
  if (!isFormValid.value) return;

  await mutateAsync(newComment.value);

  // 重置表单
  newComment.value = {
    comment: "",
    rating: 0,
  };
};

// 切换页面
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;

  pageRequest.value.skip = (page - 1) * pageRequest.value.limit;
};

// 格式化日期
const formatDate = (date: Date) => {
  if (!date) return "";

  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 获取评分标签
const getRatingLabel = (rating: number) => {
  const labels = ["很差", "较差", "一般", "较好", "很好"];
  return labels[rating - 1] || "";
};

const hoverRating = ref(0);
const showRatingTooltip = ref(true);
</script>
