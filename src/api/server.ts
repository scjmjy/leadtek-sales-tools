import { http } from "../utils/http";
// import { AjaxResponse } from "./types";

export enum ServerType {
  Server = 1,
  Station
}

export interface Server {
  id: number;
  name: string;
  pic: string;
  ftype: ServerType; // 主机类型（1：服务器；2：工作站）
  price: number;
  stock: number; // 库存状态（1：有货；0：无货）
  features: string[];
  desc: string;
}

// export interface Component {
//   id: number;
//   name: string; // 组件名称
//   count: number; // 个数
//   price: number; // 价格
// }

export interface ComponentDetail {
  id: number;
  name: string;
  price: number;
  stock: number; // 库存状态（1：有货；0：无货）
  desc: string;
  priority: number;
  multiple: boolean; // 是否可以选择个数

  count: number; // 个数
}

export interface ServerModule {
  id: number;
  name: string;
  desc: string;
  priority: number;
  components: ComponentDetail[];
  multiple: boolean; // 是否多选
  selected?: number | number[]; // 默认选中的component id
}

export interface ServerDetail extends Server {
  // spec: string;
  // description: string;
  mapCgComponents: Record<number, ServerModule>;
}

export interface ServerTemplate {
  id: number;
  name: string;
  pic: string;
  desc: string;
}

export interface TempComponent {
  cid: number; // 组件id
  count: number;
}
export interface ServerTemplateDetail extends ServerTemplate {
  fid: number;
  ftype: ServerType;
  mapCgComponent: Record<number, TempComponent[]>;
}

export class CustomerInfo {
  constructor(
    public name = "",
    public contact = "",
    public mobile = "",
    public address = "",
    public desc = "",
    public pmethod = "",
    public eday = 0
  ) {}
}

export enum OrderRecordStatus {
  SAVE_LOCAL = 0,
  SUBMIT,
  CHECK_PASS,
  CHECK_FAIL
}
export const OrderRecordStatusText = {
  [OrderRecordStatus.SAVE_LOCAL]: "保存记录",
  [OrderRecordStatus.SUBMIT]: "待审核",
  [OrderRecordStatus.CHECK_PASS]: "审核通过",
  [OrderRecordStatus.CHECK_FAIL]: "审核未通过"
};
export const OrderRecordStatusTags = {
  [OrderRecordStatus.SAVE_LOCAL]: {
    label: OrderRecordStatusText[OrderRecordStatus.SAVE_LOCAL],
    type: "primary"
  },
  [OrderRecordStatus.SUBMIT]: {
    label: OrderRecordStatusText[OrderRecordStatus.SUBMIT],
    type: "warning"
  },
  [OrderRecordStatus.CHECK_PASS]: {
    label: OrderRecordStatusText[OrderRecordStatus.CHECK_PASS],
    type: "success"
  },
  [OrderRecordStatus.CHECK_FAIL]: {
    label: OrderRecordStatusText[OrderRecordStatus.CHECK_FAIL],
    type: "danger"
  }
};
export interface OrderRecordBase extends CustomerInfo {
  discount: number; // 折扣
  price: number; // 记录总价
  offer: number; // 折扣总价
  status: OrderRecordStatus; // 记录状态（0：销售保存订单；1：提交PM审核；2：审核通过；3：审核不通过）
  fid: number; // 主机ID
}
export interface OrderRecordItem extends OrderRecordBase {
  id: number; // 记录ID
  no: string; // 记录号
  fname: string; // 主机名称
  ftype: ServerType; // 主机类型
  fpic: string;
  components: string[]; // 组件信息列表
  url: string; // 报价单pdf
  statusTag?: any;
}
export interface ComponentItem extends TempComponent {
  price: number;
}

export interface OrderRecordDetail extends OrderRecordBase {
  no: string; // 记录号
  fname: string; // 主机名称
  ftype: ServerType; // 主机类型
  components: string[]; // 组件信息列表
  mapCgComponents: Record<number, ComponentItem[]>;
}
export interface OrderRecordCreate extends OrderRecordBase {
  fid: number; // 主机ID
  mapCgComponents: Record<number, ComponentItem[]>;
}

export interface PasswdSave {
  oldpwd: string; // md5
  newpwd: string; // md5
}

export function requestServerTemplates(page = 1): Promise<ServerTemplate[]> {
  return http.request("post", "/api/v1/biz/templates", {
    page
  } as object);
}
export function requestTemplateDetail(id: number): Promise<ServerTemplateDetail> {
  return http.request("get", "/api/v1/biz/template/" + id);
}

export function requestLatestRecordList(): Promise<OrderRecordItem[]> {
  return http.request("get", "/api/v1/biz/latestrecords");
}

export function requestRecordList(page = 1): Promise<OrderRecordItem[]> {
  return http.request("post", "/api/v1/biz/records", {
    page
  } as object);
}

/**
 *
 * @param ftype 主机类型（1：服务器；2：工作站）
 * @param page
 * @returns
 */
export function requestServerList(ftype = ServerType.Server, page = 1): Promise<Server[]> {
  return http.request("post", "/api/v1/biz/frames", {
    ftype,
    page
  } as object);
}

export function requestServerDetail(id: number): Promise<ServerDetail> {
  return http.request("get", "/api/v1/biz/frame/" + id);
}

export function recordOrder(order: OrderRecordCreate): Promise<ServerDetail> {
  return http.request("post", "/api/v1/biz/record", order as Object);
}

export function requestRecordDetail(id: number): Promise<OrderRecordDetail> {
  return http.request("get", "/api/v1/biz/record/" + id);
}

export function requestRecordOrderPdf(id: number): Promise<{ url: string }> {
  return http.request("get", "/api/v1/biz/recordpdf/" + id);
}

export function deleteRecord(id: number): Promise<void> {
  return http.request("delete", "/api/v1/biz/record/" + id);
}

export function changePasswd(passwd: PasswdSave): Promise<void> {
  return http.request("post", "/api/v1/user/pwdsave", passwd as Object);
}
