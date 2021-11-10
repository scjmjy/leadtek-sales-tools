<template>
  <el-dialog custom-class="order-dlg" :title="title" width="500px" :close-on-click-modal="false" :close-on-press-escape="false" :model-value="modelValue" destroy-on-close v-bind="$attrs">
    <el-form ref="elForm" :model="formData" :rules="formRules" label-width="100px" label-position="right" @validate="onValidate">
      <el-form-item label="客户姓名" prop="name">
        <!-- <el-input v-model="formData.name"></el-input> -->
        <el-autocomplete v-model="formData.name" :fetch-suggestions="querySearchAsync" placeholder="请输入客户姓名" style="width: 100%" @select="handleSelect">
          <template #default="{ item }">
            <div>{{ item.name }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input v-model="formData.contact"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="formData.address"></el-input>
      </el-form-item>
      <el-form-item label="支付方式" prop="pmethod">
        <el-select v-model="formData.pmethod" placeholder="请选择支付方式" style="width: 100%">
          <el-option v-for="(opt, index) of pmethodOpts" :key="index" :label="opt.label" :value="opt.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效期" prop="eday">
        <el-input v-model.number="formData.eday" type="number" min="0" class="order-dlg__form-eday"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input v-model="formData.desc" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button class="el-dialog__footer-btn-cancel" @click="doCancel">取消</el-button>
      <el-button class="el-dialog__footer-btn-ok" type="primary" :loading="loading" :disabled="invalid" @click="doConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, PropType } from "vue";
import { ElForm, ElMessage } from "element-plus";
import { CustomerInfo, requestCustomerList } from "/@/api/server";
import { useAppStoreHook } from "/@/store/modules/app";

export type OrderFunc = (customer: CustomerInfo, done: (success: boolean) => void) => void;

export default defineComponent({
  name: "CustomizeDlg",
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    order: {
      type: Function as PropType<OrderFunc>,
      required: true
    },
    title: {
      type: String,
      default: "填写客户信息"
    }
  },
  setup(props, ctx) {
    const store = useAppStoreHook();
    const loading = ref(false);
    const pmethodOpts = computed(() => {
      if (!store.businessCfg) {
        return;
      }
      const { mapPmethod } = store.businessCfg;
      const opts: any[] = [];
      for (const key in mapPmethod) {
        opts.push({
          label: mapPmethod[key],
          value: key
        });
      }
      return opts;
    });
    function querySearchAsync(queryString: string, cb: (arg?: any) => void) {
      requestCustomerList(queryString)
        .then(res => {
          cb(res);
        })
        .catch(() => {
          cb(undefined);
        });
    }
    function handleSelect(item) {
      Object.assign(formData, item);
    }
    const elForm = ref<InstanceType<typeof ElForm>>();
    const formData = reactive(new CustomerInfo());
    const formRules = computed(() => ({
      name: [{ required: true, message: "请输入客户姓名", trigger: "change" }],
      pmethod: [{ required: true, message: "请选择支付方式", trigger: "change" }],
      eday: [{ required: true, message: "请输入有效期", trigger: "change" }]
    }));
    const invalidProps = ref<Record<string, boolean>>({});
    const invalid = computed(() => {
      return Object.values(invalidProps.value).includes(true);
    });
    return {
      loading,
      pmethodOpts,
      querySearchAsync,
      handleSelect,
      elForm,
      formData,
      formRules,
      invalid,
      doCancel() {
        // Object.assign(formData, new CustomerInfo());
        ctx.emit("update:model-value", false);
      },
      doConfirm() {
        elForm.value?.validate(isValid => {
          if (isValid) {
            // ctx.emit("confirm", formData);
            loading.value = true;
            props.order(formData, success => {
              loading.value = false;
              if (success) {
                ctx.emit("update:model-value", false);
              }
            });
          } else {
            ElMessage.warning("表单校验失败！");
          }
        });
      },
      onValidate(propName: string, pass: boolean) {
        invalidProps.value[propName] = !pass;
      }
    };
  }
});
</script>

<style lang="scss">
.order-dlg {
  &__form-eday::after {
    content: "天";
    position: absolute;
    right: 10px;
    z-index: 0;
  }
}
</style>
