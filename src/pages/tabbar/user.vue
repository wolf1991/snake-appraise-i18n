<template>
  <view class="header-bg">
    <view
      class="snake-columns snake-flex-allcenter snake-w-full snake-absolute-lt"
      style="top: 124rpx; left: 50%; transform: translateX(-50%)"
      @tap="loginHandle">
      <view style="border: 2px solid #ffffff; border-radius: 50%">
        <u-image
          width="150rpx"
          height="150rpx"
          :radius="100"
          :fade="false"
          :src="userInfo.logo || 'https://s.qiuxietang.com/swan-home/user/default-profile.png'"
          mode="widthFix"></u-image>
      </view>
      <view class="snake-columns snake-flex-allcenter snake-mt-28">
        <template v-if="isLogined">
          <!-- <view class="snake-fw-500 snake-mb-10 snake-ellipse-2">{{ userInfo.nickname || '' }}</view> -->
          <u-text color="#000" size="36rpx" format="encrypt" mode="phone" bold :text="userInfo.mobile"></u-text>
        </template>
        <template v-else>
          <text class="snake-fs-30 snake-h5 snake-bold snake-black">登录/注册</text>
        </template>
      </view>
    </view>
  </view>
  <view class="snake-h-220"></view>

  <view class="snake-relative snake-overflow-hidden">
    <u-cell-group :border="false">
      <block v-for="item in menuList" :key="item.value">
        <u-cell isLink :border="false" @click="clickNavTo(item.hrefUrl)">
          <template v-slot:icon>
            <view :class="[`next-icons ${item.icon} snake-fs-48`]"></view>
          </template>
          <template v-slot:title>
            <view class="snake-fs-36 snake-font-din">{{ item.label }}</view>
          </template>
        </u-cell>
        <u-line customStyle="margin-left: 132rpx"></u-line>
      </block>
    </u-cell-group>
    <view class="snake-absolute-lb snake-w-90 snake-h-90" style="bottom: 80rpx" @longpress="changeBaseUrl"></view>
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

// userStore.setUserInfo({
//     refreshToken: '45b2befb5cd249558a3a425aa26aafc1',
//     expire: 2592000000,
//     reg: false,
//     userId: 1345,
//     username: '17596153107',
//     mobile: '17596153107',
//     logo: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
//     nickname: '微信用户',
//     role: 'user',
//     authorityList: ['app:user'],
//     token: '42c722279b8d7914aa1a159f2b1c1e3244f',
//   });

const menuList = ref();

onLoad(() => {
  getMenuList();
});

const getMenuList = async () => {
  const response = await getMenuListApi();

  if (response.success) {
    const newList = response?.data || [];
    menuList.value = [
      ...newList,
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
        const itemList = ['获取用户信息', ...config.baseUrlList];

        // #ifdef MP-ALIPAY
        itemList.splice(1, 0, '获取订单前置信息');
        // #endif

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

            // #ifdef MP-ALIPAY
            if (sheetRes.tapIndex === 1 && itemList[sheetRes.tapIndex] === '获取订单前置信息') {
              my.checkBeforeAddOrder({
                success: ({ requireOrder, sceneId, sourceId }) => {
                  uni.showModal({
                    title: '订单前置信息',
                    content: JSON.stringify({ requireOrder, sceneId, sourceId }),
                    success: (res) => {
                      if (res.confirm) {
                        uni.$u.copy(sourceId);
                      }
                    },
                  });
                },
              });
              return;
            }
            // #endif

            const baseUrl = itemList[sheetRes.tapIndex];

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
