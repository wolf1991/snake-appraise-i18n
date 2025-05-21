<template>
  <view class="coupon">
    <!-- 页面显示 -->
    <view @click="handleReceiveCoupon" v-if="datas.modeType === 'page'">
      <view v-show="isCouponCheck">
        <image :src="datas.beforeImage" mode="widthFix" style="width: 100%; display: block" />
      </view>
      <view v-show="!isCouponCheck">
        <image :src="datas.afterImage" mode="widthFix" style="width: 100%; display: block" />
      </view>
    </view>
    <!-- 弹窗显示 -->
    <template v-if="datas.modeType === 'popup'">
      <u-popup :show="show" :mode="datas.popupMode" :bg-color="datas.popupMode === 'bottom' ? '#fff' : 'transparent'">
        <view class="popup-container">
          <view :class="[`coupon-popup coupon-popup--${datas.popupMode}`]">
            <view
              :class="[`close close--${datas.popupMode}`]"
              @click.stop="show = false"
              v-if="!datas.popupMode || datas.popupMode === 'bottom'">
              <u-icon name="close2" color="#26273A" size="18"></u-icon>
            </view>
            <image class="coupon-img" mode="aspectFill" :src="datas.beforeImage" @click.stop="handleReceiveCoupon"></image>
          </view>
          <view :class="[`close close--${datas.popupMode}`]" @click.stop="show = false" v-if="datas.popupMode === 'center'">
            <u-icon name="close2" color="#fff" size="28"></u-icon>
          </view>
        </view>
      </u-popup>
    </template>
  </view>
</template>

<script>
import config from '@/config/config';
export default {
  name: 'coupon',
  props: { datas: Object },
  data() {
    return {
      isCouponCheck: true,
      tipMessage: '',
      show: false,
    };
  },
  watch: {
    show(n) {
      if (!n && this.datas.modeType === 'popup' && this.datas.popupMode === 'bottom') {
        uni.$u.sleep(300).then(() => {
          uni.showTabBar({ animation: true });
        });
      }
    },
  },
  mounted() {
    this.getCouponCheck();
    if (this.datas.modeType === 'popup' && this.datas.popupMode === 'bottom') {
      // uni.hideTabBar({ animation: true });
    }
  },
  methods: {
    async getCouponCheck() {
      const response = await uni.$u.http.get('/v3/user/coupon/check', { activityId: this.datas.couponId });
      this.isCouponCheck = response?.data?.result || false;
      this.tipMessage = response.msg;
      if (this.datas.modeType === 'popup' && this.isCouponCheck) {
        await this.$u.sleep(30);
        this.show = true;
      }
    },
    async handleReceiveCoupon() {
      if (!this.isCouponCheck) {
        this.$u.toast(this.tipMessage || '您已经领取过啦');
        this.report();
        return;
      }
      const response = await uni.$u.http.post('/v3/user/coupon/add', { activityId: this.datas.couponId });
      if (response.success) {
        this.isCouponCheck = false;
        this.show = false;
        this.$u.toast(response.data.msg);
        setTimeout(() => {
          this.report();
        }, 1000);
      } else {
        this.show = false;
        this.getCouponCheck();
        this.$u.toast(response.msg);
      }
    },
    // 上报巨量
    report() {
      console.log(this.datas, this.datas.type !== '12');
      // type 10 内部跳转 type 12 外部跳转
      if (this.datas.type !== '12') {
        this.navTo(this.datas.afterUrl);
        return;
      }
      if (!this.datas.afterUrl) {
        uni.$u.toast('缺少跳转页面路径');
        return;
      }
      try {
        uni.showLoading({ title: '跳转中...' });
        const query = uni.$u.getQueryParams(window.location.href);
        // 上报巨量 且跳转到微信-添加企业微信
        uni.request({
          url: `${config.baseUrl}/juliang`,
          method: 'post',
          header: { 'Content-Type': 'application/json' },
          data: {
            event_type: 'work_wechat_added',
            context: {
              ad: {
                callback: query.clickid, // callback 这里需要填写的就是从启动参数里获取的 clickid
              },
            },
            timestamp: Date.now(),
          },
          success: (res) => {
            uni.navigateTo({ url: `/pages/common/webview?url=${this.datas.afterUrl}&back=true` });
            uni.hideLoading();
          },
          fail(res) {
            console.log(res);
            uni.hideLoading();
          },
        });
      } catch (e) {
        // TODO handle the exception
        uni.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.coupon {
  width: 100%;
  height: 100%;
}

.popup-container {
  width: 100%;
  height: 100%;

  .coupon-popup {
    width: 100%;
    height: 572rpx;
    background-color: #fff;
    box-sizing: border-box;

    &--center {
      width: 540rpx;
      height: 740rpx;
      background: #ffffff;

      .coupon-img {
        height: 740rpx !important;
      }
    }

    .coupon-img {
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
