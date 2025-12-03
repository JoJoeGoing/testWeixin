import { boundingExtent, extend, createEmpty } from "ol/extent";
// 地图定位预览

/**
 *
 * @param {*} map
 * @param {*} extent [xmin, ymin, xmax, ymax]
 * @param {*} maxZoom
 * @param {*} callback
 * @param {*} padding
 */
export const fitExtent = (map, extent, maxZoom, callback, padding) => {
  if (
    Array.isArray(extent) &&
    extent.length == 4 &&
    extent.indexOf(Infinity) == -1
  ) {
    if (map) {
      map.getView().fit(extent, {
        size: map.getSize(),
        padding: padding,
        constrainResolution: true,
        duration: 500,
        maxZoom: maxZoom,
        callback: callback,
      });
    }
  }
};
/**
 *
 * @param {*} map
 * @param {*} coordinates [[lon, lat], [lon, lat],...]
 * @param {*} maxZoom
 * @param {*} callback
 * @param {*} padding
 */
export const fitPos = (map, coordinates, maxZoom, callback, padding) => {
  try {
    const extent = boundingExtent(coordinates);
    fitExtent(map, extent, maxZoom, callback, padding);
  } catch (error) {
    console.error("多点定位错误");
  }
};

export const fitLayer = (map, layer, maxZoom, callback, padding) => {
  if (layer) {
    const extent = layer.getSource().getExtent();
    fitExtent(map, extent, maxZoom, callback, padding);
  }
};
export const fitLayers = (map, layers, maxZoom, callback, padding) => {
  const extent = createEmpty();
  for (let i = 0; i < layers.length; i++) {
    extend(extent, layers[i].getSource().getExtent());
  }
  fitExtent(map, extent, maxZoom, callback, padding);
};
export const fitFeatures = (map, features, maxZoom, callback, padding) => {
  const extent = createEmpty();
  for (let i = 0; i < features.length; i++) {
    extend(extent, features[i].getGeometry().getExtent());
  }
  fitExtent(map, extent, maxZoom, callback, padding);
};
export const fitFeature = (map, feature, maxZoom, callback, padding) => {
  if (feature) {
    fitExtent(
      map,
      feature.getGeometry().getExtent(),
      maxZoom,
      callback,
      padding
    );
  }
};

export default {
  fitExtent,
  fitPos,
  fitLayer,
  fitFeatures,
  fitFeature,
  fitLayers,
};
