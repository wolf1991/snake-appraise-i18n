<template>
  <view class="p-20rpx">
    <view class="flex-items-center">
      <text class="pr-10rpx">开发域名</text>
      <u-input v-model="baseUrl" placeholder="请输入开发域名"></u-input>
      <u-button
        type="primary"
        color="#007aff"
        custom-style="width: 120rpx; height: 74rpx; margin-left: 10rpx;"
        @click="setBaseUrl">
        保存
      </u-button>
    </view>

    <view class="flex-items-center mt-20rpx">
      <text class="pr-10rpx">页面路径</text>
      <u-textarea v-model="pageUrl" placeholder="请输入页面路径"></u-textarea>
    </view>
    <view class="flex-items-center mt-20rpx">
      <u-button type="primary" plain color="#007aff" custom-style="height: 74rpx; margin-left: 10rpx;" @click="openSelectRoute">
        选择
      </u-button>
      <u-button type="primary" color="#007aff" custom-style="height: 74rpx; margin-left: 10rpx;" @click="$u.navTo(pageUrl)">
        跳转
      </u-button>
    </view>

    <u-picker
      :show="routeShow"
      :columns="routeColumns"
      keyName="name"
      @confirm="routeConfirm"
      @cancel="routeShow = false"></u-picker>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores';

import { getBaseUrl, setConfig } from '@/utils/request/util';
import { getAllPages } from '@/utils';

const $u = uni.$u;

const userStore = useUserStore();

const baseUrl = ref(getBaseUrl());

const pageUrl = ref('');

const routeShow = ref(false);
const routeColumns = ref([]);

const setBaseUrl = async () => {
  // 设置环境地址
  uni.setStorageSync('BASE_URL', baseUrl.value);
  setConfig();

  // #ifdef H5
  uni.$u.toast('切换成功2秒后重启', 3000);
  await uni.$u.sleep(2000);
  location.reload();
  // #endif

  // #ifdef APP-PLUS
  uni.$u.toast('切换成功2秒后重启', 3000);
  await uni.$u.sleep(2000);
  plus.runtime.restart();
  // #endif

  // #ifdef MP-WEIXIN
  uni.$u.toast('切换成功2秒后重启', 3000);
  await uni.$u.sleep(2000);
  wx.restartMiniProgram({
    path: '/pages/tabbar/main',
  });
  // #endif

  // #ifdef MP-ALIPAY
  uni.$u.toast('切换成功', 3000);
  uni.showModal({
    title: '确认重启',
    content: '确定要重启小程序吗？',
    success: (res) => {
      if (res.confirm) {
        my.restartMiniProgram({
          path: '/pages/tabbar/main',
          fail: () => {
            uni.reLaunch({
              url: '/pages/tabbar/main',
            });
          },
        });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
  // #endif
};

const openSelectRoute = () => {
  const blackList = ['/pages/user/devConfig'];

  const routes = getAllPages('')
    .map((item) => {
      return {
        name: item.style.navigationBarTitleText,
        path: item.path,
      };
    })
    .filter((item) => !blackList.includes(item.path));
  routeColumns.value = [routes];

  routeShow.value = true;
};

const routeConfirm = (e) => {
  pageUrl.value = e.value[0].path + '?=';
  routeShow.value = false;
};
</script>

<style lang="scss" scoped></style>
