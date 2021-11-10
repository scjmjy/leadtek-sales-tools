<template>
  <el-form ref="refForm" :model="userInfo" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="name">
      <el-input v-model="userInfo.name" />
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
      <el-input v-model="userInfo.mobile" maxlength="11" />
    </el-form-item>
    <el-form-item label="公司" prop="company">
      <el-input v-model="userInfo.company" maxlength="50" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="userInfo.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="传真" prop="fax">
      <el-input v-model="userInfo.fax" maxlength="50" />
    </el-form-item>
    <!-- <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <!-- <el-button type="danger" size="mini" @click="close">关闭</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormRulesMap } from "element-plus/lib/components/form/src/form.type";
import { UserInfo } from "/@/store/modules/types";
import { putUserInfo } from "/@/api/user";
import { ElForm, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useAppStoreHook } from "/@/store/modules/app";
const router = useRouter();
const store = useAppStoreHook();
const refForm = ref<InstanceType<typeof ElForm>>();
const props = defineProps<{
  user: UserInfo;
}>();
const userInfo = reactive(Object.assign({}, props.user));
const rules = {
  name: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  company: [{ required: true, message: "公司名称不能为空", trigger: "blur" }],
  email: [
    { required: true, message: "邮箱地址不能为空", trigger: "blur" },
    {
      type: "email",
      message: "'请输入正确的邮箱地址",
      trigger: "blur"
    }
  ],
  mobile: [
    { required: true, message: "手机号码不能为空", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ]
} as FormRulesMap;

function submit() {
  if (!refForm.value) {
    return;
  }
  refForm.value.validate(valid => {
    if (valid) {
      putUserInfo(userInfo)
        .then(() => {
          ElMessage.success("修改用户信息成功！");
          store.getUserInfo();
          router.back();
        })
        .catch(() => {
          ElMessage.error("修改用户信息出错，请联系管理员！");
        });
    } else {
      ElMessage.warning("表单校验失败！");
    }
  });
}
</script>
