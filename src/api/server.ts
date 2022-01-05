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
  // features: string[];
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
  options: ""; // semicolon-separated select list

  count: number; // 个数
}

export interface ServerModule {
  id: number;
  name: string;
  desc: string;
  priority: number;
  components: ComponentDetail[];
  multiple: boolean; // 是否多选
  required: boolean; // 是否必选
  // selected?: number | number[]; // 默认选中的component id
  selected?: number[]; // 默认选中的component id
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
    public email = "",
    public address = "",
    public desc = "",
    public pmethod = "",
    public eday = 0
  ) {}
}
// 0：保存订单；1：配置审核；3：价格审核；4：审核通过；5：审核不通过
export enum OrderRecordStatus {
  SAVE_LOCAL = 0,
  CONFIGURE_CHECKING,
  CONFIGURE_CHECK_FAIL,
  PRICE_CHECKING,
  PRICE_CHECK_PASS,
  PRICE_CHECK_FAIL
}

export const OrderRecordStatusText = {
  [OrderRecordStatus.SAVE_LOCAL]: "保存记录",
  [OrderRecordStatus.CONFIGURE_CHECKING]: "配置审核",
  [OrderRecordStatus.CONFIGURE_CHECK_FAIL]: "配置审核未通过",
  [OrderRecordStatus.PRICE_CHECKING]: "价格审核",
  [OrderRecordStatus.PRICE_CHECK_PASS]: "价格审核通过",
  [OrderRecordStatus.PRICE_CHECK_FAIL]: "价格审核未通过"
};
export const OrderRecordStatusTags: Record<
  number,
  { label: string; type: "" | "success" | "warning" | "info" | "danger" }
> = {
  [OrderRecordStatus.SAVE_LOCAL]: {
    label: OrderRecordStatusText[OrderRecordStatus.SAVE_LOCAL],
    type: "" // primary
  },
  [OrderRecordStatus.CONFIGURE_CHECKING]: {
    label: OrderRecordStatusText[OrderRecordStatus.CONFIGURE_CHECKING],
    type: "warning"
  },
  [OrderRecordStatus.CONFIGURE_CHECK_FAIL]: {
    label: OrderRecordStatusText[OrderRecordStatus.CONFIGURE_CHECK_FAIL],
    type: "danger"
  },
  [OrderRecordStatus.PRICE_CHECKING]: {
    label: OrderRecordStatusText[OrderRecordStatus.PRICE_CHECKING],
    type: "warning"
  },
  [OrderRecordStatus.PRICE_CHECK_PASS]: {
    label: OrderRecordStatusText[OrderRecordStatus.PRICE_CHECK_PASS],
    type: "success"
  },
  [OrderRecordStatus.PRICE_CHECK_FAIL]: {
    label: OrderRecordStatusText[OrderRecordStatus.PRICE_CHECK_FAIL],
    type: "danger"
  }
};

export function showCheckDesc(status: number) {
  return [OrderRecordStatus.CONFIGURE_CHECK_FAIL, OrderRecordStatus.PRICE_CHECK_FAIL].includes(status);
}
export class OrderRecordBase extends CustomerInfo {
  discount?: number; // 折扣
  price: number; // 记录总价
  offer?: number; // 折扣总价
  status: OrderRecordStatus; // 记录状态（0：销售保存订单；1：提交PM审核；2：审核通过；3：审核不通过）
  fid: number; // 主机ID
}
export class OrderRecordItem extends OrderRecordBase {
  id: number; // 记录ID
  no: string; // 记录号
  fname: string; // 主机名称
  ftype: ServerType; // 主机类型
  fpic: string;
  components: string[]; // 组件信息列表
  url: string; // 报价单pdf
  checkDesc: string;
  get statusTag() {
    return OrderRecordStatusTags[this.status] || OrderRecordStatusTags[OrderRecordStatus.SAVE_LOCAL];
  }
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

export async function requestLatestRecordList(): Promise<OrderRecordItem[]> {
  const data = await http.request<OrderRecordItem[]>("get", "/api/v1/biz/latestrecords");
  const items = (data || []).map(item => {
    const recordItem = new OrderRecordItem();
    Object.assign(recordItem, item);
    return recordItem;
  });
  return items;
}

export function requestRecordList(page = 1, status?: number, keyword?: string): Promise<OrderRecordItem[]> {
  return http.request("post", "/api/v1/biz/records", {
    page,
    status,
    keyword
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
export interface CheckRecord {
  id: number; // record id
  status: OrderRecordStatus;
}
export function checkRecord(check: CheckRecord): Promise<void> {
  return http.request("post", " /api/v1/biz/recordcheck", check as Object);
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

export function requestCustomerList(name?: string): Promise<CustomerInfo[]> {
  return http.request("post", "/api/v1/biz/customers", { name } as Object);
}
