<template>
  <el-form ref="refForm" :model="passwd" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldpwd">
      <el-input v-model="passwd.oldpwd" placeholder="请输入旧密码" type="password" />
    </el-form-item>
    <el-form-item label="新密码" prop="newpwd">
      <el-input v-model="passwd.newpwd" placeholder="请输入新密码" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="passwd.confirmPassword" placeholder="请确认密码" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <!-- <el-button type="danger" size="mini" @click="close">关闭</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormRulesMap } from "element-plus/lib/components/form/src/form.type";
import { validatePassword } from "/@/utils/validate";
import { ElForm, ElMessage } from "element-plus";
import { changePasswd } from "/@/api/server";
import { useRouter } from "vue-router";
import md5 from "md5";

const router = useRouter();
const refForm = ref<InstanceType<typeof ElForm>>();

const passwd = reactive({
  oldpwd: "",
  newpwd: "",
  confirmPassword: ""
});

const equalToPassword = (rule, value, callback) => {
  if (passwd.newpwd !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
const newPasswdValidator = (rule, value, callback) => {
  if (passwd.oldpwd === value) {
    callback(new Error("新密码不能和旧密码一样"));
  } else if (!validatePassword(value)) {
    callback(new Error("密码至少包含数字，字母，特殊字符中的2种！"));
  } else {
    callback();
  }
};
const rules = {
  oldpwd: [{ required: true, message: "旧密码不能为空", trigger: ["blur", "change"] }],
  newpwd: [
    { required: true, message: "新密码不能为空", trigger: ["blur", "change"] },
    { min: 8, max: 20, message: "长度在 8 到 20 个字符", trigger: ["blur", "change"] },
    { validator: newPasswdValidator, trigger: ["blur", "change"] }
  ],
  confirmPassword: [
    { required: true, message: "确认密码不能为空", trigger: ["blur", "change"] },
    { validator: equalToPassword, trigger: ["blur", "change"] }
  ]
} as FormRulesMap;

function submit() {
  if (!refForm.value) {
    return;
  }
  refForm.value.validate(valid => {
    if (valid) {
      const passwdSave = {
        oldpwd: md5(passwd.oldpwd),
        newpwd: md5(passwd.newpwd)
      };
      changePasswd(passwdSave)
        .then(() => {
          ElMessage.success("修改密码成功！");
          router.back();
        })
        .catch(err => {
          let msg = "修改密码出错，请联系管理员！";
          if (err && err.response && err.response.data) {
            msg = err.response.data.message;
          }
          ElMessage.error(msg);
        });
    } else {
      ElMessage.warning("表单校验失败！");
    }
  });
}
</script>
