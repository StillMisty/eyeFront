<template>
  <Sidebar>
    <SidebarContent>
      <!-- 应用标题 -->
      <div class="px-4 py-3 mb-4">
        <div class="flex items-center">
          <div
            class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3"
          >
            <Eye class="text-white h-5 w-5" />
          </div>
          <div>
            <h2 class="font-bold text-lg">眼疾识别系统</h2>
            <p class="text-xs text-gray-500">AI辅助诊断助手</p>
          </div>
        </div>
      </div>

      <SidebarGroup>
        <SidebarGroupLabel>诊断功能</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                :class="{ 'bg-slate-100': isActiveRoute('/') }"
                as-child
              >
                <NuxtLink to="/" class="group">
                  <div class="flex items-center">
                    <div
                      class="mr-2 bg-blue-50 text-blue-500 p-1.5 rounded-md group-hover:bg-blue-100 transition-colors"
                    >
                      <Eye class="h-[18px] w-[18px]" />
                    </div>
                    <span>上传图片</span>
                  </div>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                :class="{ 'bg-slate-100': isActiveRoute('/grad-cam') }"
                as-child
              >
                <NuxtLink to="/grad-cam" class="group">
                  <div class="flex items-center">
                    <div
                      class="mr-2 bg-amber-50 text-amber-500 p-1.5 rounded-md group-hover:bg-amber-100 transition-colors"
                    >
                      <BookOpen class="h-[18px] w-[18px]" />
                    </div>
                    <span>热力图解</span>
                  </div>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>信息与记录</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                :class="{ 'bg-slate-100': isActiveRoute('/introduce') }"
                as-child
              >
                <NuxtLink to="/introduce" class="group">
                  <div class="flex items-center">
                    <div
                      class="mr-2 bg-green-50 text-green-500 p-1.5 rounded-md group-hover:bg-green-100 transition-colors"
                    >
                      <NotebookPen class="h-[18px] w-[18px]" />
                    </div>
                    <span>疾病介绍</span>
                  </div>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                :class="{ 'bg-slate-100': isActiveRoute('/history') }"
                as-child
              >
                <NuxtLink to="/history" class="group">
                  <div class="flex items-center">
                    <div
                      class="mr-2 bg-purple-50 text-purple-500 p-1.5 rounded-md group-hover:bg-purple-100 transition-colors"
                    >
                      <FileClock class="h-[18px] w-[18px]" />
                    </div>
                    <span>历史记录</span>
                  </div>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                :class="{ 'bg-slate-100': isActiveRoute('/comment') }"
                as-child
              >
                <NuxtLink to="/comment" class="group">
                  <div class="flex items-center">
                    <div
                      class="mr-2 bg-rose-50 text-rose-500 p-1.5 rounded-md group-hover:bg-rose-100 transition-colors"
                    >
                      <MessageCircle class="h-[18px] w-[18px]" />
                    </div>
                    <span>用户评论</span>
                  </div>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <div class="text-xs text-slate-500 mb-2">当前版本 v1.0.0</div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            class="w-full justify-between cursor-pointer"
          >
            <User class="size-4" />
            {{ meData?.account || "用户" }}
            <ChevronUp class="size-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-56">
          <div class="p-2">
            <div class="text-sm font-medium">{{ meData?.account }}</div>
          </div>
          <DropdownMenuItem class="cursor-pointer" @click="isDialogOpen = true">
            <Settings class="mr-2 h-4 w-4" />
            <span>个人信息</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="cursor-pointer text-red-500 focus:text-white focus:bg-red-500"
            @click="handleLogout"
          >
            <LogOut class="mr-2 h-4 w-4" />
            <span>退出账号</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  </Sidebar>

  <MeInfoUpdateDialog
    v-if="meData"
    v-model:open="isDialogOpen"
    :me-info="meData"
  />
</template>

<script setup lang="ts">
import {
  Eye,
  FileClock,
  User,
  ChevronUp,
  NotebookPen,
  BookOpen,
  MessageCircle,
  LogOut,
  Settings,
} from "lucide-vue-next";
import { useRoute } from "vue-router";
import { useAuth } from "~/api/useAuth";
import { useComment } from "~/api/useComment";
import { useMe } from "~/api/useMe";
import MeInfoUpdateDialog from "~/components/MeInfoUpdateDialog.vue";
import DropdownMenu from "~/components/ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuContent from "~/components/ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "~/components/ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenuSeparator from "~/components/ui/dropdown-menu/DropdownMenuSeparator.vue";
import DropdownMenuTrigger from "~/components/ui/dropdown-menu/DropdownMenuTrigger.vue";

const isDialogOpen = ref(false);
const { meQuery } = useMe();
const { logout } = useAuth();
const { data: meData } = meQuery;
const route = useRoute();

// 检查当前路由是否激活
const isActiveRoute = (path: string) => {
  return route.path === path;
};

const handleLogout = () => {
  logout();
  useRouter().push("/login");
};
</script>
