import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source'
import defaultValue from './defaultValue';

class BaseVectorLayer extends VectorLayer {
    constructor(params) {
        params = defaultValue(params, {})
        params = Object.assign({
            zIndex: 100003
        }, params)
        params.source = defaultValue(params.source, new VectorSource({ projection: 'EPSG:4326' }))
        super(params)
        this.featureId = defaultValue(params.featureId, 'uuid')
        this.source = this.getSource();
    }

    getFeatures() {
        return this.source.getFeatures() || [];
    }
    getFeatureById(id) {
        if (!id) {
            return null;
        }
        return this.getFeatures().find(feature => feature.get('props')[this.featureId] == id)
    }

    clear() {
        this.source.clear()
    }
    addFeatures(features, needClear = false) {
        if (needClear) {
            this.clear()
        }
        this.source.addFeatures(features)
    }

    addFeature(feature) {
        if (!feature) {
            return
        }
        this.source.addFeature(feature)
    }
    removeFeature(feature) {
        if (this.source.hasFeature(feature)) {
            this.source.removeFeature(feature)
            return true
        }
        return false
    }

    destroy() {
        this.clear()
    }
}

export default BaseVectorLayer