<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LogOut, User } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { useMemberStore } from '@/stores/members'

const router = useRouter()
const auth = useAuthStore()
const members = useMemberStore()

function logout() {
  auth.logout()
  members.reset()
  router.push({ name: 'login' })
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="rounded-full" aria-label="Account menu">
        <Avatar class="h-8 w-8">
          <AvatarFallback class="bg-primary/10 text-primary">
            <User class="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-52" align="end">
      <DropdownMenuLabel>
        <div class="flex flex-col">
          <span class="text-sm font-medium text-foreground">Front desk</span>
          <span class="text-xs font-normal text-muted-foreground">Administrator</span>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" @select="logout">
        <LogOut class="h-4 w-4" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
