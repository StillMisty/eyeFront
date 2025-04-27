<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>眼疾识别</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as-child>
                <NuxtLink to="/"> <Eye /><span>上传图片</span> </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton as-child>
                <NuxtLink to="/history">
                  <FileClock /><span>历史记录</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="w-full justify-start">
                  <User class="mr-2" />
                  {{ meData?.account || "用户" }}
                  <ChevronUp class="ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="isDialogOpen = true">
                  <span>个人信息</span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleLogout">
                  <span>退出账号</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
  <MeInfoUpdateDialog
    v-if="meData"
    v-model:open="isDialogOpen"
    :me-info="meData"
  />
</template>

<script setup lang="ts">
import { Eye, FileClock, User, ChevronUp } from "lucide-vue-next";
import { ref } from "vue";
import { useAuth } from "~/api/useAuth";
import { useMe } from "~/api/useMe";
import MeInfoUpdateDialog from "~/components/MeInfoUpdateDialog.vue";
import DropdownMenu from "~/components/ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuContent from "~/components/ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "~/components/ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenuTrigger from "~/components/ui/dropdown-menu/DropdownMenuTrigger.vue";

const isDialogOpen = ref(false);
const { meQuery } = useMe();
const { logout } = useAuth();
const { data: meData } = meQuery;

const handleLogout = () => {
  logout();
  window.location.href = "/login";
};
</script>
