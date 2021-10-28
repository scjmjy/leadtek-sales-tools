<script setup lang="ts">
import { inject, ref, watch } from "vue-demi";
import ConfigureItem from "./ConfigureItem.vue";
import { ServerModule } from "/@/api/server";

const props = defineProps<{
  module: ServerModule;
}>();
const selected = ref<number>();
const selectedArr = ref([]);
const selectComponent = inject<any>("selectComponent");

function onCheckboxChange(value: number[]) {
  if (!selectComponent) return;
  const { components } = props.module;
  const coms = components.filter(c => value.includes(c.id));
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

watch(
  () => props.module.selected,
  s => {
    if (Array.isArray(s)) {
      selectedArr.value.length = 0;
      selectedArr.value.push(...s);
      onCheckboxChange(s);
    } else if (s !== undefined) {
      selected.value = s;
      onRadioChange(s);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="configure">
    <el-divider content-position="left">{{ module.name }}</el-divider>
    <el-checkbox-group v-if="module.multiple" v-model="selectedArr" class="configure__items" @change="onCheckboxChange">
      <configure-item v-for="(item, index) in module.components" :key="index" v-model="item.count" :group="module" :component="item"></configure-item>
    </el-checkbox-group>
    <el-radio-group v-else v-model="selected" class="configure__items" @change="onRadioChange">
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
  }
  &__items {
    background-color: var(--el-color-info-lighter);
    border-radius: 6px;
    padding: 0 10px;
  }
}
</style>
