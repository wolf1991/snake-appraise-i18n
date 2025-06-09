<template>
  <view class="page-popup">
    <u-popup :show="show" :mode="datas.popupMode" :bg-color="datas.popupMode === 'bottom' ? '#fff' : 'transparent'">
      <view class="popup-container">
        <view :class="[`page-popup-popup page-popup-popup--${datas.popupMode}`]">
          <view :class="[`close close--${datas.popupMode}`]" @click.stop="show = false" v-if="datas.popupMode === 'bottom'">
            <u-icon name="close2" color="#26273A" size="18"></u-icon>
          </view>
          <image class="page-popup-img" mode="aspectFill" :src="datas.image" @click.stop="handleToPage"></image>
        </view>
        <view :class="[`close close--${datas.popupMode}`]" @click.stop="show = false" v-if="datas.popupMode === 'center'">
          <u-icon name="close2" color="#fff" size="28"></u-icon>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  name: 'pagePopup',
  props: { datas: Object },
  data() {
    return { show: true };
  },
  watch: {
    show(n) {
      if (!n && this.datas.popupMode === 'bottom') {
        uni.$u.sleep(300).then(() => {
          uni.showTabBar({ animation: true });
        });
      }
    },
  },
  mounted() {
    if (this.datas.popupMode === 'bottom') {
      uni.hideTabBar({ animation: true });
    }
  },
  methods: {
    handleToPage() {
      uni.$u.navTo(this.datas.url);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-popup {
  width: 100%;
  height: 100%;
}

.popup-container {
  width: 100%;
  height: 100%;

  .page-popup-popup {
    width: 100%;
    height: 572rpx;
    box-sizing: border-box;

    &--center {
      width: 540rpx;
      height: 740rpx;

      .page-popup-img {
        height: 740rpx !important;
      }
    }

    .page-popup-img {
      width: 100%;
      height: 524rpx;
      display: block;
    }
  }

  .close {
    display: flex;
    justify-content: flex-end;
    padding-top: 16rpx;
    padding-right: 16rpx;

    &--center {
      margin-top: 70rpx;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
