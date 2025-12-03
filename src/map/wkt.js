import { WKT as FormatWKT } from 'ol/format';
import Feature from 'ol/Feature.js';

const wktFormat = new FormatWKT();

/**
* 将wkt转为geometry
* @param {*} wkt
* @returns
*/
export const getGeometryFromWKT = wkt => {
    try {
        return wktFormat.readGeometry(wkt);
    } catch (error) {
        return undefined;
    }
};

/**
 * 将geometry转为wkt
 * @param {*} geometry
 * @returns
 */
export const getWKTFromGeometry = geometry => {
    try {
        return wktFormat.writeGeometry(geometry);
    } catch (error) {
        return undefined;
    }
};

/**
 * 将wkt 转换为图层feature
 * @param {*} wkt
 * @returns
 */
export const createWktFeature = wkt => {
    if (!wkt) return null;
    const geometry = getGeometryFromWKT(wkt);
    if (!geometry) {
        return null;
    }
    const feature = new Feature({
        geometry: geometry,
    });
    return feature;
};