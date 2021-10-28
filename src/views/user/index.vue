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
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />名称
                <div class="pull-right">{{ user.name }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">{{ user.mobile }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />传真
                <div class="pull-right">{{ user.fax }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />公司
                <div class="pull-right">{{ user.company }}</div>
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
