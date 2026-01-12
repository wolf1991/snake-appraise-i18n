<template>
  <view class="bg-white">
    <view class="flex-center flex-col py-50rpx">
      <image
        class="w-144rpx h-144rpx mb-32rpx rounded-50%"
        src="@/static/logo.png"
        style="box-shadow: 0 4px 20px 0 #a4a8b618"
        mode="widthFix"></image>
      <view class="text-32rpx mt-40rpx" v-if="version">{{ $t('common.currentVersion') }} V{{ version }}</view>
      <!-- #ifndef H5 || MP -->
      <view class="mt-16rpx" v-if="uni.getLocale() === 'zh-CN'">
        <u-button
          plain
          shape="circle"
          customStyle="width: 168rpx; color: #000; border: 2rpx solid #E7E7E7;"
          @click="checkForUpdate">
          {{ $t('common.checkUpdate') }}
        </u-button>
      </view>
      <!-- #endif -->
    </view>
    <u-cell-group :border="false">
      <u-cell
        :title="$t('common.userServiceAgreement')"
        isLink
        @click="$u.navTo(`/pages/custom/cms?pageId=${isProd ? 866 : 866}`)"></u-cell>
      <u-cell
        :title="$t('common.privacyAgreement')"
        isLink
        @click="$u.navTo(`/pages/custom/cms?pageId=${isProd ? 865 : 865}`)"></u-cell>
      <u-cell
        :title="$t('common.cancelAccount')"
        isLink
        :border="false"
        @click="$u.navTo('/pages/user/setting/cancelAccount')"></u-cell>
    </u-cell-group>
    <view class="snake-fixed-bottom px-24rpx">
      <view class="py-12rpx">
        <u-button type="primary" shape="circle" plain customStyle="height: 88rpx;" @click="logout">
          {{ $t('common.logout') }}
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { postLogout } from '@/api/user';
import { useUserStore } from '@/stores/modules/user';
import { isProd } from '@/utils/request/util';
import { usePageTitle } from '@/hooks/usePageTitle';
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
    usePageTitle('pages.settings');
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
        uni.$u.toast(uni.$t('common.logoutSuccess'));
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
            uni.$u.toast(uni.$t('app.update.noNewVersion'));
          }
        });
        updateManager.onUpdateReady(() => {
          uni.showModal({
            title: uni.$t('app.update.modalTitle'),
            content: uni.$t('app.update.modalContent'),
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
            title: uni.$t('app.update.failedTitle'),
            content: uni.$t('app.update.failedContent'),
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
