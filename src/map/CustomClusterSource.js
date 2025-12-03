import { Cluster } from 'ol/source'
import { getUid } from 'ol/util';
import { createEmpty, buffer } from 'ol/extent';
import Feature from 'ol/Feature';

function createOrUpdate(minX, minY, maxX, maxY, dest) {
    if (dest) {
        dest[0] = minX;
        dest[1] = minY;
        dest[2] = maxX;
        dest[3] = maxY;
        return dest;
    }
    return [minX, minY, maxX, maxY];
}
function createOrUpdateFromCoordinate(coordinate, dest) {
    const x = coordinate[0];
    const y = coordinate[1];
    return createOrUpdate(x, y, x, y, dest);
}



class CustomClusterSource extends Cluster {
    constructor(options) {
        super(options);
        this.lastResolution = 0
        this.lastFeatures = []
    }

    /**
     * @protected
     */
    cluster() {
        if (this.resolution === undefined || !this.source) {
            return;
        }
        //所有要素集合
        const features = this.source.getFeatures();

        if (features.length === 0) return

        const extent = createEmpty();
        const mapDistance = this.distance * this.resolution;


        //判断是否是缩放
        const isUp = this.resolution > this.lastResolution;

        const clustered = {};

        //放大时，存放上次显示的要素，确保上次显示要素会绘制在地图上
        //缩小时，重新聚合，不用考虑上次显示的点是否会显示在地图上
        if (!isUp) {
            //计算聚合
            //为了确保，上次显示的要素会显示在地图上，可以先对 this.lastFeatures 中的进行聚合，然后对整体的进行聚合
            for (let i = 0, ii = this.lastFeatures.length; i < ii; i++) {
                const uid = this.lastFeatures[i]
                const feature = features.find(v => getUid(v) === uid);
                if (!feature) continue
                if (!(uid in clustered)) {
                    const geometry = this.geometryFunction(feature);
                    if (geometry) {
                        const coordinates = geometry.getCoordinates();
                        createOrUpdateFromCoordinate(coordinates, extent);
                        buffer(extent, mapDistance, extent);

                        const neighbors = this.source
                            .getFeaturesInExtent(extent)
                            .filter(function (neighbor) {
                                const uid = getUid(neighbor);
                                if (uid in clustered) {
                                    return false;
                                }
                                clustered[uid] = true;
                                return true;
                            });
                        const newFeature = new Feature({
                            geometry: geometry.clone(),
                            features: neighbors,
                        })
                        newFeature._skyway_cluster_id = uid
                        this.features.push(newFeature);
                    }
                }
            }
        } else {
            this.lastFeatures = []
            this.lastResolution = 0
        }
        for (let i = 0, ii = features.length; i < ii; i++) {
            const feature = features[i];
            const currentUid = getUid(feature);
            if (!(currentUid in clustered)) {
                const geometry = this.geometryFunction(feature);
                if (geometry) {
                    const coordinates = geometry.getCoordinates();
                    createOrUpdateFromCoordinate(coordinates, extent);
                    buffer(extent, mapDistance, extent);

                    const neighbors = this.source
                        .getFeaturesInExtent(extent)
                        .filter(function (neighbor) {
                            const uid = getUid(neighbor);
                            if (uid in clustered) {
                                return false;
                            }
                            clustered[uid] = true;
                            return true;
                        });
                    const newFeature = new Feature({
                        geometry: geometry.clone(),
                        features: neighbors,
                    })
                    newFeature._skyway_cluster_id = currentUid
                    this.features.push(newFeature);
                    this.lastFeatures.push(currentUid)
                }
            }
        }
        this.lastResolution = this.resolution;

    }

}

export default CustomClusterSource;
