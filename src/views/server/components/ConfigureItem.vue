<script setup lang="ts">
import { computed } from "vue";
import { ComponentDetail, ServerModule } from "/@/api/server";

const props = defineProps<{
  group: ServerModule;
  component: ComponentDetail;
  modelValue: number;
}>();
const disabled = computed(() => props.component.stock === 0);
</script>

<template>
  <el-checkbox v-if="group.multiple" class="configure-item" :class="{ 'is-no-stock': disabled }" :label="component.id">
    <span v-if="!component.multiple" class="configure-item__count">{{ component.count || 1 }}</span>
    <el-select v-else :model-value="modelValue" v-bind="$attrs" :disabled="disabled" @click.prevent="">
      <el-option v-for="index in 10" :key="index" :label="index" :value="index"></el-option>
    </el-select>
    <span class="configure-item__x">×</span>
    <span class="configure-item__name">{{ component.name }}</span>
    <span class="configure-item__price">{{ `(${component.price} RMB)` }}</span>
  </el-checkbox>
  <el-radio v-else class="configure-item" :class="{ 'is-no-stock': disabled }" :label="component.id">
    <span v-if="!component.multiple" class="configure-item__count">{{ component.count || 1 }}</span>
    <el-select v-else :model-value="modelValue" v-bind="$attrs" :disabled="disabled" @click.prevent="">
      <el-option v-for="index in 10" :key="index" :label="index" :value="index"></el-option>
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

  &.is-no-stock {
    text-decoration: line-through;
  }
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
  // &__stock {
  //   margin-left: 5px;
  //   color: var(--el-color-danger);
  //   text-decoration: unset !important;
  // }
}
</style>
