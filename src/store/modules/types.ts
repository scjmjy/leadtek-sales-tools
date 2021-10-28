import { RouteRecordName } from "vue-router";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
};

export interface UserInfo {
  company: string;
  name: string;
  mobile: string;
  email: string;
  fax: string;
}

export interface GlobalBusinessConfig {
  taxrate: number;
  discounts: number[];
  mapPmethod: Record<number, string>;
}
