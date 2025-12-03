<template>
  <div ref="mapInstance" class="sky-way-map-target"></div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { defaults as defaultControls } from "ol/control";
import { defaults as defaultInteractions } from "ol/interaction";
import { Tile as TileLayer } from "ol/layer";
import { get } from "ol/proj";
import { XYZ } from "ol/source";
import { Icon, Style } from "ol/style";
import Feature from "ol/Feature.js";
import { Point } from "ol/geom";

import defined from "@/map/defined";
import icon_gps_sensor from "@/assets/icon/icon_map_location_direction.png";
import icon_gps_no_sensor from "@/assets/icon/icon_gps_no_sensor.png";

import { useLocationing, useCurrentLocation } from "@/map/useLocation";

import BaseVectorLayer from "@/map/BaseVectorLayer.js";

const layerTypeMap = {
  vector: ["vec", "cva"], // [矢量底图, 矢量注记]
  image: ["img", "cia"], // [影像底图, 影像注记]
  terrain: ["ter", "cta"], // [地形晕渲, 地形注记]
};

export default {
  name: "sample-map",
  data() {
    return {};
  },
  created() {
    this.map = null;
    this.view = null;
  },
  mounted() {
    this.initMap();
    this.init();
  },
  methods: {
    initMap() {
      const projection = get("EPSG:4326");
      const matrixSet = "c";
      let options = {
        projection: projection,
        zoom: 5,
        maxZoom: 22,
        minZoom: 3,
        center: [106.33049, 24.81812],
      };
      this.view = new View(options);
      const key = "1e18a7c957367af54d9ae7644e71e2ac"; // process.env.VUE_APP_TDT_KEY;

      this.map = new Map({
        controls: defaultControls({
          attribution: false,
          zoom: false,
          rotate: false,
        }),
        interactions: defaultInteractions({
          mouseWheelZoom: true,
          pinchZoom: true,
          doubleClickZoom: true,
          shiftDragZoom: false,
          altShiftDragRotate: false,
          pinchRotate: false,
        }),
        target: this.$refs.mapInstance,
        view: this.view,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: `https://t{0-7}.tianditu.gov.cn/DataServer?T=${layerTypeMap.vector[0]}_${matrixSet}&tk=${key}&x={x}&y={y}&l={z}`,
              projection,
            }),
          }),
          // 注记
          new TileLayer({
            source: new XYZ({
              url: `https://t{0-7}.tianditu.gov.cn/DataServer?T=${layerTypeMap.vector[1]}_${matrixSet}&tk=${key}&x={x}&y={y}&l={z}`,
              projection,
            }),
          }),
        ],
      });
    },
    init() {
      this.layer = new BaseVectorLayer();
      this.map.addLayer(this.layer);
      useCurrentLocation().then(
        (result) => {
          this.handlePosition(result);
        },
        () => {
          console.log("定位失败");
        }
      );

      this.watchId = useLocationing(this.handlePosition);
      if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", this.handleOrientation);
      } else {
        // this.$toast("浏览器不支持设备方向事件");
      }
      this.initStyle();
    },
    handlePosition(result = {}) {
      this.layer.clear();
      const { longitude, latitude } = result;
      if (!longitude || !latitude) {
        return;
      }
      const feature = new Feature({
        geometry: new Point([longitude, latitude]),
      });
      this.layer.addFeature(feature);
    },
    initStyle() {
      const noSensorStyle = new Style({
        image: new Icon({
          src: icon_gps_no_sensor,
          anchor: [0.5, 0.5],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          crossOrigin: "anonymous",
        }),
      });
      const sensorStyle = new Style({
        image: new Icon({
          src: icon_gps_sensor,
          anchor: [0.5, 0.5],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          crossOrigin: "anonymous",
        }),
      });
      this.layer.setStyle(() => {
        const rotation = this.rotation;
        if (!defined(rotation)) {
          return noSensorStyle;
        }
        sensorStyle.getImage().setRotation(((360 - rotation) * Math.PI) / 180);
        return sensorStyle;
      });
    },
    handleOrientation(event) {
      const alpha = event.alpha;
      if (defined(alpha) && this.rotation !== alpha) {
        if (!this.rotation) {
          this.rotation = alpha;
          this.layer.changed();
          return;
        }
        if (Math.abs(this.rotation - alpha) > 10) {
          this.rotation = alpha;
          this.layer.changed();
          return;
        }
      }
    },
  },

  beforeDestroy() {
    if (this.map) {
      this.map.setTarget(null);
    }
    this.iconName = null;
    this.rotation = null;
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    window.removeEventListener("deviceorientation", this.handleOrientation);
    if (this.map) {
      this.map.removeLayer(this.layer);
    }
    this._locationDebounce = null;
    this.layer.destroy();
    this.layer = null;
  },
};
</script>
