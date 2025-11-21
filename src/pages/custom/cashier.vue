<template>
  <view class="top">
    <view class="top-title">{{ $t('common.cashier') }}</view>
    <view style="padding-top: 54rpx">
      <view class="top-amount">{{ $t('common.paymentAmount') }}</view>
      <view class="flex-center">
        <view class="prices">￥</view>
        <view class="price">{{ price }}</view>
      </view>
    </view>
    <view class="flex mt-168rpx" v-if="cancellation">
      <button class="return" open-type="launchApp" app-parameter="wechat">
        <view class="return-size">{{ $t('common.returnMerchant') }}</view>
      </button>
      <button class="payment" @click="wxPays()">
        <view class="payment-size">{{ $t('common.repay') }}</view>
      </button>
    </view>
    <view class="flex-center mt-168rpx" v-if="disburse">
      <button class="return" open-type="launchApp" app-parameter="wechat">
        <view class="return-size">{{ $t('common.returnMerchant') }}</view>
      </button>
    </view>
  </view>
</template>

<script>
import { postAppraisePayDoPayApi } from '@/api/appraise';
import { wxPay } from '@/utils/payment';
import { useUserStore } from '@/stores/modules/user';
export default {
  data() {
    return {
      payId: '',
      cancellation: false,
      disburse: false,
      wxpayTradeNo: '',
      price: '',
    };
  },
  onLoad(option) {
    this.payId = option?.payId || '';
    this.price = option?.price || '';
  },
  onShow() {
    if (this.payId) {
      this.wxPayPayment();
    }
  },
  methods: {
    wxPays() {
      this.cancellation = false;
      wxPay(this.wxpayTradeNo)
        .then(() => {
          this.$u.toast(uni.$t('common.paySuccess'));
          this.disburse = !this.disburse;
        })
        .catch((msg) => {
          this.cancellation = !this.cancellation;
          this.$u.toast(uni.$t('common.payFailed'), 1000);
        });
    },
    async wxPayPayment() {
      const userStore = useUserStore();
      const openid = userStore?.userInfo?.openid || uni.getStorageSync('userInfo')?.openid || uni.getStorageSync('__SK_OPENID');
      this.cancellation = false;
      const params = {
        openid,
        payId: this.payId,
      };
      try {
        const response = await postAppraisePayDoPayApi(params);
        if (response.success) {
          this.wxpayTradeNo = response?.data?.payData;
          this.wxpayTradeNo = typeof this.wxpayTradeNo === 'string' ? JSON.parse(this.wxpayTradeNo) : this.wxpayTradeNo;
          this.payId = '';
          wxPay(this.wxpayTradeNo)
            .then(() => {
              this.$u.toast(uni.$t('common.paySuccess'));
              this.disburse = !this.disburse;
            })
            .catch(() => {
              this.cancellation = !this.cancellation;
              this.$u.toast(uni.$t('common.payFailed'));
            });
        } else {
          this.$u.toast(response.msg);
          this.cancellation = !this.cancellation;
        }
      } catch (e) {
        this.$u.toast(e.message || uni.$t('common.payFailed'));
        this.cancellation = !this.cancellation;
      }
    },
  },
};
</script>

<style>
page {
  background-color: #fff;
}
</style>

<style scoped lang="scss">
.top {
  padding-top: 168rpx;
  text-align: center;
  .top-title {
    font-size: 38rpx;
    font-weight: 600;
  }
  .top-amount {
    height: 45rpx;
    font-size: 32rpx;
    color: #b1b2c1;
    letter-spacing: 0;
  }
}
.prices {
  color: #26273a;
  font-size: 36rpx;
  letter-spacing: 0;
}
.price {
  color: #26273a;
  font-size: 73rpx;
  font-weight: 600;
  letter-spacing: 0;
}
.return {
  width: 341rpx;
  height: 88rpx;
  border: 1rpx solid #b1b2c1;
  border-radius: 2rpx;
  margin: 0 20rpx;
  .return-size {
    font-weight: 600;
    font-size: 36rpx;
    color: #888891;
  }
}
.payment {
  width: 341rpx;
  height: 88rpx;
  background: #06d290;
  border: 1rpx solid #06d290;
  border-radius: 2rpx;
  margin-right: 20rpx;
  .payment-size {
    font-weight: 600;
    font-size: 36rpx;
    color: #ffffff;
  }
}
</style>
