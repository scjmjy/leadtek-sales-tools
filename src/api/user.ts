import { GlobalBusinessConfig, UserInfo } from "../store/modules/types";
import { http } from "../utils/http";
import { storageLocal } from "../utils/storage";

// 获取验证码
export const getVerify = () => {
  return http.request("get", "/captcha");
};

// 登录
export const getLogin = (data: object) => {
  return http.request("post", "/api/v1/user/login", data);
};
// 登录
export const getLogout = () => {
  const uid = storageLocal.getItem("info").uid;
  return http.request("get", "/api/v1/user/logout/" + uid);
};

// 注册
export const getRegist = (data: object) => {
  return http.request("post", "/register", data);
};

export function getUserInfo(): Promise<UserInfo> {
  return http.request("get", "/api/v1/user/info");
}

export function putUserInfo(userInfo: Partial<UserInfo>): Promise<void> {
  return http.request("put", "/api/v1/user/info", userInfo as Object);
}

export function getGlobalCfg(): Promise<GlobalBusinessConfig> {
  return http.request("get", "/api/v1/misc/gconfigs");
}
