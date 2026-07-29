<script setup lang="ts">
import { Toaster, type ToasterProps } from 'vue-sonner'
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()
const props = defineProps<ToasterProps>()

const delegated = computed(() => {
  const {
    theme: _theme,
    offset: _offset,
    toastOptions: _toastOptions,
    ...rest
  } = props
  void _theme
  void _offset
  void _toastOptions
  return rest
})
</script>

<template>
  <Toaster
    :theme="theme"
    class="toaster group"
    :offset="16"
    :toast-options="{
      classes: {
        toast:
          'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-md',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
      },
    }"
    v-bind="delegated"
  />
</template>
