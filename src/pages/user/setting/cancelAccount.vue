<template>
  <view class="pt-20rpx px-24rpx">
    <view class="text-26rpx mt-24rpx fw-300">
      <view class="text-44rpx snake-font-medium text-center">SNAKE鉴定平台用户注销规则</view>

      <view class="mt-24rpx">
        SNAKE鉴别提醒您，账户一旦注销，您在平台所有的权益(包括不限于优惠券,售后服务等)都将一并失效。如您执意放弃账户，
        <text class="fw-700">需同时满足以下条件：</text>
      </view>

      <view class="mt-26rpx">
        1、您的SNAKE鉴别账户上无未完结的订单
        <text class="fw-700">(鉴别已完成、鉴别扣已发货)</text>
        <br />
        <text>如您需要注销账户，则相关信息会被删除，后续无法使用该账户交易；</text>
      </view>

      <view class="mt-34rpx">
        2、您的账户没有未解决的纠纷记录，纠纷记录包括但不限于投诉举报或被投诉举报至平台或工商、税务、消协等行政主
        管部门，您与交易相对方或平台间存在司法纠纷等；
      </view>
    </view>

    <view class="text-26rpx mt-48rpx fw-300">
      <view class="text-44rpx snake-font-medium text-center">温馨提示</view>
      <ul class="mt-26rpx p-0 px-24rpx">
        <li>SNAKE鉴别/第二回合APP账户不满足任意一项或多项条件的，账户将无法注销,请等待上述情况消失后再提交账户注销申请；</li>
        <li class="mt-16rpx">
          符合注销条件的，您的账户将在15个工作日内完成注销。如
          注销过程中有疑问或不能成功注销可通过在线客服或电话客服(电话号码:【0571-22931251】)来进行协助处理；
        </li>
        <li class="mt-16rpx">同一手机号注销后再次注册，非平台新用户身份，不享受新用户所享的权益和优惠;</li>
      </ul>
    </view>

    <view class="snake-fixed-bottom flex-justify-center flex-col">
      <view class="py-12rpx px-24rpx">
        <view class="text-24rpx" @click="agreeChecked = !agreeChecked">
          <text v-if="agreeChecked" class="next-icons icon-selected snake-green mr-10rpx"></text>
          <text v-else class="next-icons icon-notselected snake-gray8 mr-10rpx"></text>
          <text class="snake-gray8">我已阅读并同意以上内容</text>
        </view>
        <view class="pt-16rpx">
          <u-button type="primary" @click="cancelAccountHandel">申请注销</u-button>
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
    uni.$u.toast('请阅读并同意须知');
    return;
  }
  uni.showModal({
    title: '注销账户',
    content: '您确定要注销账号吗？',
    success: async (res) => {
      if (res.confirm) {
        console.log('用户点击确定');
        const respones = await postDestroy();
        if (respones.success) {
          uni.$u.toast('注销成功');
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
