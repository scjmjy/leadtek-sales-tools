<template>
  <el-dialog title="温馨提示" width="500px" :model-value="modelValue" destroy-on-close v-bind="$attrs">
    <div class="out-of-stock__title">以下组件没有库存了：</div>
    <ul class="out-of-stock__list">
      <li v-for="(com, index) in coms" :key="index" class="out-of-stock__list__item">
        <span class="out-of-stock__list__item__count">{{ com.count }}</span>
        <span class="out-of-stock__list__item__x">×</span>
        <span class="out-of-stock__list__item__name">
          {{ com.name }}
        </span>
      </li>
    </ul>
    <template #footer>
      <el-button type="primary" @click="onOk">好的</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ComponentDetail } from "/@/api/server";

export default defineComponent({
  name: "OutOfStockDlg",
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    coms: {
      type: Array as PropType<ComponentDetail[]>,
      required: true
    }
  },
  setup(props, ctx) {
    return {
      onOk() {
        ctx.emit("update:model-value", false);
      }
    };
  }
});
</script>

<style lang="scss">
.out-of-stock {
  &__title {
    font-weight: bold;
    color: var(--el-text-color-primary);
  }
  &__list {
    margin-top: 10px;
    list-style: disc inside;
    &::marker {
      color: #6124fb;
    }
    &__item {
      margin: 3px 0;
      &__count {
        color: var(--el-color-primary);
        font-weight: bold;
      }
      &__x {
        color: var((--el-color-info));
        margin: 0 5px;
      }
      &__name {
        color: var(--el-color-info);
        font-weight: bold;
      }
    }
  }
}
</style>
