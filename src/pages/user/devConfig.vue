<template>
  <view class="p-20rpx text-28rpx">
    <view class="flex-items-center">
      <text class="pr-10rpx">开发域名</text>
      <u-input v-model="baseUrl" placeholder="请输入开发域名" clearable></u-input>
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
      <u-textarea v-model="pageUrl" placeholder="请输入页面路径" clearable></u-textarea>
    </view>
    <view class="flex-items-center mt-20rpx">
      <u-button
        type="primary"
        plain
        color="#007aff"
        custom-style="height: 74rpx; margin-left: 10rpx;"
        @click="openSelectRoute('pageUrl')">
        选择
      </u-button>
      <u-button type="primary" color="#007aff" custom-style="height: 74rpx; margin-left: 10rpx;" @click="$u.navTo(pageUrl)">
        跳转
      </u-button>
    </view>

    <view class="mt-20rpx">
      <view class="mb-20rpx">页面分享参数</view>
      <u-input v-model="shareParams.title" placeholder="请输入分享名称" clearable></u-input>
      <view class="mt-20rpx"></view>
      <u-input v-model="shareParams.imageUrl" placeholder="请输入图片地址" clearable></u-input>
      <view class="mt-20rpx"></view>
      <u-textarea v-model="shareParams.path" placeholder="请输入分享路径，不填默认首页" clearable></u-textarea>
    </view>
    <view class="mt-20rpx">
      <u-button type="primary" plain color="#007aff" custom-style="height: 74rpx;" @click="openSelectRoute('shareParams.path')">
        选择
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
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';

const $u = uni.$u;

const userStore = useUserStore();

const baseUrl = ref(getBaseUrl());

const pageUrl = ref('');

const routeShow = ref(false);
const routeColumns = ref([]);

const shareParams = ref({
  title: '分享标题',
  imageUrl: '',
  path: '/pages/tabbar/main',
});

const variable = ref('');

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

const openSelectRoute = (key) => {
  variable.value = key || 'pageUrl';

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
  if (variable.value === 'pageUrl') {
    pageUrl.value = e.value[0].path;
  } else {
    shareParams.value.path = e.value[0].path;
  }
  routeShow.value = false;
};

// 分享好友
onShareAppMessage((e) => {
  if (e.from === 'button') {
    // 来自页面内分享按钮
    console.log(e);
  }
  return {
    title: shareParams.value.title,
    path: shareParams.value.path,
    imageUrl: shareParams.value.imageUrl,
  };
});

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: shareParams.value.title,
    path: shareParams.value.path,
    imageUrl: shareParams.value.imageUrl,
  };
});
</script>

<style lang="scss" scoped></style>
