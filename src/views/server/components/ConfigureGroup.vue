<script setup lang="ts">
import Configure from "./Configure.vue";
import { ServerModule } from "/@/api/server";

defineProps<{
  modules: ServerModule[];
  disabled: boolean;
}>();
</script>

<template>
  <el-card class="configure-group">
    <configure v-for="item of modules" :key="item.name" :module="item" :disabled="disabled"></configure>
  </el-card>
</template>

<style lang="scss" scoped>
.configure-group {
}
</style>
