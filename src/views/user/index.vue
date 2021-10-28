<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="10" :xs="24">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <div>
            <!-- <div class="text-center">
              <userAvatar :user="user" />
            </div> -->
            <ul class="list-group">
              <li class="list-group-item">
                <i class="fa fa-user">名称</i>
                <div class="pull-right">{{ user.name }}</div>
              </li>
              <li class="list-group-item">
                <i class="fa fa-phone">手机号码</i>
                <div class="pull-right">{{ user.mobile }}</div>
              </li>
              <li class="list-group-item">
                <i class="fa fa-home">公司</i>
                <div class="pull-right">{{ user.company }}</div>
              </li>
              <li class="list-group-item">
                <i class="fa fa-at"></i>邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <i class="fa fa-podcast">传真</i>
                <div class="pull-right">{{ user.fax }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14" :xs="24">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>基本资料</span>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
// import userAvatar from "./userAvatar";
import userInfo from "./userInfo.vue";
import resetPwd from "./resetPwd.vue";
import { useAppStoreHook } from "/@/store/modules/app";
const store = useAppStoreHook();
const user = reactive(Object.assign({}, store.userInfo));
const activeTab = ref<"userinfo" | "resetPwd">("userinfo");
</script>

<style lang="scss" scoped>
.list-group {
  padding-left: 0px;
  list-style: none;
}

.list-group-item {
  margin-bottom: -1px;
  padding: 11px 0px;
  font-size: 13px;

  i {
    &::before {
      padding-right: 3px;
    }
  }
}
</style>
