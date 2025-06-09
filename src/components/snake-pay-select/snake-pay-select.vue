<template>
  <u-popup :show="show" :z-index="101">
    <!-- 支付-模态层弹窗 -->
    <view class="pay-wrapper">
      <view class="pay-wrapper-title pos-relative">
        <view class="text-32rpx">选择支付方式</view>
        <view class="pos-absolute top-0 right-28rpx" @click="close">
          <text class="next-icons icon-colse text-42rpx snake-deepblack"></text>
        </view>
      </view>
      <view class="pay-wrapper-content">
        <view class="price-box">
          <text class="price">{{ price || 0 }}</text>
        </view>
        <view class="pay-type-list" :style="foldedStyle">
          <view v-for="(item, index) in payList" :key="index" class="type-item" @tap="changePayType(item.payChannel, item.valid)">
            <!-- 余额支付 支付宝 微信支付 -->
            <view
              class="mr-10rpx codesign-icon"
              :class="item.icon"
              :style="{
                'font-size': item.payChannel == 'asset' ? '55rpx' : '48rpx',
                color: item.valid ? item.color : '#E8E8E8',
              }"></view>
            <view class="pay-name snake-font-regular" :style="{ color: item.valid ? '' : '#E8E8E8' }">
              <text class="tit">{{ item.payChannelName }}</text>
            </view>
            <label class="pay-radio">
              <text v-if="payType == item.payChannel" class="next-icons icon-selected text-38rpx text-#2ebd7c"></text>
              <text v-else class="next-icons icon-notselected text-38rpx text-#dddddd"></text>
            </label>
          </view>
        </view>
        <!-- #ifdef APP-PLUS -->
        <view class="folded-btn snake-font-regular flex-center" @click="openFolded" v-if="foldedShow">
          <text>展开其他支付方式</text>
          <text class="next-icons icon-arrow-down ml-2rpx"></text>
        </view>
        <!-- #endif -->
        <button class="pay-btn" @click="toPayment">去支付</button>
        <view class="pb-safe"></view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    father: {
      type: [Object, null],
      default() {
        return {};
      },
    },
  },
  computed: {
    foldedStyle() {
      const style = {};
      style.height = `${this.payList.length * 100}rpx`;
      style.transition = 'all 0.3s';
      style.overflow = 'hidden';
      return style;
    },
  },
  data() {
    return {
      show: false,
      payList: [],
      payType: 'alipay',
      asyncOptions: null,
      price: '',
      type: '',
      foldedShow: false,
      foldedList: [],
    };
  },
  methods: {
    // 打开弹窗
    open() {
      this.show = true;
    },
    // 关闭弹窗
    close() {
      this.show = false;
    },
    changePayType(id, valid) {
      if (!valid) {
        // 一般是余额不足 禁止选择
        return;
      }
      this.payType = id;
    },
    // 异步打开弹窗
    asyncOpen(options) {
      this.price = options.price || '';
      this.type = options.type || '';
      const payChannelList = [...options.payChannelList] || [];
      if (this.foldedList !== 0) {
        this.foldedList = [];
      }
      payChannelList.forEach((item, index) => {
        // 默认选中的支付方式
        if (item.defaulted) {
          this.payType = item.payChannel;
        }
        // #ifdef APP-PLUS
        // 是否折叠支付方式
        // if (item.folded) {
        // 	this.foldedList.push(item);
        // 	payChannelList.splice(index, 1);
        // 	this.foldedShow = true;
        // }
        // #endif
      });
      this.payList = payChannelList;
      return new Promise((resolve, reject) => {
        const asyncOpts = uni.$u.deepClone(options);
        asyncOpts.selectOption = function (...args) {
          resolve(...args);
        };
        this.asyncOptions = asyncOpts;
        this.open();
      });
    },
    // 打开折叠内容
    openFolded() {
      this.foldedShow = !this.foldedShow;
      this.payList = this.payList.concat(this.foldedList);
    },
    // 去支付
    async toPayment() {
      await this.asyncOptions.selectOption({ payType: this.payType });
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
/*支付弹窗*/
.pay-wrapper {
  height: 847rpx;
  background-color: #ffffff;
  position: relative;
}

.pay-wrapper-title {
  line-height: 120rpx;
  font-size: 14px;
  text-align: center;
  border-bottom: 1rpx solid #e8e8e8;
}

.pay-wrapper-content {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 45rpx 28rpx;
  box-sizing: border-box;
}

.price-box {
  background-color: #fff;
  height: 112rpx;
  padding-bottom: 44rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 28upx;
  color: #909399;

  .price {
    font-size: 80rpx;
    color: #26273a;
    margin-top: 12upx;

    &:before {
      content: '￥';
      font-size: 44rpx;
    }
  }
}

.pay-type-list {
  .type-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    height: 100rpx;
    line-height: 100rpx;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #e8e8e8;
  }

  .pay-icon {
    width: 80rpx;
    line-height: 1;
  }

  .pay-name {
    flex: 1;
    padding-left: 20rpx;
  }
}

.folded-btn {
  width: 214rpx;
  height: 40rpx;
  border: 1rpx solid #707184;
  border-radius: 20rpx;
  margin: 40rpx auto 0;
  font-weight: 400;
  font-size: 20rpx;
  color: #707184;
}

.pay-btn {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 15rpx;
  width: 710rpx;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 32rpx;
  border-radius: 2rpx;
  background-color: #06d290;
  margin: 0 auto;

  &:after {
    border: none;
  }
}
</style>
