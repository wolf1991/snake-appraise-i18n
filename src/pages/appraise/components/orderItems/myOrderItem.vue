<template>
  <view class="bg-white mx-24rpx mt-20rpx px-24rpx rounded-8rpx" @click="$emit('click', item)">
    <view class="flex-items-center justify-between py-12rpx" style="border-bottom: 1px solid #eeeef6">
      <view class="text-white">
        <text class="text-24rpx py-2rpx px-7rpx rounded-4rpx bg-#7A3BFF mr-10rpx" v-if="item.highRisk">{{ $t('appraise.order.risk') }}</text>
        <text class="text-24rpx py-2rpx px-7rpx rounded-4rpx bg-#FF525D mr-10rpx" v-if="item.overTimeFlag">{{ $t('examPaper.timeout') }}</text>
        <text class="text-24rpx py-2rpx px-7rpx rounded-4rpx bg-#3688ff mr-10rpx" v-if="item.needImgFlag">{{ $t('pages.supplement') }}</text>
        <text class="text-24rpx py-2rpx px-7rpx rounded-4rpx bg-#f37b1d mr-10rpx" v-if="item.coAppraiseFlag">{{ $t('appraise.order.recheck') }}</text>
        <text class="text-24rpx font-600 text-#000">{{ item.userName || '' }}</text>
        <text class="text-24rpx font-600 text-#000" v-if="item.fromOrigin">-{{ item.fromOrigin || '' }}</text>
      </view>
      <text v-if="item.rangeRemark" class="text-#707184 text-24rpx">{{ item.rangeRemark }}</text>
      <text v-else class="text-#707184 text-24rpx">{{ item.brandName || '' }} {{ item.rangeName || '' }}</text>
    </view>
    <view class="flex pt-24rpx pb-12rpx">
      <view class="w-160rpx h-160rpx">
        <image class="w-160rpx h-160rpx" :src="$u.imageResize(item.image, 375)" lazy-load mode="aspectFill"></image>
      </view>
      <view class="pl-20rpx flex flex-col justify-between flex-1">
        <view class="font-500 text-28rpx line-clamp-2">{{ item.productName || '' }}</view>

        <view class="flex-items-center justify-between mt-10rpx">
          <view class="flex-items-center fw-600 text-28rpx" v-if="item.expireTime && item.expireTime > Date.now()">
            <text class="snake-font-medium text-#06d290">{{ $t('appraise.order.processing') }}：</text>
            <snake-count-down
              :timer="$u.formatTime(item.expireTime)"
              splitorColor="#06d290"
              border="2px solid #06d290"
              borderColor="#06d290"
              fontColor="#06d290"></snake-count-down>
          </view>
          <view class="text-#FF525D text-32rpx font-500 flex-1 flex justify-end">{{ item.statusName }}</view>
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

<style lang="scss" scoped>
::v-deep .snake-countdown-numbers {
  font-weight: 600;
}

::v-deep .snake-countdown-splitor {
  font-weight: 600;
  margin: 0 4rpx;
}
</style>
