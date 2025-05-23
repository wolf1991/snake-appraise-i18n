<template>
  <snake-cms :pageInfo="pageInfo" :pageComponents="pageComponents" :scrollTop="scrollTop"></snake-cms>
  <view class="flex flex-col items-center px-24rpx pt-20rpx bg-white">
    <view class="flex items-center justify-between w-100% pb-32rpx">
      <view class="text-32rpx font-600">当前在线鉴别师</view>
      <view class="flex items-center text-#b2b2b2 text-24rpx" @click="$u.navTo('/pages/identify/allidentifier')">
        全部
        <u-icon color="#b2b2b2" name="arrow-right" size="14" />
      </view>
    </view>
    <view class="w-100% flex flex-wrap justify-between">
      <template v-for="item in appraiseUserList" :key="item.id">
        <view class="bg-#f7f7f9 flex-basis-226rpx text-center">
          <image
            class="w-120rpx h-120rpx mt-48rpx rounded-120rpx img-shadow"
            :src="$u.imageResize(item.headImage, 120)"
            mode="aspectFill" />
          <view class="mb-16rpx text-28rpx font-500">{{ item.name }}</view>
          <view class="flex items-center justify-between px-8rpx pb-20rpx fw-300 text-#111">
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
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getCmsInfo } from '@/api/cms';
import { getAppraiseUserListApi } from '@/api/appraise';

const $u = uni.$u;

const pageInfo = ref({});
const pageComponents = ref([]);
const scrollTop = ref(0);

const appraiseUserList = ref([]);

onLoad((options) => {
  getPageData();
  getAppraiseUserList();
});

const getPageData = async () => {
  try {
    const params = {
      pageType: 'h5',
    };

    // #ifdef APP-PLUS
    params.pageType = 'app';
    // #endif

    // #ifdef MP-ALIPAY
    params.pageType = 'alma';
    // #endif

    // #ifdef MP-WEIXIN
    params.pageType = 'wxma';
    // #endif

    const res = await getCmsInfo(params);
    if (res.success) {
      pageInfo.value = res.data?.page || {};
      pageComponents.value = res.data?.pageComponent || [];
    } else {
      uni.$u.toast(res.msg);
    }
  } catch (e) {
    // TODO handle the exception
  }
};

// 获取鉴别师
const getAppraiseUserList = async () => {
  const response = await getAppraiseUserListApi({
    size: 3,
    catId: 1000001,
  });
  if (response.success) {
    appraiseUserList.value = response.data?.items || [];
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
