<template>
  <view class="imgaes">
    <view
      class="imgaes-warp"
      :style="{
        padding: $u.addUnit(imgsData.paddingLR, 'rpx'),
      }"
      @click="$u.navTo(imgsData.url)">
      <image
        class="image"
        :src="imgsData.src"
        :style="{ height: !imgsData.height ? '100%' : imgsData.height + 'rpx' }"
        :mode="imgMode"></image>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    datas: {
      type: [Object, null],
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    imgMode() {
      return !this.imgsData?.height ? 'widthFix' : 'scaleToFill';
    },
    platform() {
      let platform = 'h5';
      // #ifdef APP-PLUS
      platform = 'app';
      // #endif

      // #ifdef MP-WEIXIN
      platform = 'wxma';
      // #endif

      // #ifdef MP-ALIPAY
      platform = 'alima';
      // #endif

      return platform;
    },
    imgsData() {
      const { platformOptions } = this.datas;
      const data = platformOptions.find((item) => item.value === this.platform).imgs;
      return (data.src ? data : platformOptions[0].imgs) || {};
    },
  },
};
</script>

<style lang="scss" scoped>
.imgaes {
  width: 100%;
  height: 100%;
}
.imgaes-warp {
  width: 100vw;
  height: auto;
  box-sizing: border-box;
  .image {
    width: 100%;
    height: 100%;
    display: flex;
  }
}
</style>
