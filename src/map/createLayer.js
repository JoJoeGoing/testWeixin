import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import XYZ from "ol/source/XYZ";
import ImageWMS from "ol/source/ImageWMS";
import ImageLayer from "ol/layer/Image";
import { get as getProjection } from "ol/proj";

function getDefaultTDTkey(key) {
  return key ? key : process.env.VUE_APP_TDT_KEY;
}
const getTypeNameFromUrl = (url) => {
  if (!url) {
    return null;
  }
  const temp = url.split("/");
  if (temp.length < 3) {
    return null;
  }
  const length = temp.length;

  return `${temp[length - 3]}:${temp[length - 2]}`;
};

/**
 * 创建天地图图层
 * @param {*} params
 * @returns
 */
export function createTDTLayer(key) {
  const urls = [];
  for (var i = 0; i < 8; i++) {
    const url = `http://t${i}.tianditu.gov.cn/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=${getDefaultTDTkey(
      key
    )}`;
    urls.push(url);
  }
  return new TileLayer({
    source: new XYZ({
      crossOrigin: "anonymous",
      urls: urls,
      maxZoom: 18,
    }),
  });
}
//创建geoserver wms 图层

export function createWmsLayer(config = {}) {
  const params = {
    LAYERS: getTypeNameFromUrl(config.url),
    FORMAT: "image/png",
    VERSION: "1.1.1",
    TILED: true,
  };
  if (config.styles) {
    params.STYLES = config.styles;
  }
  if (config.cql_filter) {
    params.CQL_FILTER = config.cql_filter;
  }
  let projection = "EPSG:4326";
  if (config.proj) {
    projection = getProjection(config.proj);
  }

  const tileConfig = {
    url: config.url,
    params: params,
    projection: projection,
    serverType: "geoserver",
    crossOrigin: "anonymous",
    ratio: 1,
  };
  const layer =
    config.layerType === "tile"
      ? new TileLayer({
          source: new TileWMS(tileConfig),
        })
      : new ImageLayer({
          source: new ImageWMS(tileConfig),
        });
  return layer;
}
