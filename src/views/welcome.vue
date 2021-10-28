<script setup lang="ts">
import { shallowRef } from "vue";
import { useRouter } from "vue-router";
import { requestLatestRecordList, requestServerTemplates, ServerTemplate, OrderRecordItem, OrderRecordStatusTags } from "../api/server";

const router = useRouter();

const tempList = shallowRef<ServerTemplate[]>([]);
requestServerTemplates().then(res => {
  tempList.value = res || [];
});
const recordList = shallowRef<OrderRecordItem[]>([]);
requestLatestRecordList().then(res => {
  recordList.value = res || [];
  recordList.value.forEach(item => {
    item.statusTag = OrderRecordStatusTags[item.status];
  });
});
function onRecordRowClick(row: OrderRecordItem) {
  router.push("/record?id=" + row.id);
}
function chooseTempalte(item: ServerTemplate) {
  router.push("/server/detail?tempId=" + item.id);
}
</script>

<template>
  <div class="welcome">
    <div class="server-template">
      <div class="server-template__title">模板列表</div>
      <el-row class="server-template__list" :gutter="20">
        <el-col :xs="24" :sm="12" :lg="8" :xl="6" v-for="(item, index) of tempList" :key="index" style="padding: 10px">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>{{ item.name }}</span>
                <el-button type="text" @click="chooseTempalte(item)">选择</el-button>
              </div>
            </template>
            <img :src="item.pic" style="width: 100%; height: 100%; object-fit: contain" />
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="my-record">
      <div class="my-record__title">我的记录</div>
      <el-table class="my-record__list" :data="recordList" :row-style="{ cursor: 'pointer' }" @row-click="onRecordRowClick">
        <el-table-column prop="pic" align="center" width="200px">
          <template #default="scope">
            <el-image :src="scope.row.fpic"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="记录号" prop="no" align="center"></el-table-column>
        <el-table-column label="主机信息" prop="fname" align="center"></el-table-column>
        <el-table-column label="组件信息" prop="components" align="center">
          <template #default="scope">
            <div style="white-space: pre; text-align: left">
              {{ scope.row.components.join("\n") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格信息" prop="price" align="center"></el-table-column>
        <el-table-column label="客户信息" prop="name" align="center"></el-table-column>
        <el-table-column label="状态信息" prop="state" align="center">
          <template #default="scope">
            <el-tag size="medium" :type="scope.row.statusTag.type">{{ scope.row.statusTag.label }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<!-- <style module scoped>
.size {
  height: 335px;
}
</style> -->

<style lang="scss" scoped>
.welcome {
  width: 100%;
  height: 100%;
  .server-template {
    &__title {
      font-weight: bold;
    }
    &__list {
      margin-top: 20px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      :deep(.el-card__header) {
        padding: 5px 20px;
      }
    }
  }
  .my-record {
    margin-top: 20px;
    &__title {
      font-weight: bold;
    }
    &__list {
      margin-top: 20px;
    }
  }
}
</style>
