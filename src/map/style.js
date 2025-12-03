import {
  Icon,
  Text,
  Fill,
  Stroke,
  Style,
  Circle as CircleStyle,
} from "ol/style";

/**
 * 创建图标样式
 * @param {*} iconUrl  图标地址
 * @param {*} scale     图标缩放比例
 * @param {*} anchor    图标锚点
 * @returns
 */
export const createIconStyle = (iconUrl, scale, anchor) => {
  if (!iconUrl) return null;
  if (!scale) scale = 1;
  if (!anchor) anchor = [0.5, 1];
  return new Icon({
    anchor: anchor,
    src: iconUrl,
    scale: scale,
    crossOrigin: "anonymous",
  });
};

export const createFillStyle = (color) => {
  if (!color) return null;
  return new Fill({
    color: color,
  });
};
export const createStrokeStyle = (config = {}) => {
  if (!config.color) return null;
  return new Stroke({
    color: config.color,
    width: config.width,
  });
};

export const createTextStyle = (text, config = {}) => {
  if (!text) return null;
  return new Text({
    font: config.font || "600 16px 微软雅黑,Calibri,sans-serif",
    text: text,
    overflow: true,
    offsetX: config.offsetX,
    offsetY: config.offsetY,
    fill: createFillStyle(config.fill),
    stroke: createStrokeStyle(config.stroke),
  });
};

export const createStyle = (config = {}) => {
  return new Style(config);
};
export const highlightStyle = new Style({
  fill: new Fill({
    color: "rgba(255, 0, 0, 0.3)",
  }),
  stroke: new Stroke({
    color: "rgba(255, 0, 0, 1)",
    width: 1,
  }),
});
export const normalStyle = new Style({
  fill: new Fill({
    color: "rgba(255, 255, 0, 0.3)",
  }),
  stroke: new Stroke({
    color: "rgba(255, 255, 0, 1)",
    width: 1,
  }),
});

export const defaultStyle = new Style({
  // 将点设置成圆形样式
  image: new CircleStyle({
    fill: new Fill({
      color: "#FFFF00",
    }),
    // 圆形半径
    radius: 5,
  }),
  // 线样式
  stroke: new Stroke({
    color: "#ff0000",
    lineCap: "round", // 设置线的两端为圆头
    width: 3,
  }),
  // 填充样式
  fill: new Fill({
    color: "#FFFF0096",
  }),
});

export function getDefaultStyle(icon) {
  let image = icon
    ? createIconStyle(icon)
    : new CircleStyle({
        fill: new Fill({
          color: "#FFFF00",
        }),
        // 圆形半径
        radius: 5,
      });
  return new Style({
    image: image,
    // 线样式
    stroke: new Stroke({
      color: "#ff0000",
      lineCap: "round", // 设置线的两端为圆头
      width: 3,
    }),
    // 填充样式
    fill: new Fill({
      color: "#FFFF0096",
    }),
  });
}
export function defaultTextStyle(text, offsetY) {
  if (!text) {
    return null;
  }
  return new Text({
    text: text,
    font: "12px Calibri,sans-serif",
    offsetY: offsetY || 10,
    fill: new Fill({
      color: "#000",
    }),
    stroke: new Stroke({
      color: "#fff",
      width: 3,
    }),
  });
}
export default {
  createIconStyle,
  createFillStyle,
  createStrokeStyle,
  createTextStyle,
  createStyle,
  defaultTextStyle,
};
