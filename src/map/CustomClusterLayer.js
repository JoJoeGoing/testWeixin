import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source'
import Cluster from './CustomClusterSource'

const defined = (target) => {
    return target !== undefined && target !== null
}
const defaultValue = (target, value) => {
    return defined(target) ? target : value
}
export default class CustomClusterLayer extends VectorLayer {
    constructor(params) {
        params = defaultValue(params, {})
        super({
            maxZoom: params.maxZoom,
            zIndex: params.zIndex || 100003,
        })

        this.featureId = defaultValue(params.featureId, 'uuid')
        this.currentSelectedFeature = undefined
        this.source = new VectorSource({ projection: 'EPSG:4326' })
        this.clusterSource = new Cluster({
            distance: params.distance || 100,
            source: this.source,
        })
        this.setSource(this.clusterSource)
    }
    getFeatures() {
        return this.source.getFeatures();
    }
    getFeatureById(id) {
        if (!id) {
            return null;
        }
        return this.getFeatures().filter(feature => feature.get('props')[this.featureId] === id)[0]
    }
    clear() {
        this.source.clear()
        this.clusterSource.clear()
    }
    addFeatures(features, needClear = false) {
        if (needClear) {
            this.clear()
        }
        this.source.addFeatures(features)
    }

    destroy() {
        this.clear()
    }
}