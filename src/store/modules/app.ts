import { storageLocal } from "/@/utils/storage";
import { deviceDetection } from "/@/utils/deviceDetection";
import { defineStore } from "pinia";
import { store } from "/@/store";
import { GlobalBusinessConfig, UserInfo } from "./types";
import { getGlobalCfg, getUserInfo } from "/@/api/user";
import { addWatermark } from "/@/utils/watermark";

interface AppState {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
  layout: string;
  device: string;
  userInfo: UserInfo | undefined;
  businessCfg: GlobalBusinessConfig | undefined;
}

export const useAppStore = defineStore({
  id: "pure-app",
  state: (): AppState => ({
    sidebar: {
      opened: storageLocal.getItem("sidebarStatus") ? !!+storageLocal.getItem("sidebarStatus") : true,
      withoutAnimation: false
    },
    layout: storageLocal.getItem("responsive-layout")?.layout.match(/(.*)-/)[1] ?? "vertical",
    device: deviceDetection() ? "mobile" : "desktop",
    userInfo: undefined,
    businessCfg: undefined
  }),
  getters: {
    getSidebarStatus() {
      return this.sidebar.opened;
    },
    getDevice() {
      return this.device;
    }
  },
  actions: {
    TOGGLE_SIDEBAR() {
      this.sidebar.opened = !this.sidebar.opened;
      this.sidebar.withoutAnimation = false;
      if (this.sidebar.opened) {
        storageLocal.setItem("sidebarStatus", 1);
      } else {
        storageLocal.setItem("sidebarStatus", 0);
      }
    },
    CLOSE_SIDEBAR(withoutAnimation: boolean) {
      storageLocal.setItem("sidebarStatus", 0);
      this.sidebar.opened = false;
      this.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE(device: string) {
      this.device = device;
    },
    async toggleSideBar() {
      await this.TOGGLE_SIDEBAR();
    },
    closeSideBar(withoutAnimation) {
      this.CLOSE_SIDEBAR(withoutAnimation);
    },
    toggleDevice(device) {
      this.TOGGLE_DEVICE(device);
    },
    setLayout(layout) {
      this.layout = layout;
    },
    async getUserInfo() {
      const userInfo = await getUserInfo();
      this.userInfo = userInfo;

      const name = storageLocal.getItem("info").accountName || userInfo.name;

      addWatermark(name);

      try {
        const cfg = await getGlobalCfg();
        this.businessCfg = cfg;
      } catch (error) {
        //
      }
    }
  }
});

export function useAppStoreHook() {
  return useAppStore(store);
}
