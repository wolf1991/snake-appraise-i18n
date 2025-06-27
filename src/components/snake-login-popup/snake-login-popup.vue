<template>
  <view @touchmove.stop.prevent="">
    <u-popup :round="8" :show="show" mode="bottom" @close="close" :z-index="99">
      <view class="px-48rpx">
        <view class="flex justify-center pt-60rpx">
          <image class="w-120rpx h-120rpx" :src="`https://cdn.puresnake.com/xy-web/appIcon.png`" mode="widthFix"></image>
        </view>
        <view class="text-32rpx text-#888891 pt-66rpx">申请获取以下权限</view>
        <view class="text-32rpx text-#000000 pt-20rpx">获得你的手机号码用于同步账户信息</view>
        <view class="text-28rpx text-#888891 pt-60rpx" @tap="checkAgree">
          <text v-if="agreeChecked" class="next-icons icon-selected text-#06d290 mr-10rpx text-26rpx"></text>
          <text v-else class="next-icons icon-notselected text-#888891 mr-10rpx text-26rpx"></text>
          我已阅读并同意
          <text
            class="text-#2ebd7c font-600 inline-block"
            @click.stop="$u.navTo('/pages/custom/cms?pageId=866')"
            hover-class="none">
            《用户协议》
          </text>
          &
          <text class="text-#2ebd7c font-600 inline-block" @click.stop="navTo('/pages/custom/cms?pageId=865')" hover-class="none">
            《隐私条款》
          </text>
        </view>
        <!-- #ifdef MP-WEIXIN || H5 -->
        <u-button
          v-if="agreeChecked"
          color="#06d290"
          custom-style="border-radius: 4rpx; height: 90rpx; margin-top: 70rpx"
          open-type="getPhoneNumber"
          @getphonenumber="phonenumberHandle">
          授权手机号快捷登录
        </u-button>
        <u-button
          color="#06d290"
          custom-style="border-radius: 4rpx; height: 90rpx; margin-top: 70rpx"
          @click="phonenumberHandle"
          v-else>
          授权手机号快捷登录
        </u-button>
        <!-- #endif -->

        <!-- #ifdef MP-ALIPAY -->
        <u-button
          custom-style="border-radius: 4rpx; height: 90rpx; margin-top: 70rpx"
          open-type="getPhoneNumber"
          @getphonenumber="phonenumberHandle">
          授权手机号快捷登录
        </u-button>
        <!-- #endif -->
        <u-button plain color="#06d290" custom-style="border-radius: 4rpx; height: 90rpx; margin: 20rpx 0" @click="close">
          取消登录
        </u-button>
      </view>
    </u-popup>
  </view>
</template>

<script>
import config from '@/config/config';
import { postLogin } from '@/api/user';
import { useUserStore } from '@/stores/modules/user';

const userStore = useUserStore();

export default {
  name: 'snake-login-popup',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      agreeChecked: false,
    };
  },
  methods: {
    checkAgree() {
      this.agreeChecked = !this.agreeChecked;
    },
    // 统一登录方法
    unifiedLogin(provider) {
      return new Promise((resolve, reject) => {
        uni.login({
          provider,
          success: (res) => {
            resolve(res);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
    // 获取服务供应商
    getProvider() {
      return new Promise((resolve, reject) => {
        uni.getProvider({
          service: 'oauth',
          success: (res) => {
            resolve(res.provider[0]);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
    // 手机号登录
    async phonenumberHandle(e) {
      if (!this.agreeChecked) {
        uni.$u.toast('同意协议后继续登录操作');
        return;
      }

      // #ifdef MP-WEIXIN
      // 授权失败，留在当前界面，等待用户再次交互
      if (!e.detail.errMsg.includes('ok')) {
        return;
      }
      // #endif

      try {
        // 获取服务供应商
        const provider = await this.getProvider();
        // 获取登录凭证
        const loginRes = await this.unifiedLogin(provider);

        // #ifdef MP-ALIPAY
        my.getPhoneNumber({
          success: (res) => {
            const data = JSON.parse(res.response);
            // 获取授权码成功，调用后端接口进行登录
            this.loginWithAuthCode({
              appId: config.appId,
              authCode: loginRes.code,
              encryptedData: data.response,
              iv: data.sign,
            });
          },
          fail: (err) => {
            console.error('getPhoneNumber_fail：', err);
          },
        });
        // #endif

        // #ifdef MP-WEIXIN
        // 获取授权码成功，调用后端接口进行登录
        this.loginWithAuthCode({
          appId: config.appId,
          authCode: loginRes.code,
          encryptedData: e.detail.code,
        });
        // #endif
      } catch (error) {
        // TODO handle the exception
        uni.$u.toast(error.errMsg);
      }
    },
    // 调用后端接口
    async loginWithAuthCode(params = {}) {
      uni.showLoading({
        title: '登录中...',
        mask: true,
      });

      try {
        const response = await postLogin(params);
        if (response.success) {
          this.closeOrRefresh();
          uni.$u.toast('登录成功');
          userStore.setUserInfo({
            ...response.data,
            token: response.token,
          });
          uni.hideLoading();
        } else {
          uni.hideLoading();
          uni.$u.toast(response.msg);
        }
      } catch (error) {
        this.closeOrRefresh();
        uni.hideLoading();
      }
    },
    close() {
      this.$emit('close');
    },
    closeOrRefresh() {
      this.$emit('close');
      this.$emit('refresh');
    },
  },
};
</script>

<style lang="scss" scoped></style>
