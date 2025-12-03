<template>
  <div style="width: 100%; height: 100%">
    <sampleMapVue ref="mapInstance" class="base-map-container"></sampleMapVue>
    <touriseDetailVue ref="popInstance"></touriseDetailVue>
  </div>
</template>

<script>
import sampleMapVue from "@/components/sampleMap.vue";
import touriseDetailVue from "@/components/touriseDetail.vue";
import { getTouriseList } from "@/api/index.js";
import Overlay from "ol/Overlay";
import { unByKey } from "ol/Observable";
import BaseVectorLayer from "@/map/BaseVectorLayer.js";
import { fitLayer } from "@/map/previewMap";
import { createPointFeatures } from "@/map/createPointFeatures";
import { createTextStyle, createIconStyle } from "@/map/style.js";
import touristIcon from "@/assets/icon/tourist1.png";
import { Style } from 'ol/style';

export default {
  name: "base-map",
  components: {
    sampleMapVue,
    touriseDetailVue,
  },
  data() {
    return {};
  },
  mounted() {
    const iconStyle = createIconStyle(touristIcon);
    this.layer = new BaseVectorLayer();
    this.layer.setStyle((feature) => {
      const props = feature.get("props");
      const name = props.name;

      const textStyle = createTextStyle(name, {
        offsetY: 10,
        fill: "#000",

      });
      return new Style({
        image:iconStyle,
        text:textStyle
      })  
      ;
    });
    
    this.map = this.$refs.mapInstance.map;
    this.overlay = this.createOverlay("popInstance");
    this.map.addOverlay(this.overlay);
    this.map.addLayer(this.layer);
    this.loadData();
    this.bindPick();
  },
  methods: {
    loadData() {
      getTouriseList().then((res) => {
        const response = res.data;
        if (response.code != 200) return;
        const data = response.rows;
        const features = createPointFeatures(data);
        this.layer.addFeatures(features);
        fitLayer(this.map, this.layer, 16, undefined, [50, 50, 50, 50]);
      });
    },
    createOverlay(ref) {
      const overlay = new Overlay({
        element: this.$refs[ref].$el,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
        stopEvent: true,
        positioning: "bottom-center",
      });
      overlay.setPosition(undefined);
      return overlay;
    },
    pickFeature(feature) {
      this.overlay.setPosition(undefined);
      if (!feature) {
        this.$refs.popInstance.clear();
        return;
      }
      this.map.getView().animate({
        center: feature.getGeometry().getCoordinates(),
      });
      this.$refs.popInstance.init(feature.get("props"));
      this.$nextTick(() => {
        const coordinate = feature.getGeometry().getCoordinates();
        this.overlay.setPosition(coordinate);
      });
    },
    bindPick() {
      this.pickPositionKey = this.map.on("click", (e) => {
        const feature = this.map.forEachFeatureAtPixel(e.pixel, (feature) => {
          return feature;
        }, {
          layerFilter: (layer) => {
            return layer === this.layer;
          }
        }
        );
        this.pickFeature(feature);
      });
    },
  },
  beforeDestroy() {
    if (this.pickPositionKey) {
      unByKey(this.pickPositionKey);
    }
    this.pickPositionKey = null;
  },
};
</script>

<style lang="scss"></style>
