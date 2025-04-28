<template>
  <div>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">历史记录</h1>
      <div v-if="historyLoading" class="text-center">
        <p>加载中...</p>
      </div>
      <div v-else-if="historyData">
        <!-- 历史记录表格 -->
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white rounded-lg overflow-hidden">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">ID</th>
                <th class="px-4 py-2 text-left">时间</th>
                <th class="px-4 py-2 text-left">结果</th>
                <th class="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in historyData.items"
                :key="item.id"
                class="border-b hover:bg-gray-50"
              >
                <td class="px-4 py-2">{{ item.id }}</td>
                <td class="px-4 py-2">{{ item.created_at.getTime }}</td>
                <td class="px-4 py-2">
                  <span v-if="item.results" class="text-green-600">匹配</span>
                  <span v-else class="text-red-600">不匹配</span>
                </td>
                <td class="px-4 py-2">
                  <NuxtLink
                    :to="`/detail/${item.id}`"
                    class="text-blue-500 hover:underline"
                    >查看详情</NuxtLink
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页器 -->
        <div class="mt-4">
          <Pagination
            :itemsPerPage="historyPage.limit"
            :page="currentPage"
            :total="historyData?.total || 0"
            @update:page="handlePageChange"
          >
            <PaginationContent>
              <PaginationFirst
                :disabled="currentPage === 1"
                @click="handlePageChange(1)"
              />
              <PaginationPrevious
                :disabled="currentPage === 1"
                @click="handlePageChange(currentPage - 1)"
              />

              <template v-for="page in displayedPages" :key="page">
                <PaginationItem
                  v-if="page !== '...'"
                  :value="page === '...' ? 0 : Number(page)"
                  class="overflow-hidden"
                >
                  <Button
                    @click="handlePageChange(Number(page))"
                    class="size-9"
                    :variant="
                      currentPage === Number(page) ? 'default' : 'outline'
                    "
                  >
                    {{ page }}
                  </Button>
                </PaginationItem>
                <PaginationEllipsis v-else :key="page"></PaginationEllipsis>
              </template>

              <PaginationNext
                :disabled="currentPage === totalPages"
                @click="handlePageChange(currentPage + 1)"
              />
              <PaginationLast
                :disabled="currentPage === totalPages"
                @click="handlePageChange(totalPages)"
              />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <div v-else class="text-center py-10">
        <p>暂无历史记录</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery, keepPreviousData } from "@tanstack/vue-query";
import { useIdentify } from "~/api/useIdentify";
import type { PageRequest } from "~/types/DTO/PageRequest";
import { Order } from "~/types/Order";

definePageMeta({
  requiresAuth: true,
});

// 分页参数
const historyPage: Ref<PageRequest> = ref({
  skip: 0,
  limit: 10,
  order: Order.Desc,
});

const { fetchIdentifyEyeHistory } = useIdentify();
const { data: historyData, isLoading: historyLoading } = useQuery({
  queryKey: ["history", historyPage.value],
  queryFn: () => fetchIdentifyEyeHistory(historyPage.value),
  placeholderData: keepPreviousData,
});

// 分页计算
const currentPage = computed(
  () => Math.floor(historyPage.value.skip / historyPage.value.limit) + 1,
);
const totalPages = computed(() =>
  historyData.value
    ? Math.ceil(historyData.value.total / historyPage.value.limit)
    : 1,
);

// 控制显示哪些页码
const displayedPages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const result = [];

  if (total <= 7) {
    // 如果总页数少于等于7，全部显示
    for (let i = 1; i <= total; i++) {
      result.push(i);
    }
  } else {
    // 总是显示第一页
    result.push(1);

    // 处理省略号和中间页
    if (current <= 3) {
      // 靠近开头，显示前5页
      for (let i = 2; i <= 5; i++) {
        result.push(i);
      }
      result.push("...");
    } else if (current >= total - 2) {
      // 靠近结尾，显示后5页
      result.push("...");
      for (let i = total - 4; i < total; i++) {
        result.push(i);
      }
    } else {
      // 在中间，显示当前页前后各一页
      result.push("...");
      for (let i = current - 1; i <= current + 1; i++) {
        result.push(i);
      }
      result.push("...");
    }

    // 总是显示最后一页
    result.push(total);
  }

  return result;
});

// 处理页码变化
const handlePageChange = (page: number) => {
  historyPage.value = {
    ...historyPage.value,
    skip: (page - 1) * historyPage.value.limit,
  };
};
</script>
