<template>
  <view>
    <view class="appraise-result !mt-50rpx" v-if="isLogin">
      <view class="flex-center py-40rpx">
        <image class="w-200rpx h-86rpx" src="https://cdn.puresnake.com/xy-web/POWERED BY.png" mode="widthFix"></image>
      </view>

      <view class="text-center pos-relative">
        <view class="text-28rpx">{{ $t('appraise.order.appraisalResult') }}</view>
        <view class="text-56rpx mt-28rpx font-bold">************</view>

        <view class="flex-center pt-41rpx">
          <u-button color="#06D290" custom-style="width: 599rpx; height: 90rpx; border-radius: 2rpx" @click="loginShow = true">
            {{ $t('common.clickLoginToView') }}
          </u-button>
        </view>
      </view>

      <view class="w-100% pos-absolute bottom-42rpx flex-items-center justify-between px-34rpx box-border">
        <view class="flex flex-col">
          <text class="text-#ACACB7 text-22rpx">{{ $t('common.appraiser') }}</text>
          <text class="text-28rpx font-bold mt-6rpx">******</text>
        </view>
        <view class="flex flex-col">
          <text class="text-#ACACB7 text-22rpx">{{ $t('appraise.order.orderId') }}</text>
          <text class="text-28rpx font-bold mt-6rpx">********</text>
        </view>
      </view>

      <snake-login-popup :show="loginShow" @close="loginShow = false" @refresh="getDetail"></snake-login-popup>
    </view>

    <u-empty :text="$t('pages.dyDetail') + $t('common.noData')" margin-top="60" v-else-if="$u.test.empty(orderInfo)"></u-empty>

    <view class="pb-50rpx" v-else>
      <view class="flex-center">
        <image class="w-372rpx h-105rpx" src="https://cdn.puresnake.com/xy-web/background2.png"></image>
      </view>

      <view class="appraise-result" :class="[{ needImg_bg: orderInfo.status === 'need_img' }]">
        <view class="flex-center py-40rpx">
          <image class="w-200rpx h-86rpx" src="https://cdn.puresnake.com/xy-web/POWERED BY.png" mode="widthFix"></image>
        </view>

        <view class="text-center pos-relative">
          <view class="text-28rpx">{{ $t('appraise.order.appraisalResult') }}</view>
          <view class="text-#ff3367 mt-10rpx text-26rpx" v-if="isIdentifyResult">{{ $t('appraise.order.resultExpired') }}</view>
          <view
            class="result-title"
            :class="[
              {
                'result-title--pink': ['fail', 'outrange'].includes(orderInfo.status),
                'result-title--green': orderInfo.status === 'finish',
              },
            ]">
            {{ $t('appraise.order.' + orderInfo.status) }}
          </view>

          <view class="text-22rpx mt-10rpx text-#B1B2C1">
            {{ orderInfo.status === 'unpaid' ? $t('appraise.order.orderClosed') : orderInfo.resultBasedOnDesc || '' }}
          </view>

          <view v-if="orderInfo.appraisetype">
            <view class="text-24rpx mt-30rpx font-500 snake-font-medium">{{ $t('appraise.code.shoeBuckle') }}</view>
            <view class="text-24rpx mt-8rpx font-bold snake-font-dinBold text-#888891">
              {{ orderInfo.appraisetype }}
            </view>
          </view>
        </view>

        <image
          v-if="uni.getLocale() === 'zh-CN'"
          class="pos-absolute right-20rpx bottom-257rpx w-168rpx h-168rpx z-12"
          :src="`https://cdn.puresnake.com/xy-web/appraise/appraise_${orderInfo.stamp}.png`"
          mode="widthFix"></image>

        <view class="flex-center flex-col mt-10rpx" v-if="orderInfo.status === 'need_img' && orderInfo.extraImageRmd">
          <view class="text-28rpx snake-font-medium">{{ $t('appraise.check.remarkPlaceholder') }}</view>
          <view class="text-24rpx mt-4rpx px-50rpx" style="color: rgba(136, 136, 145, 1)">
            {{ orderInfo.extraImageRmd }}
          </view>
        </view>

        <view
          class="w-100% pos-absolute bottom-42rpx flex-items-center justify-between px-34rpx box-border"
          v-if="orderInfo.appraiserName && orderInfo.id">
          <view class="flex flex-col">
            <text class="text-#ACACB7 text-22rpx">{{ $t('common.appraiser') }}</text>
            <text class="text-28rpx font-bold mt-6rpx">{{ hideCharacters(orderInfo.appraiserName) }}</text>
          </view>
          <view class="flex flex-col">
            <text class="text-#ACACB7 text-22rpx">{{ $t('appraise.order.orderId') }}</text>
            <text class="text-28rpx font-bold mt-6rpx">{{ orderInfo.id }}</text>
          </view>
        </view>
      </view>

      <view class="bg-white mt-64rpx">
        <view class="flex-items-center pt-30rpx">
          <view class="flex-1 text-center text-24rpx">
            <text class="text-#ACACB7">{{ $t('common.publishTime') }}</text>
            <view class="mt-12rpx">{{ $u.formatTime(orderInfo.gmtCreate) }}</view>
          </view>
        </view>
        <view class="flex-items-center justify-between flex-wrap p-20rpx" v-if="orderInfo.imageList">
          <view
            class="mb-20rpx"
            :class="[orderInfo.imageList.length <= 1 ? 'w-100vw h-670rpx' : 'w-345rpx h-345rpx']"
            v-for="(item, index) in orderInfo.imageList"
            :key="index">
            <image
              class="w-100% h-100%"
              :src="item.image"
              lazy-load
              mode="aspectFill"
              @click="
                previewImage(
                  orderInfo.imageList.map((e) => e.image),
                  index,
                )
              "></image>
          </view>
        </view>
      </view>
      <view class="mt-20rpx ml-44rpx">
        <view class="flex-items-center text-24rpx">
          <view class="snake-font-regular text-24rpx w-200rpx text-#acacb7">{{ $t('common.remark') }}</view>
          <view class="snake-font-medium font-500">{{ orderInfo.remark || '' }}</view>
        </view>
        <view class="flex-items-center mt-12rpx text-24rpx">
          <view class="snake-font-regular w-200rpx text-#acacb7">{{ $t('appraise.order.orderId') }}</view>
          <view class="snake-font-medium font-500">{{ orderInfo.id || '' }}</view>
          <button
            class="m-0 p-0 !px-16rpx !ml-20rpx text-24rpx text-#707184 rounded-20rpx h-34rpx line-height-34rpx"
            style="border: 1px solid #707184"
            @click="$u.copy(orderInfo.id)">
            {{ $t('common.copy') }}
          </button>
        </view>
      </view>
      <view
        class="flex-center flex-col mt-26rpx mx-20rpx p-14rpx pb-20rpx bg-#EEEEEE rounded-4rpx"
        v-if="orderInfo.status !== 'unpaid' && orderInfo.resultAnnouncement">
        <view class="snake-font-medium fw-500 text-24rpx text-#889099">
          {{ orderInfo.resultBasedOnType === 'image' ? $t('common.image') : $t('common.physical')
          }}{{ $t('appraise.identify.imageIdentifyStatement.title') }}
        </view>
        <view class="snake-font-light mt-12rpx text-24rpx text-#889099 text-justify fw-300 line-height-40rpx">
          {{ orderInfo.resultAnnouncement }}
        </view>
      </view>

      <view class="h-104rpx pb-safe"></view>
      <view class="snake-fixed-bottom" v-if="orderInfo.status === 'need_img' && orderInfo.operate">
        <view class="px-24rpx py-12rpx">
          <u-button type="primary" @click="$u.navTo(`/pages/appraise/supplement?orderId=${orderId}`)">
            {{ $t('pages.supplement') }}
          </u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getAppraiseOrderDetailApi } from '@/api/appraise';

import { previewImage } from '@/utils';
import { usePageTitle } from '@/hooks/usePageTitle';

usePageTitle('pages.orderDetail');

const $u = uni.$u;

const orderId = ref();
const orderInfo = ref(null);
const loginShow = ref(false);

const isLogin = ref(false);

const isIdentifyResult = computed(() => {
  const currentTimestamp = new Date(orderInfo.value.gmtCreate).getTime(); // 获取订单生成时间戳
  const days = 365 * 24 * 60 * 60 * 1000; // 将天数转换为毫秒数
  const twelve0DaysAgoTimestamp = currentTimestamp + days;
  return Date.now() > twelve0DaysAgoTimestamp;
});

onLoad((options) => {
  if (options.orderId) {
    orderId.value = options.orderId;
    getDetail();
  }
});

const getDetail = async () => {
  try {
    isLogin.value = false;
    const response = await getAppraiseOrderDetailApi({
      orderId: orderId.value,
    });

    if (response.success) {
      orderInfo.value = response.data || {};
    } else if (response.status === 401) {
      // #ifndef H5 || APP-PLUS
      isLogin.value = true;
      // #endif
      // #ifdef H5 || APP-PLUS
      isLogin.value = true;
      // uni.navigateTo({
      //   url: '/pages/login/oauth',
      // });
      // #endif
    } else {
      uni.$u.toast(response.msg);
    }
  } catch (e) {}
};

const hideCharacters = (name) => {
  const length = name.length;
  if (length === 1) {
    return name;
  } else if (length === 2) {
    return name.charAt(0) + '*';
  } else {
    return name.charAt(0) + '*'.repeat(length - 2) + name.charAt(length - 1);
  }
};
</script>

<style lang="scss" scoped>
.appraise-result {
  background: url(https://cdn.puresnake.com/xy-web/appraise/bg_card.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 48rpx;
  height: 640rpx;
  box-sizing: border-box;
  position: relative;

  .needImg_bg {
    background: url('https://cdn.puresnake.com/xy-web/appraise/bg_card2.png') no-repeat !important;
    background-size: 100% 100% !important;
    height: 828rpx;
  }
}

.result-title {
  color: #26273a;
  font-size: 56rpx;
  font-weight: bold;
  padding-top: 10rpx;
  display: inline-block;
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: -1;
    width: 100%;
    height: 24rpx;
    background: #b1b2c1 !important;
  }

  &--pink::after {
    content: '';
    background: #ff3367 !important;
  }
  &--green::after {
    content: '';
    background: rgba(6, 210, 144, 0.6) !important;
  }
}
</style>
