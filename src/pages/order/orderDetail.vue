<template>
  <u-empty text="鉴别详情为空" margin-top="60" v-if="$u.test.empty(orderInfo)"></u-empty>

  <view
    class="appraise-result !mt-50rpx"
    :class="[{ needImg_bg: orderInfo.status === 'need_img' }]"
    v-else-if="!userStore.isLogined">
    <view class="flex-center py-40rpx">
      <image class="w-200rpx h-86rpx" src="https://cdn.puresnake.com/xy-web/POWERED BY.png" mode="widthFix"></image>
    </view>

    <view class="text-center pos-relative">
      <view class="test-24rpx">鉴别结果</view>
      <view class="text-#ff3367" v-if="isIdentifyResult">鉴别结果已失效:建议重新提交鉴别</view>
      <view class="text-56rpx mt-28rpx font-bold">************</view>

      <view class="flex-center pt-41rpx">
        <u-button color="#06D290" custom-style="width: 599rpx; height: 90rpx; border-radius: 2rpx" @click="loginShow = true">
          点击登录查看结果
        </u-button>
      </view>
    </view>

    <view class="w-100% pos-absolute bottom-42rpx flex-items-center justify-between px-34rpx box-border">
      <view class="flex flex-col">
        <text class="text-#ACACB7 text-22rpx">鉴别师</text>
        <text class="text-28rpx font-bold mt-6rpx">******</text>
      </view>
      <view class="flex flex-col">
        <text class="text-#ACACB7 text-22rpx">鉴别单号</text>
        <text class="text-28rpx font-bold mt-6rpx">********</text>
      </view>
    </view>

    <snake-login-popup :show="loginShow" @close="loginShow = false" @refresh="getDetail"></snake-login-popup>
  </view>

  <view class="pb-50rpx" v-else>
    <view class="flex-center">
      <image class="w-372rpx h-105rpx" src="https://cdn.puresnake.com/xy-web/background2.png"></image>
    </view>

    <view class="appraise-result" :class="[{ needImg_bg: orderInfo.status === 'need_img' }]">
      <view class="flex-center py-40rpx">
        <image class="w-200rpx h-86rpx" src="https://cdn.puresnake.com/xy-web/POWERED BY.png" mode="widthFix"></image>
      </view>

      <view class="text-center pos-relative">
        <view class="test-24rpx">鉴别结果</view>
        <view class="text-#ff3367" v-if="isIdentifyResult">鉴别结果已失效:建议重新提交鉴别</view>
        <view
          class="result-title"
          :class="[
            {
              'result-title--pink': ['fail', 'outrange'].includes(orderInfo.status),
              'result-title--green': orderInfo.status === 'finish',
            },
          ]">
          {{ stateMap[orderInfo.status] }}
        </view>

        <view class="text-24rpx mt-10rpx text-#B1B2C1">
          {{ orderInfo.status === 'unpaid' ? '当前订单已关闭' : '鉴别结果根据用户提供图片得出' }}
        </view>

        <view v-if="orderInfo.appraisetype">
          <view class="text-24rpx mt-30rpx font-500 snake-font-medium">鉴别扣</view>
          <view class="text-24rpx mt-8rpx font-bold snake-font-dinBold text-#888891">
            {{ orderInfo.appraisetype }}
          </view>
        </view>
      </view>

      <image
        class="pos-absolute right-34rpx bottom-157rpx w-168rpx h-168rpx"
        :src="`https://cdn.puresnake.com/xy-web/appraise/appraise_${orderInfo.stamp}.png`"
        mode="widthFix"></image>

      <view class="needImg_opinion" v-if="orderInfo.status === 'need_img' && orderInfo.extraImageRmd">
        <view class="snake-f14 snake-font-medium">补图意见</view>
        <view class="snake-f12 snake-mt4" style="color: rgba(136, 136, 145, 1); padding: 0 49rpx">
          {{ orderInfo.extraImageRmd }}
        </view>
      </view>

      <view
        class="w-100% pos-absolute bottom-42rpx flex-items-center justify-between px-34rpx box-border"
        v-if="orderInfo.appraiserName && orderInfo.id">
        <view class="flex flex-col">
          <text class="text-#ACACB7 text-22rpx">鉴别师</text>
          <text class="text-28rpx font-bold mt-6rpx">{{ hideCharacters(orderInfo.appraiserName) }}</text>
        </view>
        <view class="flex flex-col">
          <text class="text-#ACACB7 text-22rpx">鉴别单号</text>
          <text class="text-28rpx font-bold mt-6rpx">{{ orderInfo.id }}</text>
        </view>
      </view>
    </view>

    <view class="bg-white mt-64rpx">
      <view class="flex-items-center pt-30rpx">
        <view class="flex-1 text-center text-24rpx">
          <text class="text-#ACACB7">发布时间</text>
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
      <view class="flex-items-center">
        <view class="snake-font-regular w-200rpx text-#acacb7">备注</view>
        <view class="snake-font-medium font-500">{{ orderInfo.remark || '无' }}</view>
      </view>
      <view class="flex-items-center mt-12rpx">
        <view class="snake-font-regular w-200rpx text-#acacb7">鉴别单号</view>
        <view class="snake-font-medium font-500">{{ orderInfo.id || '无' }}</view>
        <button
          class="m-0 p-0 px-16rpx ml-20rpx text-24rpx text-#707184 rounded-20rpx h-34rpx line-height-34rpx"
          style="border: 1px solid #707184"
          @click="$u.copy(orderInfo.id)">
          复制
        </button>
      </view>
    </view>

    <view class="h-104rpx pb-safe"></view>
    <view class="snake-fixed-bottom" v-if="orderInfo.status === 'need_img' && orderInfo.operate">
      <view class="px-24rpx py-12rpx">
        <u-button type="primary" @click="$u.navTo(`/pages/appraise/supplement?orderId=${orderId}`)">去补图</u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/modules/user';
import { getAppraiseOrderDetailApi } from '@/api/appraise';

import { previewImage } from '@/utils';

const userStore = useUserStore();

const $u = uni.$u;

const stateMap = {
  unpaid: '未付款',
  unappraised: '待鉴别',
  finish: '符合正品工艺', // 鉴别为真
  fail: '无法鉴别',
  fake: '不符合正品工艺', // 鉴别为假
  need_img: '待补图',
  outrange: '无法鉴别', // 非鉴别范围
};

const orderId = ref();
const orderInfo = ref(null);
const loginShow = ref(false);

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
  const response = await getAppraiseOrderDetailApi({
    orderId: orderId.value,
  });
  if (response.success) {
    orderInfo.value = response.data || {};
  } else {
    uni.$u.toast(response.msg);
  }
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
  position: relative;
  box-sizing: border-box;
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
