<template>
  <view class="header-bg">
    <view class="flex-center flex-col pos-absolute top-124rpx left-50%" style="transform: translateX(-50%)" @tap="loginHandle">
      <view class="mb-28rpx rounded-50%" style="border: 2px solid #ffffff">
        <u-image
          width="150rpx"
          height="150rpx"
          :radius="100"
          :fade="false"
          :src="userInfo.logo || 'https://s.qiuxietang.com/swan-home/user/default-profile.png'"
          mode="widthFix"></u-image>
      </view>
      <view class="flex-center flex-col">
        <template v-if="isLogined">
          <!-- <view class="fw-500 mb-10rpx snake-ellipse-2">{{ userInfo.nickname || '' }}</view> -->
          <u-text color="#000" size="36rpx" format="encrypt" mode="phone" bold :text="userInfo.mobile"></u-text>
        </template>
        <template v-else>
          <text class="fs-30rpx fw-bold snake-black">登录/注册</text>
        </template>
      </view>
    </view>
  </view>
  <view class="h-200rpx"></view>

  <view class="pos-relative overflow-hidden">
    <u-cell-group :border="false">
      <block v-for="item in menuList" :key="item.value">
        <u-cell isLink :border="false" @click="clickNavTo(item.hrefUrl)">
          <template v-slot:icon>
            <view :class="[`next-icons ${item.icon} snake-fs-48`]"></view>
          </template>
          <template v-slot:title>
            <view class="fs-36rpx snake-font-din">{{ item.label }}</view>
          </template>
        </u-cell>
        <u-line customStyle="margin-left: 132rpx"></u-line>
      </block>
    </u-cell-group>
    <view class="pos-absolute left-0 bottom-80rpx w-90rpx h-90rpx" @longpress="changeBaseUrl"></view>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/modules/user';
import { getMenuListApi } from '@/api/appraise';
import config from '@/config/config';
import { isProd, getBaseUrl, setConfig } from '@/utils/request/util';
import { onLoad } from '@dcloudio/uni-app';
const userStore = useUserStore();

const { userInfo, isLogined } = storeToRefs(userStore);

const menuList = ref();

onLoad(() => {
  getMenuList();
});

const getMenuList = async () => {
  const response = await getMenuListApi();

  if (response.success) {
    const newList = response?.data || [];
    const black = ['imgEvalOrder', 'recycleOrder'];
    menuList.value = [
      ...newList.filter((item) => !black.includes(item.value)),
      {
        label: '客服中心',
        value: 'kf',
        hrefUrl: `https://m.puresnake.com/2nd/pages/custom/cms?pageId=${isProd ? 824 : 783}&isNavbar=false`,
        icon: 'icon-kf',
      },
      {
        label: '设置',
        value: 'setting',
        hrefUrl: '/pages/user/setting/index',
        icon: 'icon-setting',
      },
    ];
  } else {
    uni.$u.toast(response.msg);
  }
};

const loginHandle = () => {
  if (!isLogined.value) {
    uni.$u.navTo('/pages/login/oauth');
  }
};

const clickNavTo = (url: string) => {
  if (url) {
    uni.$u.navTo(url);
  } else {
    uni.$u.toast('功能开发中~');
  }
};

// 切换接口
const changeBaseUrl = () => {
  uni.showModal({
    title: '切换接口地址',
    content: `当前是${isProd ? '正式' : '测试'}地址：${getBaseUrl()}`,
    success: (modalRes) => {
      if (modalRes.confirm) {
        const itemList = ['获取用户信息', '开发配置', ...config.baseUrlList];

        uni.showActionSheet({
          itemList,
          success: async (sheetRes) => {
            if (sheetRes.tapIndex === -1) {
              return;
            }
            if (sheetRes.tapIndex === 0) {
              uni.showModal({
                title: '用户信息',
                content: JSON.stringify(userInfo.value),
                success: (res) => {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    uni.$u.copy(userInfo.value.openid);
                  } else if (res.cancel) {
                    console.log('用户点击取消');
                  }
                },
              });
              return;
            }

            if (sheetRes.tapIndex === 1) {
              uni.$u.navTo('/pages/user/devConfig');
              return;
            }

            const baseUrl = itemList[sheetRes.tapIndex];

            if (!baseUrl.includes('http')) {
              return;
            }

            // 设置环境地址
            uni.setStorageSync('BASE_URL', baseUrl);
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
          },
          fail(sheetErr) {
            console.log('sheetErr', sheetErr);
          },
        });
      }
    },
    fail(modalErr) {
      console.log('modalErr', modalErr);
    },
  });
};
</script>

<style>
page {
  background-color: #fff;
}
</style>

<style lang="scss" scoped>
.header-bg {
  background-image: url(https://cdn.puresnake.com/xy-web/user_bg.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  height: 204rpx;
  position: relative;
}

::v-deep .u-cell__body {
  padding: 0 !important;
  padding-left: 55rpx !important;
  padding-right: 36rpx !important;
  height: 120rpx;
  box-sizing: border-box;
}

::v-deep .u-cell__left-icon-wrap {
  margin-right: 29rpx !important;
}

.absolute-bottom {
  position: absolute;
  z-index: 2;
  left: 0;
  bottom: calc(var(--window-bottom) + 80rpx);
}
</style>
