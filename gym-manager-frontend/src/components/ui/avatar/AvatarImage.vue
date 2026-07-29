<script setup lang="ts">
import { AvatarImage } from 'reka-ui'
const props = defineProps<{ src: string; alt?: string }>()
</script>

<template>
  <AvatarImage :src="props.src" :alt="props.alt" class="aspect-square h-full w-full object-cover" />
</template>
