<script setup lang="ts">
import { reactive, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import md5 from "md5";
import { getVerify, getLogin } from "/@/api/user";
import { storageLocal } from "/@/utils/storage";
import { successMessage, warnMessage } from "/@/utils/message";
import info, { ContextProps } from "../components/ReInfo/index.vue";
import { infoType } from "./type";

const router = useRouter();

const loading = ref(false);

// 刷新验证码
const refreshGetVerify = async () => {
  let { svg }: infoType = await getVerify();
  contextInfo.svg = svg;
};

const contextInfo: ContextProps = reactive({
  userName: "wang",
  passWord: "123456",
  verify: null,
  svg: null
});

const toPage = (info: Object): void => {
  storageLocal.setItem("info", info);
  router.push("/");
};

// 登录
const onLogin = async () => {
  let { userName, passWord, verify } = contextInfo;
  try {
    loading.value = true;
    const { name, token, uid }: any = await getLogin({
      username: userName,
      passwd: md5(passWord),
      verify: verify
    });
    successMessage("登录成功！");
    toPage({
      accountName: userName,
      userName: name,
      token: token,
      uid
    });
  } catch (error) {
    warnMessage("登录失败！");
  }
  loading.value = false;

  // let { code, info, accessToken }: infoType = await getLogin({
  //   username: userName,
  //   passwd: md5(passWord),
  //   verify: verify
  // });
  // code === 0
  //   ? successMessage(info) &&
  //     toPage({
  //       username: userName,
  //       accessToken
  //     })
  //   : warnMessage(info);
};

const refreshVerify = (): void => {
  refreshGetVerify();
};

onBeforeMount(() => {
  // refreshGetVerify();
});
</script>

<template>
  <div class="login">
    <info :loading="loading" :ruleForm="contextInfo" @on-behavior="onLogin" @refreshVerify="refreshVerify" />
  </div>
</template>
