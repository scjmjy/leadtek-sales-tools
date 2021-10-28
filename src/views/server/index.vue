<script setup lang="ts">
import { computed, shallowRef, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Server, requestServerList, ServerType } from "/@/api/server";
const router = useRouter();
const route = useRoute();
const serverType = ref(route.query.isStation ? ServerType.Station : ServerType.Server);
const serverTypeText = computed(() => (serverType.value === ServerType.Server ? "服务器列表" : "工作站列表"));
const title = computed(() => (serverType.value === ServerType.Server ? "服务器" : "工作站"));
const serverList = shallowRef<Server[]>([]);
requestServerList(serverType.value).then(res => {
  serverList.value = res || [];
});

function configure(item: Server) {
  router.push("/server/detail?id=" + item.id);
}
</script>

<template>
  <div class="server">
    <el-card class="server__header">
      <el-row :gutter="20">
        <el-col :span="4">
          <vue-fixed-ratio :width="1" :height="1">
            <img class="server__header-logo" src="/@/assets/img/logo-server.jpg" style="width: 100%; height: 100%; object-fit: contain" />
          </vue-fixed-ratio>
        </el-col>
        <el-col :span="20">
          <div>
            <div class="server__header-title">{{ title }}</div>
            <div class="server__header-desc">Server Simply offers servers, datacenter and networking solutions. Configure your storage, rack, tower, workstation and networking solution easily online using our server configurator.</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <div class="server__list">
      <div class="server__list-title">{{ serverTypeText }}</div>
      <el-row v-if="serverList.length" class="server__list-list" :gutter="20">
        <el-col :xs="24" :md="12" :lg="8" :xl="6" v-for="server of serverList" :key="server.id" style="margin: 5px 0">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>{{ server.name }}</span>
                <el-button type="primary" size="large" round @click="configure(server)">配置</el-button>
              </div>
            </template>

            <vue-fixed-ratio :width="1" :height="1">
              <img :src="server.pic" style="width: 100%; height: 100%; object-fit: contain" />
            </vue-fixed-ratio>
            <!-- <el-image :src="server.pic"></el-image> -->
            <div class="card-desc">
              <div v-for="(desc, index) of server.features" :key="index">{{ desc }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-empty v-else></el-empty>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.server {
  &__header {
    &-logo {
      width: 100%;
      // height: 200px;
      object-fit: contain;
    }
    &-title {
      color: #fb9741;
      font-size: x-large;
      font-weight: bold;
    }
    &-desc {
      margin-top: 10px;
    }
  }
  &__list {
    margin-top: 20px;
    &-title {
      font-weight: bold;
    }
    &-list {
      margin-top: 10px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #6124fc;
      }
      .card-desc {
        margin-top: 5px;
        color: var(--el-color-info);
        text-align: center;
      }
      :deep(.el-card__header) {
        // padding: 5px 20px;
      }
    }
  }
}
</style>
