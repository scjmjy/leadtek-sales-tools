<script setup lang="ts">
import { inject, ref, watch } from "vue-demi";
import ConfigureItem from "./ConfigureItem.vue";
import { ServerModule } from "/@/api/server";

const props = defineProps<{
  module: ServerModule;
  disabled: boolean;
}>();
const selected = ref<number>();
const selectedArr = ref([]);
const selectComponent = inject<any>("selectComponent");
const showTip = ref(false);

function showTooltip(delay = 1000) {
  if (showTip.value) {
    return;
  }
  showTip.value = true;
  setTimeout(() => {
    showTip.value = false;
  }, delay);
}

function onCheckboxChange(value: number[]) {
  if (!selectComponent) return;
  const { components } = props.module;
  const coms = components.filter(c => value.includes(c.id));
  // if (coms.length === 0 && !props.module.required && components.length > 0) {
  //   const defaultSelected = components[0];
  //   coms.push(defaultSelected);
  //   selectedArr.value.push(defaultSelected.id);
  // }
  selectComponent({
    moduleId: props.module.id,
    components: coms
  });
}
function onRadioChange(value: number) {
  if (!selectComponent) return;
  const { components } = props.module;
  const coms = components.filter(c => value === c.id);
  selectComponent({
    moduleId: props.module.id,
    components: coms
  });
}
function onRadioGroupClick(e: Event) {
  if (selected.value && props.module.components.length === 1) {
    if (!props.module.required) {
      selected.value = undefined;
      onRadioChange(undefined);
      e.stopPropagation();
      e.preventDefault();
    } else {
      showTooltip();
    }
  }
}

watch(
  () => props.module.selected,
  s => {
    if (Array.isArray(s)) {
      selectedArr.value.length = 0;
      selectedArr.value.push(...s);
      onCheckboxChange(s);
    } else {
      selected.value = s;
      onRadioChange(s);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="configure">
    <el-tooltip v-model="showTip" content="必须选择一个组件！" placement="top-start" manual>
      <el-divider :class="{ 'is-required': module.required }" content-position="left">{{ module.name }}</el-divider>
    </el-tooltip>
    <el-checkbox-group v-if="module.multiple" v-model="selectedArr" :min="module.required ? 1 : 0" :disabled="disabled" class="configure__items" @change="onCheckboxChange">
      <configure-item v-for="(item, index) in module.components" :key="index" v-model="item.count" :group="module" :component="item"></configure-item>
    </el-checkbox-group>
    <el-radio-group v-else v-model="selected" :disabled="disabled" class="configure__items" @change="onRadioChange" @click.capture="onRadioGroupClick">
      <configure-item v-for="(item, index) in module.components" :key="index" v-model="item.count" :group="module" :component="item"></configure-item>
    </el-radio-group>
  </div>
</template>

<style lang="scss" scoped>
.configure {
  :deep(.el-divider) {
    .el-divider__text {
      font-weight: bold;
    }
    &.is-required {
      .el-divider__text {
        &::after {
          content: "*";
          color: red;
          padding-left: 4px;
          font-weight: bold;
          font-size: large;
        }
      }
    }
  }
  &__items {
    background-color: var(--el-color-info-lighter);
    border-radius: 6px;
    padding: 0 10px;
  }
}
</style>
