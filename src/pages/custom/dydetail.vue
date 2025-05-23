<template>
  <view class="dydetail_img">
    <view class="flex justify-center">
      <image class="w-342rpx h-304rpx mt-27rpx" src="https://cdn.puresnake.com/xy-web/dydetail_top.png" mode="widthFix"></image>
    </view>
    <view class="dydetail_position flex-center flex-col">
      <view class="text-32rpx fw-bold snake-font-medium" v-if="appraiseDetail.appraiseCodeName">
        {{ appraiseDetail.appraiseCodeName }}
      </view>
      <view class="flex-center">
        <view class="text-48rpx text-#06d290 decoration-underline snake-font-din-Bold">
          {{ appraiseDetail.appraiseCode || '未找到鉴别信息' }}
        </view>
        <text
          class="next-icons icon-copy text-40rpx ml-8rpx"
          v-if="appraiseDetail.appraiseCode"
          @click="$util.copyToClipboard(appraiseDetail.appraiseCode)"></text>
      </view>
    </view>
    <view class="snake-fixed-bottom">
      <view
        class="w-702rpx h-94rpx line-height-94rpx mx-auto text-center bg-#26273a rounded-2rpx fw-bold text-36rpx snake-font-semibold"
        @click="goIdentify">
        去鉴别
      </view>
    </view>
    <snake-login-popup :show="logInShow" @close="logInShow = false" @refresh="typeRefresh"></snake-login-popup>
  </view>
</template>

<script>
import { getAppraiseDyOrderDetailApi } from '@/api/appraise';
import { getCmsInfo } from '@/api/cms';
import { isProd } from '@/utils/request/util';
export default {
  data() {
    return {
      logInShow: false,
      code: '',
      appraiseDetail: {},
      pageInfo: {},
      pageComponents: [],
    };
  },
  onLoad(options) {
    let q = options?.q || '';
    // #ifdef MP-ALIPAY
    q = my.getLaunchOptionsSync().query.qrCode;
    // #endif
    // 扫普通二维码进入参数 {"q":"https%253A%252F%252Fxy.puresnake.com%252Fs%253Fp%253D60201715","scancode_time":"1603866721"}
    q = uni.$u.getQueryParams(decodeURIComponent(q));
    options = { ...options, ...q };
    this.code = options.id;
  },
  async onShow() {
    if (this.code) {
      await this.getDetail();
    }
    // #ifdef MP-WEIXIN
    if (!this.appraiseDetail.status) {
      uni.hideHomeButton();
    }
    // #endif
  },
  onPullDownRefresh() {
    this.getDetail().then(() => {
      uni.stopPullDownRefresh();
    });
  },
  methods: {
    goIdentify() {
      const token = uni.getStorageSync('token');
      console.log(token);
      if (!token) {
        // #ifdef H5
        uni.navigateTo({
          url: '/pages/login/login',
        });
        // #endif

        // #ifndef H5
        this.logInShow = true;
        // #endif
      } else {
        this.clickPage();
      }
    },
    typeRefresh() {
      this.clickPage();
    },
    async clickPage() {
      if (!this.appraiseDetail.appraiseCode) {
        return uni.$u.toast('鉴别扣码不存在');
      }
      uni.setStorageSync('appraiseCode', this.appraiseDetail.appraiseCode);
      uni.$u.navTo(`/pages/custom/cms?pageId=${isProd ? 981 : 838}`);
    },
    async getDetail() {
      uni.showLoading({
        title: '加载中',
        mask: true,
      });
      const response = await getAppraiseDyOrderDetailApi({
        code: this.code,
      });
      uni.hideLoading();
      if (response.success) {
        this.appraiseDetail = response?.data || {};
        if (this.appraiseDetail.status) {
          uni.redirectTo({
            url: `/pages/appraise/appraiserDetail?orderId=${this.appraiseDetail.id}`,
          });
        }
      } else {
        uni.$u.toast(response.msg);
      }
    },
  },
};
</script>

<style lang="scss">
.dydetail_img {
  width: 100%;
  min-height: 100vh;
  background-image: url('https://cdn.puresnake.com/xy-web/dydetail.png');
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
}

.dydetail_position {
  width: 656rpx;
  position: absolute;
  top: 267rpx;
  left: 50%;
  transform: translateX(-50%);
}
</style>
