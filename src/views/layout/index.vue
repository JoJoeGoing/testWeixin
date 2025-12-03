<template>
  <div class="tourisepopup">
    <div class="touriheader padding-1">
      <div class="flex-1 text-no-wrap text-align-left">清凉峰</div>
      <van-icon name="cross" />
    </div>
    <div class="touribody padding-1">
      <div class="flex-1">
        <van-image
          height="15vh"
          fit="contain"
          src="https://img01.yzcdn.cn/vant/cat.jpeg"
        />
      </div>
      <div class="flex-1 touriBttns">
        <div class="tbtns sc">
          <img src="@/assets/icon/audio.png" class="scico" />
          <div>讲解</div>
        </div>
        <div class="tbtns sc">
          <img src="@/assets/icon/camera.png" class="scico" />
          <div>VR全景</div>
        </div>
        <div class="tbtns fail">
          <img src="@/assets/icon/daohang.png" class="scico" />
          <div>导航到这里</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "base-layout",
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
