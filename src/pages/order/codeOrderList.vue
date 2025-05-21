<template>
  <view class="flex flex-wrap">
    <view v-for="item in orderList" :key="item.id" class="flex flex-col bg-white w-100% m-24rpx p-20rpx pt-0 rounded-10rpx">
      <!-- top -->
      <view class="flex-items-center justify-between py-20rpx" style="border-bottom: 1px solid #eeeef6">
        <text class="text-24rpx text-#626772">{{ $u.formatTime(item.gmtCreate) }}</text>
        <text class="text-28rpx text-red">{{ item.statusName }}</text>
      </view>
      <!-- content -->
      <view class="flex mt-30rpx mb-20rpx pb-30rpx" style="border-bottom: 1px solid #eeeef6">
        <view class="w-160rpx h-160rpx">
          <image class="w-160rpx h-160rpx" :src="$u.imageResize(item.image, 375)" lazy-load mode="aspectFill"></image>
        </view>
        <view class="pl-20rpx flex-1 flex flex-col justify-between">
          <view>
            <view class="text-28rpx">{{ item.name }}</view>
            <view class="mt-10rpx text-22rpx text-#aaaaaa">{{ item.amountStr }}</view>
          </view>
          <view class="flex-items-center justify-between">
            <view class="text-#06d290">物流单号：{{ item.expressNo || '暂无' }}</view>
            <view class="text-28rpx snake-font-dinmedium">
              <text class="text-18rpx">￥</text>
              <text>{{ item.totalPriceStr }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="text-24rpx">{{ item.remark }}</view>
    </view>
  </view>
  <!-- 空白页 -->
  <u-empty v-if="orderList.length === 0"></u-empty>
  <u-loadmore v-if="orderList.length" :status="loadingStatus"></u-loadmore>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { getAppraiseCodeOrderListApi } from '@/api/appraise';

import type { LoadMoreProps } from '@/uni_modules/uview-plus/types/comps/loadMore';

const $u = uni.$u;

const page = ref(1);
const orderList = ref([]);

const loadingStatus = ref<LoadMoreProps['status']>('loadmore');

onLoad(() => {
  getOrderList('refresh');
});

onPullDownRefresh(async () => {
  getOrderList('refresh');
  await uni.$u.sleep(500);
  uni.stopPullDownRefresh();
});

onReachBottom(() => {
  if (loadingStatus.value === 'loading') {
    getOrderList();
  }
});

// 获取订单列表
const getOrderList = async (type = '') => {
  // 刷新
  if (type === 'refresh') {
    page.value = 1;
    orderList.value = [];
  }

  const params = {
    page: page.value,
    size: 20,
  };
  const response = await getAppraiseCodeOrderListApi(params);
  if (response.success) {
    const newList = response.data?.items || [];
    orderList.value = orderList.value.concat(newList);
    // 分页
    if (newList.length < 20) {
      loadingStatus.value = 'nomore';
    } else {
      loadingStatus.value = 'loading';
      page.value++;
    }
  } else {
    uni.$u.toast(response.msg);
  }
};
</script>

<style lang="scss" scoped></style>
