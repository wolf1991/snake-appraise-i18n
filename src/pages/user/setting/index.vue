<template>
  <view class="bg-white">
    <view class="flex-center flex-col py-50rpx">
      <image
        class="w-144rpx h-144rpx mb-32rpx rounded-50%"
        src="@/static/logo.png"
        style="box-shadow: 0 4px 20px 0 #a4a8b618"
        mode="widthFix"></image>
      <view class="text-32rpx mt-40rpx" v-if="version">当前版本 V{{ version }}</view>
      <!-- #ifndef H5 || MP -->
      <view class="mt-16rpx">
        <u-button
          plain
          shape="circle"
          customStyle="width: 168rpx; color: #000; border: 2rpx solid #E7E7E7;"
          @click="checkForUpdate">
          检查更新
        </u-button>
      </view>
      <!-- #endif -->
    </view>
    <u-cell-group :border="false">
      <u-cell title="用户服务协议" isLink @click="$u.navTo(`/pages/custom/cms?pageId=${isProd ? 866 : 866}`)"></u-cell>
      <u-cell title="隐私协议" isLink @click="$u.navTo(`/pages/custom/cms?pageId=${isProd ? 865 : 865}`)"></u-cell>
      <u-cell title="注销账号" isLink :border="false" @click="$u.navTo('/pages/user/setting/cancelAccount')"></u-cell>
    </u-cell-group>
    <view class="snake-fixed-bottom px-24rpx">
      <view class="py-12rpx">
        <u-button type="primary" shape="circle" plain customStyle="height: 88rpx;" @click="logout">退出登录</u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { postLogout } from '@/api/user';
import { useUserStore } from '@/stores/modules/user';
import { isProd } from '@/utils/request/util';
// #ifdef APP-PLUS
import { getCurrentNo, appUpdate } from '@/utils/js/appUpdate';
// #endif
export default {
  data() {
    return {
      isProd,
      version: '',
    };
  },
  onLoad() {
    // #ifdef MP
    const accountInfo = uni.getAccountInfoSync();
    this.version = accountInfo.miniProgram.version; // 小程序 版本号
    // #endif
    // #ifdef APP-PLUS
    getCurrentNo((res) => {
      this.version = res.versionName;
    });
    // #endif
  },
  methods: {
    async logout() {
      const response = await postLogout();
      if (response.success) {
        const userStore = useUserStore();
        userStore.clearUserInfo();
        uni.$u.toast('退出登录成功');
        await uni.$u.sleep(500);
        uni.navigateBack();
      } else {
        uni.$u.toast(response.msg);
      }
    },
    // 检测是否更新
    checkForUpdate() {
      // #ifdef MP
      this.mpUpdate();
      // #endif
      // #ifdef APP-PLUS
      appUpdate(true);
      // #endif
    },
    mpUpdate() {
      // #ifdef MP
      if (uni.canIUse('getUpdateManager')) {
        // 检查小程序是否有新版本发布
        const updateManager = uni.getUpdateManager();

        // 请求完新版本信息的回调
        updateManager.onCheckForUpdate((res) => {
          // 请求完新版本信息的回调
          if (!res.hasUpdate) {
            uni.$u.toast('当前暂无新版本!');
          }
        });
        updateManager.onUpdateReady(() => {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否马上重启小程序？',
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            },
          });
        });
        updateManager.onUpdateFailed(() => {
          // 新的版本下载失败
          uni.showModal({
            title: '检测到新版本',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开',
            showCancel: false,
          });
        });
      }
      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .u-cell__body {
  padding: 28rpx 24rpx;
}
</style>
