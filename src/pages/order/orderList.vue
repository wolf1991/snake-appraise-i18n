<template>
  <u-sticky bg-color="#fff">
    <u-tabs
      :list="tabsList"
      :current="tabsCurrent"
      lineColor="#FF3367"
      :scrollable="true"
      keyName="label"
      :activeStyle="{ fontWeight: 600, fontSize: '32rpx', color: '#FF3367' }"
      :inactiveStyle="{ fontSize: '28rpx', color: '#1F1F27' }"
      @change="tabsChange"></u-tabs>
  </u-sticky>
  <!-- 订单列表 -->
  <view class="flex flex-wrap">
    <view
      v-for="item in orderList"
      :key="item.id"
      class="flex flex-col bg-white w-100% m-24rpx p-20rpx pt-0 rounded-10rpx pos-relative"
      @click="$u.navTo(`/pages/order/orderDetail?orderId=${item.id}`)">
      <!-- top -->
      <view class="flex-items-center justify-between py-20rpx" style="border-bottom: 1px solid #eeeef6">
        <text class="text-24rpx text-#626772">{{ item.rangeRemark || item.brandName || item.rangeName }}</text>

        <view>
          <text class="text-28rpx text-#000">{{ stateMap[item.status] }}</text>
          <template v-if="!item.orderCoupon && !item.appraiseCode">
            <text class="text-28rpx text-#000 ml-8rpx">{{ item.typePrice }}</text>
            <text class="text-24rpx text-#000 ml-8rpx" v-if="item.status === 'fail' || item.status === 'outrange'">(已退)</text>
          </template>
          <template v-if="item.orderCoupon && !item.appraiseCode">
            <text class="text-28rpx text-#000 ml-8rpx">{{ '￥' + item.orderCoupon.payPrice }}</text>
            <text class="text-24rpx text-#000 ml-8rpx">(鉴别码)</text>
          </template>
        </view>
      </view>
      <!-- content -->
      <view class="flex my-30rpx" style="border-bottom: 1px solid #eeeef6">
        <view class="w-120rpx h-120rpx">
          <image class="w-120rpx h-120rpx" :src="$u.imageResize(item.image, 375)" lazy-load mode="aspectFill"></image>
        </view>
        <view class="pl-20rpx">
          <view class="text-28rpx line-clamp-3">{{ item.productName }}</view>
          <view class="mt-10rpx text-24rpx" style="color: #acacb7">鉴定单ID: {{ item.id }}</view>
          <view class="flex-items-center" v-if="item.appraiseCode">
            <view class="w-38rpx h-38rpx text-center bg-#f6f6f6 rounded-20rpx">
              <text class="next-icons icon-qrbelt"></text>
            </view>
            <text class="text-24rpx text-#26273a">鉴别扣码: {{ item.appraiseCode }}</text>
          </view>
        </view>
      </view>

      <view v-if="item.stamp" class="w-160rpx h-160rpx pos-absolute top-120rpx right-30rpx">
        <image
          class="w-160rpx h-160rpx"
          :src="$u.imageResize(`https://cdn.puresnake.com/xy-web/appraise/appraise_${item.stamp}.png`, 375)"
          mode="widthFix"></image>
      </view>
      <!-- 订单日志 -->
      <view class="text-#aaa text-24rpx mt-10rpx flex justify-between" v-for="log in item.orderLogList" :key="log.id">
        <text>{{ log.operate }}</text>
        <text class="date">{{ $u.formatTime(log.gmtCreate) }}</text>
      </view>
    </view>
  </view>
  <!-- 空白页 -->
  <u-empty margin-top="120" v-if="orderList.length === 0"></u-empty>
  <u-loadmore v-if="orderList.length" :status="loadingStatus"></u-loadmore>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { getAppraiseOrderListApi } from '@/api/appraise';

import type { LoadMoreProps } from '@/uni_modules/uview-plus/types/comps/loadMore';

const $u = uni.$u;

const tabsCurrent = ref(0);

const stateMap = {
  unpaid: '未付款(关闭)',
  unappraised: '待鉴别',
  finish: '符合正品工艺', // 鉴别为真
  fail: '无法鉴别',
  fake: '不符合正品工艺', // 鉴别为假
  need_img: '待补图',
  outrange: '无法鉴别', // 非鉴别范围
};

const tabsList = [
  {
    label: '全部鉴别',
    value: 'all',
  },
  {
    label: '鉴别通过',
    value: 'pass',
  },
  {
    label: '待鉴别',
    value: 'wait',
  },
  {
    label: '待补图',
    value: 'needImage',
  },
  {
    label: '鉴别不通过',
    value: 'notPass',
  },
];

const page = ref(1);
const orderList = ref([]);

const loadingStatus = ref<LoadMoreProps['status']>('loadmore');

const tabsChange = (e) => {
  tabsCurrent.value = e.index;
  getOrderList('refresh');
};

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
    status: tabsList[tabsCurrent.value].value,
    size: 20,
  };
  const response = await getAppraiseOrderListApi(params);
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
