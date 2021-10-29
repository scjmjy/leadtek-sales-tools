import { nextTick, ref, Ref } from "vue";

export type LOAD_STATE = "loading" | "more" | "nomore" | "empty" | "error" | "";

export type RequestApi<T> = (page: number, pageSize: number) => Promise<T[]>;
export type BeforeDataHandler<T> = (data: T[]) => T[];
export type AfterDataHandler = (currentPage: number) => void;
export type OnDataErrorHandler = () => void;
export type OnDataFinishHandler = () => void;

export interface Handlers<T> {
  beforeDataHandler?: BeforeDataHandler<T>;
  afterDataHandler?: AfterDataHandler;
  onDataError?: OnDataErrorHandler;
  onDataFinish?: OnDataFinishHandler;
}

export default class PageScroll<T> {
  currentPage = 0;
  nextRequestPage = 1;
  loadState = ref<LOAD_STATE>("");
  constructor(
    public requestApi: RequestApi<T>,
    public dataArray: Ref<T[]>,
    public handlers?: Handlers<T>,
    public pageSize = 10
  ) {}
  /**
   * 请求数据，如果当前页已满，则请求的是下一页；否则请求当前页的数据
   */
  doRequestPage() {
    // nomore 说明 currentPage 还没有满足 pageSize 个数据，所以不用 + 1
    this.loadState.value = "loading";
    return this.requestApi(this.nextRequestPage, this.pageSize)
      .then(res => {
        let result = res || [];
        if (result.length < this.pageSize) {
          // 说明 nextRequestPage 不足 pageSize 个数据，所以也是 nomore, nextRequestPage 不用 + 1
          this.currentPage = this.nextRequestPage;
          this.loadState.value = "nomore";
        } else if (result.length >= this.pageSize) {
          this.currentPage = this.nextRequestPage;
          this.loadState.value = "more";
          // 说明 nextRequestPage 正好是 pageSize 个数据，所以 nextRequestPage + 1 可能还有数据
          this.nextRequestPage++;
        }
        if (this.handlers && this.handlers.beforeDataHandler) {
          result = this.handlers.beforeDataHandler(result) || result;
        }
        if (result.length) {
          this.dataArray.value.splice((this.currentPage - 1) * this.pageSize, this.pageSize, ...result);
        }
        this.handlers && this.handlers.afterDataHandler && this.handlers.afterDataHandler(this.currentPage);
        if (this.dataArray.value.length === 0) {
          this.loadState.value = "empty";
        }
      })
      .catch(() => {
        this.loadState.value = "error";
        this.handlers && this.handlers.onDataError && this.handlers.onDataError();
      })
      .finally(() => {
        this.handlers && this.handlers.onDataFinish && this.handlers.onDataFinish();
      });
  }
  requestPageIfAllowed() {
    if (["nomore", "loading", "empty"].includes(this.loadState.value)) {
      return;
    }
    return this.doRequestPage();
  }
  requestPageForced() {
    if (this.loadState.value !== "loading") {
      this.loadState.value = "more";
      return this.doRequestPage();
    }
  }
  requestPageIfNeed() {
    if (this.loadState.value !== "loading") {
      this.loadState.value = "more";
    }
  }
  reload(delay?: number) {
    this.currentPage = 0;
    this.nextRequestPage = 1;
    delay = this.dataArray.value.length > 0 ? delay : 0;
    this.dataArray.value.length = 0;
    nextTick(() => {
      this.loadState.value = "";
      if (delay) {
        setTimeout(() => {
          this.doRequestPage();
        }, delay);
      } else {
        this.doRequestPage();
      }
    });
  }
}
