<template>
  <view class="snake-w-700 snake-px-24">
    <form @submit="formSubmit" class="snake-form">
      <view class="snake-form-item snake-border-b">
        <text class="snake-form-label">支付宝账号</text>
        <view class="snake-form-body">
          <input
            type="text"
            class="snake-form-input"
            name="cardNo"
            v-model="inputCardNo"
            placeholder="请输入支付宝账号"
            placeholder-style="color: #B1B2C1;font-size:28rpx;" />
        </view>
      </view>
      <view class="snake-form-item snake-border-b">
        <text class="snake-form-label">真实姓名</text>
        <view class="snake-form-body">
          <input
            type="text"
            class="snake-form-input"
            name="name"
            v-model="inputName"
            placeholder="请输入真实姓名"
            placeholder-style="color:#B1B2C1;font-size:28rpx;" />
        </view>
      </view>
      <view class="snake-form-item snake-border-b">
        <text class="snake-form-label">验证码</text>
        <view class="snake-flex-vcenter">
          <view class="snake-form-body">
            <input
              type="number"
              class="snake-form-input"
              name="code"
              v-model="inputCode"
              placeholder="请输入验证码"
              placeholder-style="color: #B1B2C1;;font-size:28rpx;" />
          </view>
          <view class="sendvcode-btn snake-green" @tap="getVCode">{{ vcodeBtnName }}</view>
        </view>
      </view>
      <view style="margin-top: 63rpx">
        <button
          type="primary"
          class="snake-border-radius snake-bg-green"
          style="height: 90rpx; line-height: 90rpx; background-color: #06d290"
          formType="submit">
          确定绑定
        </button>
      </view>

      <view class="snake-red snake-fs-26 snake-mt-36 snake-flex-center">温馨提示：目前仅支持，手机号绑定</view>
    </form>
  </view>
</template>
<script>
import { bindPayAccounte } from '@/api/recycle';
import { getCaptchCode } from '@/api/user';
import graceChecker from '@/utils/graceChecker';
import { useUserStore } from '@/stores/modules/user';
const userStore = useUserStore();
export default {
  data() {
    return {
      inputCardNo: '',
      inputName: '',
      inputCode: '',
      binding: false,
      vcodeBtnName: '获取验证码',
      countNum: 60,
      countDownTimer: null,
      userInfo: userStore.userInfo || {},
    };
  },
  onLoad(options) {},
  methods: {
    async formSubmit(e) {
      // 定义表单规则
      const rule = [
        {
          name: 'cardNo',
          checkType: 'notnull',
          errorMsg: '支付宝账户不能为空',
        },
        {
          name: 'name',
          checkType: 'notnull',
          errorMsg: '姓名不能为空',
        },
        {
          name: 'code',
          checkType: 'notnull',
          errorMsg: '验证码不为空',
        },
      ];
      // 进行表单检查
      const formData = {
        ...e.detail.value,
        type: 'alipay',
      };
      const checkRes = graceChecker.check(formData, rule);
      if (!checkRes) {
        return this.$u.toast(graceChecker.error);
      }
      const result = await bindPayAccounte(formData);
      if (result.success) {
        setTimeout(() => {
          uni.navigateBack();
        }, 500);
      } else {
        this.$u.toast(result.msg);
        this.binding = false;
      }
    },
    async getVCode() {
      const myreg = /^[1][0-9]{10}$/;
      if (!myreg.test(this.userInfo.mobile)) {
        this.$u.toast('您的手机号异常');
        return false;
      }
      // 手机号码为 :  this.phoneNumber
      // vcodeBtnName 可以阻止按钮被多次点击 多次发送 return 会终止函数继续运行
      if (this.vcodeBtnName !== '获取验证码' && this.vcodeBtnName !== '重新发送') {
        return;
      }
      this.vcodeBtnName = '发送中...';
      const response = await getCaptchCode({ phone: this.userInfo.mobile });
      if (response.success) {
        this.$u.toast('短信已发送，请注意查收');
        // 倒计时
        this.countNum = 60;
        this.countDownTimer = setInterval(() => {
          this.countDown();
        }, 1000);
      } else {
        this.vcodeBtnName = '获取验证码';
        this.$u.toast(response.msg);
      }
    },
    countDown() {
      if (this.countNum < 1) {
        clearInterval(this.countDownTimer);
        this.vcodeBtnName = '重新发送';
        return;
      }
      this.countNum--;
      this.vcodeBtnName = `${this.countNum}秒重发`;
    },
  },
};
</script>
<style>
page {
  background-color: #fff;
}
</style>
<style>
.snake-form {
  padding: 0 28rpx;
}

.snake-form-item {
  display: flex;
  align-items: center;
  width: 100;
  height: 100rpx;
}

.snake-form-label {
  min-width: calc(140rpx + 32rpx);
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 28rpx;
}
.snake-form-body {
  flex: 1;
}

.snake-form-body .snake-form-input {
  font-size: 28rpx;
}

.sendvcode-btn {
  width: 200rpx;
  text-align: center;
  font-size: 28rpx;
}
</style>
