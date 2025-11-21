<template>
  <view class="pt-20rpx px-24rpx">
    <view class="text-26rpx mt-24rpx fw-300">
      <view class="text-44rpx snake-font-medium text-center">{{ $t('user.cancelAccount.title') }}</view>

      <view class="mt-24rpx">
        {{ $t('user.cancelAccount.notice1') }}
        <text class="fw-700">{{ $t('user.cancelAccount.conditions') }}</text>
      </view>

      <view class="mt-26rpx">
        {{ $t('user.cancelAccount.condition1') }}
        <text class="fw-700">({{ $t('user.cancelAccount.condition1Note') }})</text>
        <br />
        <text>{{ $t('user.cancelAccount.condition1Desc') }}</text>
      </view>

      <view class="mt-34rpx">
        {{ $t('user.cancelAccount.condition2') }}
      </view>
    </view>

    <view class="text-26rpx mt-48rpx fw-300">
      <view class="text-44rpx snake-font-medium text-center">{{ $t('user.cancelAccount.tipsTitle') }}</view>
      <ul class="mt-26rpx p-0 px-24rpx">
        <li>{{ $t('user.cancelAccount.tip1') }}</li>
        <li class="mt-16rpx">
          {{ $t('user.cancelAccount.tip2') }}
        </li>
        <li class="mt-16rpx">{{ $t('user.cancelAccount.tip3') }}</li>
      </ul>
    </view>

    <view class="snake-fixed-bottom flex-justify-center flex-col">
      <view class="py-12rpx px-24rpx">
        <view class="text-24rpx" @click="agreeChecked = !agreeChecked">
          <text v-if="agreeChecked" class="next-icons icon-selected snake-green mr-10rpx"></text>
          <text v-else class="next-icons icon-notselected snake-gray8 mr-10rpx"></text>
          <text class="snake-gray8">{{ $t('user.cancelAccount.agreeContent') }}</text>
        </view>
        <view class="pt-16rpx">
          <u-button type="primary" @click="cancelAccountHandel">{{ $t('user.cancelAccount.applyCancel') }}</u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { postDestroy } from '@/api/user';

import { useUserStore } from '@/stores/modules/user';

const userStore = useUserStore();

const agreeChecked = ref(false);

const cancelAccountHandel = () => {
  if (!agreeChecked.value) {
    uni.$u.toast(uni.$t('user.cancelAccount.pleaseAgree'));
    return;
  }
  uni.showModal({
    title: uni.$t('user.cancelAccount.confirmTitle'),
    content: uni.$t('user.cancelAccount.confirmContent'),
    success: async (res) => {
      if (res.confirm) {
        console.log('用户点击确定');
        const respones = await postDestroy();
        if (respones.success) {
          uni.$u.toast(uni.$t('user.cancelAccount.cancelSuccess'));
          // 不需要调用退出登录接口
          userStore.clearUserInfo();
          await uni.$u.sleep(1000);
          uni.$u.navTo('/pages/tabbar/main');
        } else {
          uni.$u.toast(respones.msg);
        }
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
};
</script>

<style lang="scss" scoped></style>
