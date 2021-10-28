<script setup lang="ts">
import { ComponentDetail, ServerModule } from "/@/api/server";

defineProps<{
  group: ServerModule;
  component: ComponentDetail;
  modelValue: number;
}>();
</script>

<template>
  <el-checkbox v-if="group.multiple" class="configure-item" :label="component.id">
    <span v-if="!component.multiple" class="configure-item__count">{{ component.count || 1 }}</span>
    <el-select v-else :model-value="modelValue" v-bind="$attrs" @click.prevent="">
      <el-option label="4" :value="4"></el-option>
      <el-option label="2" :value="2"></el-option>
      <el-option label="1" :value="1"></el-option>
    </el-select>
    <span class="configure-item__x">×</span>
    <span class="configure-item__name">{{ component.name }}</span>
    <span class="configure-item__price">{{ `(${component.price} RMB)` }}</span>
  </el-checkbox>
  <el-radio v-else class="configure-item" :label="component.id">
    <span v-if="!component.multiple" class="configure-item__count">{{ component.count || 1 }}</span>
    <el-select v-else :model-value="modelValue" v-bind="$attrs" @click.prevent="">
      <el-option label="4" :value="4"></el-option>
      <el-option label="2" :value="2"></el-option>
      <el-option label="1" :value="1"></el-option>
    </el-select>
    <span class="configure-item__x">×</span>
    <span class="configure-item__name">{{ component.name }}</span>
    <span class="configure-item__price">{{ `(${component.price} RMB)` }}</span>
  </el-radio>
</template>

<style lang="scss" scoped>
.configure-item {
  margin: 5px 0px;
  width: 100%;
  :deep(.el-input) {
    height: auto;
    line-height: 30px;
    .el-input__inner {
      text-align: center;
      width: 60px;
      padding-left: unset;
      padding-right: 15px;
      height: auto;
      line-height: 30px;
    }
    .el-input__icon {
      height: auto;
      line-height: 30px;
    }
  }

  &__count {
    color: var(--el-color-primary);
    font-weight: bold;
  }
  &__x {
    color: var((--el-color-info));
    margin: 0 5px;
  }
  &__name {
    font-weight: bold;
  }
  &__price {
    margin-left: 5px;
    color: var(--el-color-warning);
  }
}
</style>
