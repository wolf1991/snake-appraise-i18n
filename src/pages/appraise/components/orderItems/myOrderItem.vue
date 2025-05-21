<template>
  <view class="bg-white mx-24rpx mt-20rpx px-24rpx rounded-8rpx" @click="$emit('click', item)">
    <view class="flex-items-center justify-between py-12rpx" style="border-bottom: 1px solid #eeeef6">
      <view class="text-white">
        <text class="text-24rpx py-2rpx px-7rpx rounded-4rpx bg-#7A3BFF mr-10rpx" v-if="item.highRisk">风险</text>
        <text class="text-24rpx py-2rpx px-7rpx rounded-4rpx bg-#FF525D mr-10rpx" v-if="item.overTimeFlag">超时</text>
        <text class="text-24rpx py-2rpx px-7rpx rounded-4rpx bg-#3688ff mr-10rpx" v-if="item.needImgFlag">补图</text>
        <text class="text-24rpx font-600 text-#000">{{ item.userName || '' }}</text>
      </view>
      <text v-if="item.rangeRemark" class="text-#707184 text-24rpx">{{ item.rangeRemark }}</text>
      <text v-else class="text-#707184 text-24rpx">{{ item.brandName || '' }} {{ item.rangeName || '' }}</text>
    </view>
    <view class="flex pt-24rpx pb-12rpx">
      <view class="w-160rpx h-160rpx">
        <image class="w-160rpx h-160rpx" :src="$u.imageResize(item.image, 375)" lazy-load mode="aspectFill"></image>
      </view>
      <view class="pl-20rpx flex flex-col justify-between flex-1">
        <view class="font-500 text-28rpx">{{ item.productName || '' }}</view>
        <view class="text-24rpx">
          <view class="text-#FF525D font-600" v-if="item.deadline">截止时间：{{ item.deadline }}</view>
          <view class="flex-items-center justify-between mt-10rpx">
            <view class="text-#707184">来源：{{ item.fromOrigin || '无' }}</view>
            <view class="text-#FF525D text-32rpx font-500">{{ item.statusName }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps({
  item: {
    type: Object,
    required: true,
    default: () => {},
  },
});

const $u = uni.$u;
</script>

<style lang="scss" scoped></style>
