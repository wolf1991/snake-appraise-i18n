<template>
  <view class="bg-white mx-24rpx mt-20rpx px-24rpx rounded-8rpx">
    <view
      class="flex-items-center justify-between py-12rpx"
      style="border-bottom: 1px solid #eeeef6"
      @click="emit('click', item)">
      <text class="text-black text-24rpx font-600">{{ item.userName || '' }}</text>
      <text v-if="item.rangeRemark" class="text-#707184 text-24rpx">{{ item.rangeRemark }}</text>
      <text v-else class="text-#707184 text-24rpx">{{ item.brandName || '' }} {{ item.rangeName || '' }}</text>
    </view>
    <view class="flex pt-24rpx pb-12rpx" @click="emit('click', item)">
      <view class="w-160rpx h-160rpx">
        <image class="w-160rpx h-160rpx" :src="$u.imageResize(item.image, 375)" lazy-load mode="aspectFill"></image>
      </view>
      <view class="pl-20rpx flex flex-col justify-between flex-1">
        <view class="font-500 text-28rpx">{{ item.productName || '' }}</view>
        <view class="text-#707184 text-24rpx">{{ $t('appraise.order.source') }}：{{ item.fromOrigin || $t('common.none') }}</view>
      </view>
    </view>
    <view class="flex justify-end py-12rpx">
      <u-button
        type="primary"
        :throttle-time="600"
        custom-style="width: 154rpx; height: 60rpx; margin: 0"
        @click.stop="emit('click-operate', item, index)">
        {{ $t('appraise.appraiser.grabOrderNow') }}
      </u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits(['click', 'click-operate']);

defineProps({
  item: {
    type: Object,
    required: true,
    default: () => {},
  },
  index: {
    type: Number,
    default: -1,
  },
});

const $u = uni.$u;
</script>

<style lang="scss" scoped></style>
