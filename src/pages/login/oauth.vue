<template>
  <view class="flex-center flex-col">
    <u-navbar fixed placeholder :title="title" bgColor="transparent" autoBack></u-navbar>
    <view class="mt-141rpx flex-center flex-col">
      <image class="w-180rpx h180rpx mb-32rpx" src="@/static/logo.png"></image>
      <text class="text-42rpx font-600" style="letter-spacing: 2rpx">欢迎登录</text>
    </view>
    <!-- #ifdef MP -->
    <view class="mt-268rpx"></view>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <view class="mt-80rpx"></view>
    <!-- #endif -->

    <view class="snake-w-full snake-px-44 snake-box-sizing">
      <!-- #ifdef H5 -->
      <u-input
        type="number"
        v-model="phoneNumber"
        maxlength="11"
        border="bottom"
        placeholder="请输入手机号"
        placeholder-style="color: #8E8E93;font-size:14px;" />

      <u-input
        type="number"
        v-model="code"
        maxlength="6"
        border="bottom"
        placeholder="请输入验证码"
        placeholder-style="color: #8E8E93;;font-size:14px;">
        <template v-slot:suffix>
          <up-code :seconds="seconds" ref="uCodeRef" @change="codeChange"></up-code>

          <text class="text-28rpx" @tap="getCode">{{ codeText }}</text>
        </template>
      </u-input>

      <u-button
        type="primary"
        :throttleTime="500"
        customStyle="height: 96rpx; font-size: 32rpx; font-weight: bold; margin-top: 40rpx"
        @click="doLogin">
        登录
      </u-button>

      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN -->
      <u-button
        v-if="isAgreement"
        type="primary"
        open-type="getPhoneNumber"
        :throttleTime="500"
        customStyle="height: 96rpx; font-size: 32rpx; font-weight: bold"
        @getphonenumber="phonenumberHandle">
        手机号快捷登录
      </u-button>
      <u-button
        v-else
        type="primary"
        :throttleTime="500"
        customStyle="height: 96rpx; font-size: 32rpx; font-weight: bold"
        @click="phonenumberHandle">
        手机号快捷登录
      </u-button>
      <!-- #endif -->
      <!-- #ifdef MP-ALIPAY -->
      <button
        type="primary"
        open-type="getAuthorize"
        @getAuthorize="phonenumberHandle"
        scope="phoneNumber"
        style="background-color: #06d290; border-color: #06d290; height: 96rpx; font-size: 32rpx; font-weight: bold">
        手机号快捷登录
      </button>
      <!-- #endif -->
    </view>
    <view
      class="snake-flex-allcenter snake-wrap snake-gray snake-mt-40 snake-fs-20 snake-mx-40"
      @click.stop="isAgreement = !isAgreement">
      <radio :checked="isAgreement" color="#000" style="transform: scale(0.7)" @click.stop="isAgreement = !isAgreement" />
      <text>我已阅读，理解并接受以下规定</text>
      <text class="snake-primary" @click.stop="navTo('/pages/common/cms?pageId=974')">《用户协议》</text>
      <text class="snake-primary" @click.stop="navTo('/pages/common/cms?pageId=975')">《隐私协议》</text>
    </view>
  </view>
</template>

<script>
import config from '@/config/config';
import { postLogin, getCaptchCode, postPushBind } from '@/api/user';
import { useUserStore } from '@/stores/modules/user';
import graceChecker from '@/utils/js/graceChecker';

const userStore = useUserStore();
export default {
  data() {
    return {
      // #ifndef MP-ALIPAY
      title: '登录',
      // #endif
      // #ifdef MP-ALIPAY
      // eslint-disable-next-line no-dupe-keys, vue/no-dupe-keys
      title: '',
      // #endif
      isAgreement: false,

      phoneNumber: '',
      code: '',
      seconds: 60,
      codeText: '',
    };
  },
  methods: {
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
    // 手机登录
    async doLogin() {
      console.log('doLogin', this.isAgreement);
      if (!this.isAgreement) {
        uni.$u.toast('同意协议后继续登录操作');
        return;
      }
      // 定义表单规则
      const rule = [
        { name: 'phone', checkType: 'phoneno', errorMsg: '填写正确的手机号' },
        {
          name: 'code',
          checkType: 'notnull',
          errorMsg: '验证码不为空',
        },
      ];
      // 进行表单检查
      const formData = {
        phone: this.phoneNumber,
        code: this.code,
      };

      const checkRes = graceChecker.check(formData, rule);
      if (checkRes) {
        this.loginWithAuthCode(formData);
      } else {
        this.logining = false;
        uni.$u.toast(graceChecker.error);
      }
    },
    // 手机号一键登录
    async phonenumberHandle(e) {
      if (!this.isAgreement) {
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
          uni.$u.toast('登录成功');
          userStore.setUserInfo({
            ...response.data,
            token: response.token,
          });
          uni.hideLoading();

          // #ifdef APP
          this.pushBind();
          // #endif

          await uni.$u.sleep(1000);
          uni.navigateBack();
        } else {
          uni.hideLoading();
          uni.$u.toast(response.msg);
        }
      } catch (error) {
        uni.hideLoading();
      }
    },
    async getCode() {
      if (!/^1[0-9]{10,10}$/.test(this.phoneNumber)) {
        uni.$u.toast('请填写正确手机号码');
        return false;
      }
      if (this.$refs.uCodeRef.canGetCode) {
        // 模拟向后端请求验证码
        uni.showLoading({
          title: '正在获取验证码',
        });
        const response = await getCaptchCode({
          phone: this.phoneNumber,
        });
        if (response.success) {
          uni.hideLoading();
          if (response.data.includes('测试验证码')) {
            this.code = response.data.split('：')[1];
          }
          // 这里此提示会被start()方法中的提示覆盖
          uni.$u.toast('验证码已发送');
          // 通知验证码组件内部开始倒计时
          this.$refs.uCodeRef.start();
        } else {
          uni.hideLoading();
          uni.$u.toast(response.msg);
        }
      } else {
        uni.$u.toast('倒计时结束后再发送');
      }
    },
    codeChange(text) {
      this.codeText = text;
    },
    pushBind() {
      if (!userStore.userInfo.uid) {
        return;
      }
      const deviceInfo = uni.getDeviceInfo();
      const appBaseInfo = uni.getAppBaseInfo();

      // 获取客户端唯一的推送标识
      uni.getPushClientId({
        success: async (res) => {
          const response = await postPushBind({
            appid: appBaseInfo.appId,
            deviceId: deviceInfo.deviceId,
            deviceType: deviceInfo.deviceBrand,
            userId: userStore.userInfo.uid,
            pushId: res.cid,
          });
        },
        fail(err) {
          console.log(err);
        },
      });
    },
  },
};
</script>

<style>
page {
  background-image: url('https://s.qiuxietang.com/2nd-recycle/images/login-bg.png');
  background-size: cover;
}
</style>

<style lang="scss" scoped>
::v-deep .u-input {
  height: 60rpx;
  padding: 8px 9px !important;
}
</style>
