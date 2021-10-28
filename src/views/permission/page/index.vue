<script setup lang="ts">
import { ref, unref } from "vue";
import { storageLocal } from "/@/utils/storage";

let purview = ref<string>(storageLocal.getItem("info").userName);

function changRole() {
  if (unref(purview) === "admin") {
    storageLocal.setItem("info", {
      username: "test",
      accessToken: "eyJhbGciOiJIUzUxMiJ9.test"
    });
    window.location.reload();
  } else {
    storageLocal.setItem("info", {
      username: "admin",
      accessToken: "eyJhbGciOiJIUzUxMiJ9.admin"
    });
    window.location.reload();
  }
}
</script>

<template>
  <div class="app-container">
    <h4>
      当前角色：
      <span style="font-size: 26px">{{ purview }}</span>
      <p style="color: #ffa500">
        查看左侧菜单变化(系统管理)，模拟后台根据不同角色返回对应路由
      </p>
    </h4>
    <el-button type="primary" @click="changRole">切换角色</el-button>
  </div>
</template>
