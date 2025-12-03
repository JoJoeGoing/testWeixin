<template>
  <div class="tourisepopup">
    <div class="touriheader padding-1">
      <div class="flex-1 text-no-wrap text-align-left">{{ info.name }}</div>
      <van-icon name="cross" />
    </div>
    <div class="touribody padding-1">
      <div class="flex-1">
        <van-image
          v-if="images.length > 0"
          height="15vh"
          fit="contain"
          :src="images[0]"
          @click="previewImage"
        >
          <template v-slot:error>加载失败</template>
        </van-image>
      </div>
      <div class="flex-1 touriBttns">
        <div class="tbtns" @click="showDetail">
          <img src="@/assets/icon/audio.png" class="scico" />
          <div>讲解</div>
        </div>
        <div class="tbtns" @click="showVr">
          <img src="@/assets/icon/camera.png" class="scico" />
          <div>VR全景</div>
        </div>
        <div class="tbtns" @click="goWhere">
          <img src="@/assets/icon/daohang.png" class="scico" />
          <div>导航到这里</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import { useCurrentLocation } from "@/map/useLocation";

export default {
  name: "touriseDetail",
  data() {
    return {
      info: {},
      images: [],
    };
  },

  methods: {
    init(info) {
      this.info = info;
      if (info.image) {
        this.images = JSON.parse(info.image).map((v) => {
          return process.env.VUE_APP_FILE_PATH + v.url;
        });
      } else {
        this.images = [];
      }
    },
    clear() {
      this.info = {};
      this.images = [];
    },
    previewImage() {
      ImagePreview(this.images);
    },
    showDetail() {
      window.parent.postMessage(
        { type: "showDetail", data: JSON.stringify(this.info) },
        "*"
      );
    },
    showVr() {},
    goWhere() {
      location.href = `https://uri.amap.com/navigation?to=${this.info.longitude},${this.info.latitude},${this.info.name}&callnative=1`;
    },
  },
};
</script>

<style lang="scss" scoped>
.tourisepopup {
  width: 332px;
  height: 223px;
  background-image: url("~@/assets/icon/popup.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  color: #fff;
  .touriheader {
    height: 20%;
    display: flex;
    font-size: 20px;
    justify-content: space-between;
    color: black;
  }
  .touribody {
    height: calc(80% - 20px);
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    .touriBttns {
      display: flex;
      width: 100%;
      gap: 10px;
      flex-direction: column;
      color: black;
      .tbtns {
        height: 30%;
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #f8f8f8;
        border: 1px solid #5ab159;
        border-radius: 10px;
        gap: 10px;
        cursor: pointer;
        padding-left: 10px;
        font-size: 14px;
        .scico {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style>
