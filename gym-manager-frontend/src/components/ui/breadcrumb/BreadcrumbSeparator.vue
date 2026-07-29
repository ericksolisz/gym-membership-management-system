<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
</script>

<template>
  <li role="presentation" aria-hidden="true" class="[&>svg]:size-3.5">
    <slot><ChevronRight /></slot>
  </li>
</template>
