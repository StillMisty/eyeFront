<template>
  <div
    class="container mx-auto p-4 h-full flex justify-center items-center flex-col"
  >
    <div v-if="historyLoading" class="text-center size-full">
      <p>加载中...</p>
    </div>
    <div
      v-else-if="historyData && historyData.items.length > 0"
      class="size-full"
    >
      <!-- 历史记录表格 -->
      <Table>
        <TableCaption>最近的眼疾识别记录</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="min-w-32 text-center">编号</TableHead>
            <TableHead class="min-w-32 text-center">时间</TableHead>
            <TableHead class="min-w-32 text-center">照片</TableHead>
            <TableHead class="min-w-32 text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in historyData.items" :key="item.id">
            <TableCell class="text-center">{{ item.id }} </TableCell>
            <TableCell class="text-center">{{
              formatDate(item.created_at)
            }}</TableCell>
            <TableCell class="text-center flex justify-center items-center">
              <img
                class="size-32"
                v-if="item?.image_url"
                :src="get_image_url(item.image_url)"
                alt="眼部图像"
              />
            </TableCell>
            <TableCell>
              <Button
                @click="handleShowDetail(item.id)"
                class="mr-2 cursor-pointer"
                >查看详细</Button
              >
              <Button @click="handleDelete(item.id)" class="cursor-pointer"
                >删除记录</Button
              >
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <!-- 分页器 -->
      <div class="mt-4">
        <Pagination
          :itemsPerPage="historyPage.limit"
          :page="currentPage"
          :total="historyData?.total || 0"
          @update:page="handlePageChange"
        >
          <PaginationContent>
            <PaginationPrevious
              :disabled="currentPage === 1"
              class="cursor-pointer"
            />

            <template v-for="page in displayedPages" :key="page">
              <PaginationItem
                v-if="page !== '...'"
                :value="page === '...' ? 0 : Number(page)"
                class="overflow-hidden"
              >
                <Button
                  class="size-9 cursor-pointer"
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
              class="cursor-pointer"
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
    <div v-else class="text-center py-10">
      <p>暂无历史记录</p>
    </div>
    <IdentifyDetailsDialog
      v-if="identification_open && identification_id"
      v-model:open="identification_open"
      :identification_id="identification_id"
      :key="identification_id"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIdentify } from "~/api/useIdentify";
import type { PageRequest } from "~/types/DTO/PageRequest";
import { Order } from "~/types/Order";
import get_image_url from "~/utils/get_image_url";

definePageMeta({
  requiresAuth: true,
});

const identification_open = ref(false);
const identification_id = ref<number | null>(null);
// 存储图片blob URLs的对象
const imageUrls = ref<Record<string, string>>({});

// 分页参数
const historyPage: Ref<PageRequest> = ref({
  skip: 0,
  limit: 10,
  order: Order.Desc,
});

const { deleteEyeHistoryMutation, identifyEyeHistoryQuery } = useIdentify();
const { data: historyData, isLoading: historyLoading } =
  identifyEyeHistoryQuery(historyPage);

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
  // page = Math.max(1, Math.min(page, totalPages.value));
  historyPage.value = {
    ...historyPage.value,
    skip: (page - 1) * historyPage.value.limit,
  };
  console.log("page", page);
  console.log("historyPage", historyPage.value);
  console.log("currentPage", currentPage.value);
};

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleShowDetail = (new_identification_id: number) => {
  identification_id.value = new_identification_id;
  identification_open.value = true;
};

const handleDelete = async (id: number) => {
  await deleteEyeHistoryMutation.mutateAsync(id);
};
</script>
