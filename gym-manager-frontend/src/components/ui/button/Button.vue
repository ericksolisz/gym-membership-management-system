<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { type HTMLAttributes, computed } from 'vue'
import { type ButtonVariants, buttonVariants } from '.'
import { cn } from '@/lib/utils'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})

const delegated = computed(() => {
  const { variant, size, class: _cls, as: _as, asChild: _asChild, ...rest } = props
  void variant
  void size
  void _cls
  void _as
  void _asChild
  return rest
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    v-bind="delegated"
  >
    <slot />
  </Primitive>
</template>
