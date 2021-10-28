import { ComponentDetail } from "/@/api/server";

export interface SelectComponentParam {
  moduleId: number;
  components: ComponentDetail[];
}

export type SelectComponentFunc = (param: SelectComponentParam) => void;
