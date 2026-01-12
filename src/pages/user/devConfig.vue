<template>
  <view class="p-20rpx text-28rpx">
    <view class="flex-items-center">
      <text class="pr-10rpx">{{ $t('common.devDomain') }}</text>
      <u-input v-model="baseUrl" :placeholder="$t('common.enterDevDomain')" clearable></u-input>
      <u-button
        type="primary"
        color="#007aff"
        custom-style="width: 120rpx; height: 74rpx; margin-left: 10rpx;"
        @click="setBaseUrl">
        {{ $t('common.save') }}
      </u-button>
    </view>

    <view class="flex-items-center mt-20rpx">
      <text class="pr-10rpx">{{ $t('common.pagePath') }}</text>
      <u-textarea v-model="pageUrl" :placeholder="$t('common.enterPagePath')" clearable></u-textarea>
    </view>
    <view class="flex-items-center mt-20rpx">
      <u-button
        type="primary"
        plain
        color="#007aff"
        custom-style="height: 74rpx; margin-left: 10rpx;"
        @click="openSelectRoute('pageUrl')">
        {{ $t('common.pleaseSelect') }}
      </u-button>
      <u-button type="primary" color="#007aff" custom-style="height: 74rpx; margin-left: 10rpx;" @click="$u.navTo(pageUrl)">
        {{ $t('common.jump') }}
      </u-button>
    </view>

    <view class="mt-20rpx">
      <view class="mb-20rpx">{{ $t('common.shareParams') }}</view>
      <u-input v-model="shareParams.title" :placeholder="$t('common.enterShareName')" clearable></u-input>
      <view class="mt-20rpx"></view>
      <u-input v-model="shareParams.imageUrl" :placeholder="$t('common.enterImageUrl')" clearable></u-input>
      <view class="mt-20rpx"></view>
      <u-textarea v-model="shareParams.path" :placeholder="$t('common.enterSharePath')" clearable></u-textarea>
    </view>
    <view class="mt-20rpx">
      <u-button type="primary" plain color="#007aff" custom-style="height: 74rpx;" @click="openSelectRoute('shareParams.path')">
        {{ $t('common.pleaseSelect') }}
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
import { usePageTitle } from '@/hooks/usePageTitle';

usePageTitle('pages.devConfig');

const $u = uni.$u;

const userStore = useUserStore();

const baseUrl = ref(getBaseUrl());

const pageUrl = ref('');

const routeShow = ref(false);
const routeColumns = ref([]);

const shareParams = ref({
  title: uni.$t('common.shareTitle'),
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
