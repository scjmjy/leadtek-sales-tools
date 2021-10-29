<template>
  <div class="load-more" v-loading="state === 'loading'">
    <el-empty v-if="state === 'empty'"></el-empty>
    <i v-else-if="state === 'more'" class="el-icon-arrow-down load-more__more"></i>
    <span v-else-if="state === 'loading'">加载中...</span>
    <divider-h v-else class="load-more__state"> {{ textNoMore }} </divider-h>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { LOAD_STATE } from "/@/utils/page-scroll";
import DividerH from "./DividerH.vue";

export default defineComponent({
  name: "LoadMore",
  components: {
    DividerH
  },
  props: {
    state: {
      type: String as PropType<LOAD_STATE>,
      default: "empty"
    },
    textNoMore: {
      type: String,
      default: "我是有底线的"
    }
  },
  setup() {
    return {};
  }
});
</script>

<style scoped lang="scss">
@keyframes slide-down {
  to {
    transform: translateY(10px);
  }
}
.load-more {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  color: var(--el-color-primary);

  &__state {
    white-space: nowrap;
    :deep(.el-divider__text) {
      background-color: var(--el-color-bg);
    }
  }

  &__more {
    font-size: xx-large;
    animation: slide-down 1s infinite;
  }
}
</style>
