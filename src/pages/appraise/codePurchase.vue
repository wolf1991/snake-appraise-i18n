<template>
  <view class="my-20rpx mx-24rpx rounded-4rpx">
    <snake-address-board
      :addressData="addressData"
      @click="$u.navTo('/pages/user/address/address?source=1')"></snake-address-board>
  </view>

  <view class="bg-white rounded-4rpx mx-20rpx p-24rpx flex">
    <view class="flex-items-center">
      <image class="w-160rpx h-160rpx" :src="$u.thumbnailZip(curRange.image)" mode="widthFix" v-if="curRange.image"></image>
    </view>
    <view class="flex flex-col justify-between flex-1 ml-20rpx">
      <view>
        <view class="text-26rpx">{{ curRange.name }}</view>
        <view class="text-22rpx text-#aaaaaa mt-10rpx" style="font-family: DIN-Regular">x{{ amount }}{{ '组' }}</view>
      </view>
      <view class="flex justify-between">
        <view></view>
        <view class="text-28rpx snake-font-dinmedium">
          <text class="text-18rpx">￥</text>
          <text>{{ totalPrice }}</text>
        </view>
      </view>
    </view>
  </view>

  <view class="bg-white rounded-4rpx mt-20rpx mx-24rpx p-24rpx">
    <view class="flex justify-between">
      <view class="flex-items-center font-600">鞋扣</view>
      <u-number-box v-model="num" :min="0"></u-number-box>
    </view>
    <view class="flex justify-between mt-30rpx">
      <view class="flex-items-center font-600">其他扣(服/包/配饰等)</view>
      <view>{{ num === 0 ? 0 : amount - num }}组</view>
    </view>
  </view>
  <textarea
    class="w-697rpx h-134rpx mt-20rpx mx-24rpx bg-#F6F6F6 text-24rpx py-20rpx px-24rpx box-border"
    style="border: 1px solid #e8e8e8"
    placeholder="(必填)请注明需要多少组鞋扣或其他扣（服饰、配饰、包等）"
    placeholder-class="text-#b1b2c1 text-24rpx font-300 text-left"
    v-model="remark"></textarea>

  <view class="bg-white flex-items-center justify-between rounded-4rpx mt-20rpx mx-24rpx h-80rpx px-24rpx">
    <view>实付金额</view>
    <view class="text-28rpx" style="font-family: DIN-Medium">¥{{ totalPrice.toFixed(2) }}</view>
  </view>
  <view class="text-#aaaaaa text-24rpx py-18rpx px-24rpx">
    <view class="mt-10rpx">购买须知：</view>
    <view class="mt-10rpx">1. 下单付款后，SNAKE平台将联系您并寄出商品邮费到付，请关注。</view>
    <view class="mt-10rpx">2. 用户使用鉴别扣后，无需额外支付鉴别费用，一经售出不退不换。</view>
  </view>

  <view class="h-152rpx pb-safe"></view>

  <view class="w-100% snake-fixed-bottom flex flex-col px-24rpx">
    <view class="text-24rpx bg-white pt-12rpx" @click="checkAgreement">
      <radio class="agradio" color="#2EBD7C" :checked="agreement" style="transform: scale(0.7)" @click="checkAgreement" />
      <text class="text-24rpx text-#0f1113">我已阅读并同意</text>
      <text class="snake-font-medium text-24rpx text-#0f1113" @click.stop="$u.navTo('/pages/custom/cms?pageId=886')">
        《鉴别扣服务协议》
      </text>
    </view>

    <view class="flex-items-center justify-between pb-12rpx">
      <view class="flex-items-center text-24rpx">
        <text>实付金额:</text>
        <view class="text-34rpx text-#ff3367 snake-font-dinmedium">
          <text class="text-22rpx">￥</text>
          <text>{{ totalPrice }}</text>
        </view>
      </view>

      <u-button
        type="primary"
        :throttle-time="600"
        :disabled="disabled"
        custom-style="width: 212rpx; height: 80rpx; margin: 0"
        @click="submitOrder">
        提交订单
      </u-button>
    </view>
  </view>
</template>

<script>
import { getAddressGetIsDefault } from '@/api/user';
import { getAppraiseCodeTabApi, postAppraiseCodePurchaseApi } from '@/api/appraise';
import { requestPayment } from '@/utils/payment';

import { useUserStore } from '@/stores/modules/user';

const userStore = useUserStore();
export default {
  data() {
    return {
      type: '',
      num: 0,
      agreement: false,
      curRange: {},
      remark: '',
      addressData: {},
      amount: 0,
      totalPrice: 0,
      isClick: false,
    };
  },
  async onLoad(options) {
    const { type, amount, totalprice } = options;
    this.type = type;
    this.amount = amount;
    this.totalPrice = this.formatFloat(totalprice, 2);
    await this.getAppraiseRange();
    await this.getAddressDefault();
  },
  async onShow() {
    if (this.isClick) {
      this.isClick = false;
      await uni.$u.sleep(1000);
      uni.$u.navTo('/pages/order/codeOrderList');
    }
  },
  computed: {
    disabled() {
      return !(!uni.$u.test.empty(this.addressData) && this.agreement);
    },
  },
  methods: {
    formatFloat(f, digit) {
      const m = Math.pow(10, digit);
      const num = Math.round(f * m) / m;
      return num;
    },
    async getAddressDefault() {
      const response = await getAddressGetIsDefault();
      if (response.success) {
        this.addressData = response.data || {};
      } else {
        uni.$u.toast(response.msg);
      }
    },
    async getAppraiseRange() {
      const response = await getAppraiseCodeTabApi();
      if (response.success) {
        this.curRange = response.data.find((item) => item.type === this.type);
      } else {
        uni.$u.toast(response.msg);
      }
      return response;
    },
    checkAgreement() {
      this.agreement = !this.agreement;
    },
    async submitOrder() {
      if (uni.$u.test.empty(this.addressData)) {
        uni.$u.toast('请选择上门取件地址');
        return;
      }
      if (!this.agreement) {
        uni.$u.toast('请勾选协议');
        return;
      }

      if (!this.remark) {
        uni.$u.toast('请填写备注');
        return;
      }

      const params = {
        remark: this.remark,
        addressId: this.addressData.id,
        amount: this.amount,
        shoeAmount: this.num,
        totalPrice: this.totalPrice,
        type: this.type,
        payType: 'alipay',
      };

      // #ifdef H5
      params.payType = 'alipay_h5';
      params.callbackUrl = this.H5PAYRETURN;
      // #endif

      // #ifdef MP-ALIPAY
      params.payType = 'alipay_ma';
      params.buyerId = userStore.userInfo.openid;
      // #endif

      // #ifdef MP-WEIXIN
      params.payType = 'wx_ma';
      params.buyerId = userStore.userInfo.openid;
      // #endif

      const response = await postAppraiseCodePurchaseApi(params);
      if (response.success) {
        const { payDataType, payData, type } = response.data;
        if (this.totalPrice < 0.1) {
          uni.$u.toast(response.data);
          await uni.$u.sleep(1000);
          uni.$u.navTo('/pages/order/codeOrderList');
          return;
        }
        requestPayment({
          data: {
            data: payData,
            type: type || params.payType,
            payDataType,
          },
          success: async (res) => {
            if (res?.isClick) {
              this.isClick = res.isClick;
            } else {
              this.$u.toast('支付成功');
              await uni.$u.sleep(1000);
              uni.$u.navTo('/pages/order/codeOrderList');
            }
          },
          fail: async () => {
            uni.$u.toast('支付失败');
            await uni.$u.sleep(1000);
            uni.$u.navTo('/pages/order/codeOrderList');
          },
        });
      } else {
        uni.$u.toast(response.msg);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
