<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
// import OrderDlg, { OrderFunc } from "../server/components/OrderDlg.vue";
import { checkRecord, deleteRecord, OrderRecordItem, OrderRecordStatus, requestRecordList, requestRecordOrderPdf } from "/@/api/server";

const router = useRouter();
const loading = ref(false);
const recordList = ref<OrderRecordItem[]>([]);

function fetchRecordList() {
  loading.value = true;
  requestRecordList()
    .then(res => {
      recordList.value = (res || []).map(item => {
        const recordItem = new OrderRecordItem();
        Object.assign(recordItem, item);
        return recordItem;
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
fetchRecordList();

const activeName = ref<string>("all");
const activeRecordList = computed(() => {
  if (activeName.value === "all") {
    return recordList.value;
  }
  return recordList.value.filter(record => OrderRecordStatus[record.status] === activeName.value);
});
const loadingPdf = ref(false);
function openOrderList(record: OrderRecordItem) {
  loadingPdf.value = true;
  requestRecordOrderPdf(record.id)
    .then(res => {
      window.open(res.url, "_blank");
    })
    .catch(() => {
      ElMessage.error("操作错误，请联系管理员！");
    })
    .finally(() => {
      loadingPdf.value = false;
    });
}
const loadingDelete = ref(false);
function deleteRecordItem(record: OrderRecordItem) {
  ElMessageBox.confirm("确定删除此记录吗？", "温馨提示")
    .then(() => {
      loadingDelete.value = true;
      deleteRecord(record.id)
        .then(() => {
          ElMessage.success("删除成功");
          fetchRecordList();
        })
        .catch(() => {
          ElMessage.error("操作错误，请联系管理员！");
        })
        .finally(() => {
          loadingDelete.value = false;
        });
    })
    .catch(() => {});
}

// const showOrderDlg = ref(false);
// const record2copy = ref<OrderRecordItem>();
function oneMoreOrder(record: OrderRecordItem) {
  // record2copy.value = record;
  // showOrderDlg.value = true;
  router.push("/server/detail?recordId=" + record.id);
}

function checkPassOrder(record: OrderRecordItem) {
  ElMessageBox.confirm("确认提交审核吗？", "温馨提示")
    .then(() => {
      checkRecord({
        id: record.id,
        status: OrderRecordStatus.SUBMIT
      })
        .then(() => {
          ElMessage.success("提交审核成功！");
          record.status = OrderRecordStatus.SUBMIT;
        })
        .catch(() => {
          ElMessage.error("操作失败，请联系管理员！");
        });
    })
    .catch(() => {});
}
// const order: OrderFunc = async function (customer, done) {
//   if (!record2copy.value) {
//     done(false);
//     return;
//   }
//   try {
//     const recordDetail = await requestRecordDetail(record2copy.value.id);
//     const recordData = Object.assign(recordDetail, customer);
//     await recordOrder(recordData);
//     ElMessage.success("记录成功");
//     fetchRecordList();
//     done(true);
//     showOrderDlg.value = false;
//   } catch (error) {
//     ElMessage.error("操作错误，请联系管理员！");
//     done(false);
//   }
// };
</script>

<template>
  <div class="record" v-loading="loading">
    <el-tabs v-model="activeName" style="display: inline-block">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="保存记录" :name="OrderRecordStatus[OrderRecordStatus.SAVE_LOCAL]"></el-tab-pane>
      <el-tab-pane label="待审核" :name="OrderRecordStatus[OrderRecordStatus.SUBMIT]"></el-tab-pane>
      <el-tab-pane label="审核通过" :name="OrderRecordStatus[OrderRecordStatus.CHECK_PASS]"></el-tab-pane>
      <el-tab-pane label="审核未通过" :name="OrderRecordStatus[OrderRecordStatus.CHECK_FAIL]"></el-tab-pane>
    </el-tabs>
    <el-card class="record__list" v-for="record of activeRecordList" :key="record.id">
      <el-row :gutter="20">
        <el-col :xs="12" :span="6">
          <vue-fixed-ratio :width="1" :height="1">
            <!-- <img :src="serverDetail.pic" style="width: 100%; height: 100%; object-fit: contain" /> -->
            <el-image :src="record.fpic" fit="contain"></el-image>
          </vue-fixed-ratio>
        </el-col>
        <el-col :xs="12" :span="9">
          <div class="record__list__server">
            <div class="server-host">{{ record.fname }}</div>
            <div class="server-components">{{ record.components.join("\n") }}</div>
          </div>
        </el-col>
        <el-col :xs="12" :span="5">
          <div class="record__list__sales">
            <div>
              <div>原价：{{ record.price }} 元</div>
              <div>折扣：{{ record.discount }}</div>
              <div>总金额：{{ record.offer }} 元</div>
            </div>
            <div style="margin-top: 20px">
              <div>客户：{{ record.name }}</div>
              <div>联系人：{{ record.contact || "-" }}</div>
              <div>手机号：{{ record.mobile || "-" }}</div>
            </div>
            <div style="margin-top: 20px">
              <span>状态：</span>
              <el-tag size="medium" :type="record.statusTag.type">{{ record.statusTag.label }}</el-tag>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :span="4">
          <div class="record__list__action">
            <el-button type="primary" :loading="loadingPdf" @click="openOrderList(record)">查看报价单</el-button>
            <el-button type="danger" :loading="loadingDelete" @click="deleteRecordItem(record)">删除记录</el-button>
            <el-button type="success" @click="oneMoreOrder(record)">再来一单</el-button>
            <el-button v-if="record.status === OrderRecordStatus.SAVE_LOCAL" type="warning" @click="checkPassOrder(record)">提交审核</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-empty v-if="activeRecordList.length === 0"></el-empty>
    <!-- <order-dlg v-model="showOrderDlg" :order="order"></order-dlg> -->
  </div>
</template>

<style lang="scss" scoped>
.record {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &__list {
    flex: 1;
    margin: 10px 0px;
    overflow-y: auto;
    &__server {
      .server-host {
        color: #6124fc;
        font-weight: 700;
      }
      .server-components {
        margin-top: 20px;
        white-space: pre;
      }
    }
    &__action {
      :deep(.el-button) {
        margin-left: 0px;
        width: 100%;
        &:not(:first-of-type) {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
