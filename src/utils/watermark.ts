import Watermark from "@ufologist/watermark.js";

let watermark = undefined;
const watermarkOption = {
  fillStyle: "rgba(0,0,0,0.2)",
  font: "32px serif",
  zIndex: -1
};

export function addWatermark(mark: string) {
  const text = mark + " " + new Date().toLocaleDateString();
  if (!watermark) {
    watermark = new Watermark({
      text,
      ...watermarkOption
    });
  } /*else {
    watermark.render({
      text,
      ...watermarkOption
    });
  }*/
}

// export function removeWatermark() {
//   watermark &&
//     watermark.render({
//       text: ""
//     });
// }
