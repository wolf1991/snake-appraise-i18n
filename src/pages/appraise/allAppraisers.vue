<template>
  <u-sticky bg-color="#fff">
    <u-tabs
      :list="catList"
      :current="catCurrent"
      key-name="cateName"
      :scrollable="catList && catList.length > 5"
      lineColor="#06D290"
      :lineHeight="4"
      :active-style="{ fontSize: '32rpx', color: '#000000', fontWeight: 700 }"
      :inactive-style="{ fontSize: '28rpx', color: '#000000', fontWeight: 700 }"
      @change="catChange"></u-tabs>
  </u-sticky>

  <view class="flex flex-wrap justify-between m-24rpx">
    <template v-for="item in appraisersList" :key="item.id">
      <view
        class="bg-white flex-basis-340rpx text-center mb-22rpx rounded-8rpx"
        style="box-shadow: 0px 1px 6px 0px rgba(188, 206, 207, 0.28)">
        <image
          class="w-120rpx h-120rpx mt-48rpx rounded-120rpx img-shadow"
          :src="$u.imageResize(item.headImage, 120)"
          mode="aspectFill" />
        <view class="mb-16rpx text-28rpx font-500">{{ item.name }}</view>
        <view class="h-66rpx line-height-33rpx line-clamp-2 mt-10rpx mx-10rpx text-24rpx text-#666666">{{ item.scope }}</view>
        <view class="flex items-center justify-between fw-300 text-#111 bg-#f6f6f6 h-97rpx">
          <view class="flex-1 w-80rpx">
            <text class="text-26rpx font-700 snake-font-dinBold">{{ item.appraiseCount }}</text>
            <view class="text-18rpx text-#aaaaaa">排队人数</view>
          </view>
          <view class="w-1rpx h-48rpx bg-#e7e7e7"></view>
          <view class="flex-1 w-80rpx">
            <text class="text-26rpx font-700 snake-font-dinBold">{{ $u.numFormat(item.total) }}</text>
            <view class="text-18rpx text-#aaaaaa">累计战绩</view>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { onLoad } from '@dcloudio/uni-app';
import { getAppraiseCategoryListApi, getAppraiseUserListApi } from '@/api/appraise';
import type { LoadMoreProps } from '@/uni_modules/uview-plus/types/comps/loadMore';

const $u = uni.$u;

const catList = ref();
const catCurrent = ref(0);

const page = ref(1);
const appraisersList = ref([]);
const loadingStatus = ref<LoadMoreProps['status']>('loadmore');

onLoad(async (options) => {
  await getCategorys();
  const { current } = options;
  if (catList.value.length > 0 && current) {
    const index = catList.value.map((e) => e.catId).indexOf(current);
    catCurrent.value = index === -1 ? 0 : index;
  }
  getAppraiseUserList('refresh');
});

const catChange = (e) => {
  catCurrent.value = e.index;
  getAppraiseUserList('refresh');
};

const getCategorys = async () => {
  const response = await getAppraiseCategoryListApi();

  if (response.success) {
    catList.value = response.data || [];
  } else {
    uni.$u.toast(response.msg);
  }
};

const getAppraiseUserList = async (type = '') => {
  if (type === 'refresh') {
    page.value = 1;
    appraisersList.value = [];
  }

  const response = await getAppraiseUserListApi({
    page: page.value,
    size: 20,
    catId: catList.value[catCurrent.value].catId,
  });
  if (response.success) {
    const newList = response.data?.items || [];
    appraisersList.value = appraisersList.value.concat(newList);
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

<style lang="scss" scoped>
.img-shadow {
  box-shadow:
    0 4px 20px 0 #a4a8b614,
    0 4px 10px 0 #9d9fa614;
}
</style>
