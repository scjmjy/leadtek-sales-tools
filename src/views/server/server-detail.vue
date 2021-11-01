<template>
  <div class="server-detail">
    <template v-if="serverDetail">
      <el-card>
        <el-row :gutter="30">
          <el-col :xs="24" :sm="20">
            <div class="server-detail__server-info">
              <!-- <div class="server-spec">{{ serverDetail.spec }}</div> -->
              <div class="server-name">{{ serverDetail.name }}</div>
              <div class="server-description">{{ serverDetail.desc }}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="4" style="padding: 20px 0px">
            <vue-fixed-ratio :width="1" :height="1">
              <img :src="serverDetail.pic" style="width: 100%; height: 100%; object-fit: contain" />
            </vue-fixed-ratio>
          </el-col>
        </el-row>
      </el-card>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :xs="24" :sm="16" style="margin-top: 20px">
          <configure-group :modules="serverModules"></configure-group>
        </el-col>
        <el-col :xs="24" :sm="8" style="margin-top: 20px">
          <el-card class="server-detail__manifest">
            <div class="server-detail__manifest-title">当前配置清单</div>
            <ul v-if="selectedComponents.length" class="server-detail__manifest-list">
              <li v-for="(com, index) in selectedComponents" :key="index" class="manifest-item">
                <template v-if="index !== 0">
                  <span class="manifest-item__count">{{ com.count }}</span>
                  <span class="manifest-item__x">×</span>
                </template>
                <span class="manifest-item__name" :class="{ 'is-host': index === 0 }">
                  {{ com.name }}
                </span>
              </li>
            </ul>
            <el-empty v-else></el-empty>
          </el-card>
          <el-form :inline="true" :model="formData" class="server-detail__form">
            <el-form-item label="折扣">
              <el-select v-model="formData.discount" placeholder="请选择折扣">
                <el-option v-for="(opt, index) of discountOpts" :key="index" :label="opt.label" :value="opt.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="server-detail__price">
            <div>当前配置清单总价：</div>
            <div class="server-detail__price-value">{{ discountPrice }} RMB</div>
          </div>
          <div class="server-detail__action">
            <el-button type="primary" @click="saveConfigure">保存当前配置</el-button>
            <el-button type="success" @click="submitConfigure">提交配置审核</el-button>
          </div>
        </el-col>
      </el-row>

      <order-dlg v-model="showOrderDlg" :order="order"></order-dlg>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { computed, provide, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ConfigureGroup from "./components/ConfigureGroup.vue";
import OrderDlg, { OrderFunc } from "./components/OrderDlg.vue";
import { SelectComponentFunc } from "./types";
import { requestServerDetail, ServerModule, ServerDetail, ComponentDetail, recordOrder, OrderRecordCreate, OrderRecordStatus, requestTemplateDetail, ComponentItem, requestRecordDetail } from "/@/api/server";
import { useAppStoreHook } from "/@/store/modules/app";

const route = useRoute();
const router = useRouter();
const store = useAppStoreHook();
const id = +route.query.id;
const tempId = +route.query.tempId;
const recordId = +route.query.recordId;
const serverDetail = ref<ServerDetail>();
// const tempDetail = ref<ServerTemplateDetail>();

const showOrderDlg = ref(false);
const recordStatus = ref<OrderRecordStatus>();

if (tempId && !isNaN(tempId)) {
  requestTemplateDetail(tempId).then(res => {
    const tempDetail = res;
    const fid = res.fid;
    requestServerDetail(fid).then(res => {
      serverDetail.value = Object.assign(res, { id: fid });

      for (const [key, tempComponents] of Object.entries(tempDetail.mapCgComponent)) {
        const moduleId = +key;
        const module = serverDetail.value.mapCgComponents[moduleId];
        if (module) {
          module.selected = module.multiple ? [] : undefined;
          for (const com of tempComponents) {
            const foundCom = module.components.find(c => c.id === com.cid);
            if (foundCom) {
              foundCom.count = com.count;
              if (module.multiple) {
                // @ts-ignore
                module.selected.push(com.cid);
              } else {
                // @ts-ignore
                module.selected = com.cid;
              }
            }
          }
        }
      }
    });
  });
} else if (recordId && !isNaN(recordId)) {
  requestRecordDetail(recordId).then(res => {
    const recordDetail = res;
    const fid = res.fid;
    requestServerDetail(fid).then(res => {
      serverDetail.value = Object.assign(res, { id: fid });

      for (const [key, tempComponents] of Object.entries(recordDetail.mapCgComponents)) {
        const moduleId = +key;
        const module = serverDetail.value.mapCgComponents[moduleId];
        if (module) {
          module.selected = module.multiple ? [] : undefined;
          for (const com of tempComponents) {
            const foundCom = module.components.find(c => c.id === com.cid);
            if (foundCom) {
              foundCom.count = com.count;
              if (module.multiple) {
                // @ts-ignore
                module.selected.push(com.cid);
              } else {
                // @ts-ignore
                module.selected = com.cid;
              }
            }
          }
        }
      }
    });
  });
} else if (id && !isNaN(id)) {
  requestServerDetail(id).then(res => {
    serverDetail.value = Object.assign(res, { id });
  });
}
const serverModules = computed<ServerModule[]>(() => {
  if (!serverDetail.value) {
    return [];
  }
  const modules: ServerModule[] = [];
  const { mapCgComponents } = serverDetail.value;
  for (const moduleId in mapCgComponents) {
    const module = mapCgComponents[moduleId];
    for (const com of module.components) {
      !com.count && (com.count = 1);
    }
    module.components.sort((a, b) => b.priority - a.priority);
    modules.push(
      Object.assign(module, {
        id: +moduleId
      })
    );
  }
  return modules.sort((a, b) => b.priority - a.priority);
});
const selectedModules = ref<ServerModule[]>([]);
const selectedComponents = computed(() => {
  if (!serverDetail.value) {
    return [];
  }
  const { id, price, name } = serverDetail.value;
  const coms: ComponentDetail[] = [
    {
      id,
      name,
      price: price || 0,
      stock: 1, // 库存状态（1：有货；0：无货）
      desc: "",
      priority: 0,
      multiple: false, // 是否可以选择个数
      count: 1 // 个数
    }
  ];
  selectedModules.value.forEach(module => {
    coms.push(...module.components);
  });
  return coms;
});
const discountOpts = computed(() => {
  if (!store.businessCfg) {
    return;
  }
  const opts: any[] = store.businessCfg.discounts.map(item => ({
    label: item,
    value: item
  }));
  opts.push({
    label: "无折扣",
    value: 1
  });
  return opts;
});
const formData = reactive({
  discount: 1
});
const totalPrice = computed(() => {
  let price = selectedComponents.value.reduce((pre, val) => pre + (val.count || 1) * val.price, 0);
  return price;
});
const discountPrice = computed(() => {
  let price = totalPrice.value;
  if (formData.discount) {
    price *= formData.discount;
  }
  return price;
});

const order: OrderFunc = function (customer, done) {
  if (!serverDetail.value) {
    done(false);
  }
  const { id } = serverDetail.value;
  const mapCgComponents: Record<number, ComponentItem[]> = {};
  for (const module of selectedModules.value) {
    mapCgComponents[module.id] = module.components.map(com => ({
      cid: com.id,
      count: com.count || 1,
      price: com.price
    }));
  }
  const orderData: OrderRecordCreate = {
    fid: id,
    price: totalPrice.value,
    discount: formData.discount,
    offer: discountPrice.value,
    status: recordStatus.value || OrderRecordStatus.SAVE_LOCAL,
    mapCgComponents,
    ...customer
  };
  recordOrder(orderData)
    .then(() => {
      done(true);
      router.back();
    })
    .catch(() => {
      done(false);
      ElMessage.error("操作错误，请联系管理员！");
    });
};

provide<SelectComponentFunc>("selectComponent", function ({ moduleId, components }) {
  const module = selectedModules.value.find(m => m.id === moduleId);
  if (module) {
    module.components = components;
  } else {
    const module = serverModules.value.find(m => m.id === moduleId);
    if (module) {
      selectedModules.value.push(Object.assign({}, module, { components }));
    }
  }
  selectedModules.value.sort((a, b) => b.priority - a.priority);
});

function saveConfigure() {
  recordStatus.value = OrderRecordStatus.SAVE_LOCAL;
  showOrderDlg.value = true;
}

function submitConfigure() {
  recordStatus.value = OrderRecordStatus.SUBMIT;
  showOrderDlg.value = true;
}
</script>

<style lang="scss" scoped>
.server-detail {
  &__server {
    &-info {
      .server-spec {
        color: #fa8d25;
        font-size: 28px;
        font-weight: bold;
      }
      .server-name {
        margin-top: 20px;
        font-weight: bold;
      }
      .server-description {
        margin-top: 20px;
        color: var(--el-color-info);
      }
    }
  }

  &__manifest {
    &-title {
      font-weight: bold;
    }
    &-list {
      margin-top: 10px;
      list-style: disc inside;

      li {
        &::marker {
          color: #6124fb;
        }
      }
      .manifest-item {
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
          &.is-host {
            color: #6124fb;
          }
        }
      }
    }
  }

  &__form {
    margin-top: 20px;
  }

  &__price {
    margin-bottom: 20px;
    padding: 20px;
    background: #fa8d25;
    color: #fff;
    border-radius: 10px;
    text-align: center;
    font-weight: 600;
    &-value {
      margin-top: 10px;
      color: #6124fb;
    }
  }

  &__action {
    :deep(.el-button) {
      width: 100%;
      margin-left: 0px;

      &:not(:first-of-type) {
        margin-top: 10px;
      }
    }
  }
}
</style>
