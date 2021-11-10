import { Random } from "mockjs";
import { MockMethod } from "vite-plugin-mock";

// type mapType = {
//   plateNumber: string;
//   driver: string;
//   "orientation|1-360": number;
//   "lng|113-114.1-10": number;
//   "lat|34-35.1-10": number;
// };

// // http://mockjs.com/examples.html#Object
// const mapList = (): Array<mapType> => {
//   const result: Array<mapType> = [];
//   for (let index = 0; index < 200; index++) {
//     result.push({
//       plateNumber: "豫A@natural(11111, 99999)@character('upper')",
//       driver: "@cname()",
//       "orientation|1-360": 100,
//       "lng|113-114.1-10": 1,
//       "lat|34-35.1-10": 1
//     });
//   }
//   return result;
// };

const serverRes = {
  code: 0,
  "data|5-10": [
    {
      "id|+1": 202,
      name: "@ctitle",
      pic: Random.image("400x200"),
      "features|2-5": ["@ctitle"]
    }
  ]
};
const tempRes = {
  code: 0,
  "data|5-10": [
    {
      "id|+1": 202,
      name: "@ctitle",
      pic: Random.image("400x200")
    }
  ]
};
const recordRes = {
  code: 0,
  "data|5-10": [
    {
      "id|+1": 202,
      pic: Random.image("400x200"),
      no: '@datetime("yyyyMMddHHmmss")',
      host: "@ctitle",
      components: "@ctitle",
      price: "@ctitle",
      customer: "@cname",
      "state|1": ["LOCAL", "SUBMIT", "PRICE_CHECK_PASS"]
    }
  ]
};
const serverDetailRes = {
  "id|+1": 202,
  name: "@ctitle",
  pic: Random.image("400x200"),
  spec: "@csentence",
  description: "@cparagraph",
  "comGroups|3-5": [
    {
      name: "@ctitle",
      multiple: "@boolean",
      variable: "@boolean",
      "components|1-5": [
        {
          "id|+1": 202,
          name: "@title",
          count: "@integer(1,8)",
          price: "@float(60, 100, 0, 2)"
        }
      ]
    }
  ]
};

export default [
  {
    url: "/server/templates",
    method: "get",
    response: () => {
      return tempRes;
    }
  },
  {
    url: "/server/records",
    method: "get",
    response: () => {
      return recordRes;
    }
  },
  {
    url: "/server",
    method: "get",
    response: () => {
      return serverRes;
    }
  },
  {
    url: "/server/detail",
    method: "get",
    response: ({ query: _query }) => {
      // const { id = 1 } = query;
      return {
        code: 0,
        data: serverDetailRes
      };
    }
  }
] as MockMethod[];
