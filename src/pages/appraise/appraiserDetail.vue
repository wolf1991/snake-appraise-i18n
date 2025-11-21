<template>
  <view>
    <u-empty
      src="https://cdn.puresnake.com/joker/static/empty/noPermission.png?a=1"
      :text="$t('appraise.appraiserDetail.noPermission')"
      width="90"
      margin-top="160"
      v-if="$u.test.empty(orderInfo)"></u-empty>
    <template v-else>
      <view class="bg-white p-24rpx">
        <view style="border: 4rpx solid rgb(159, 159, 159)">
          <view class="m-20rpx flex-center flex-col pos-relative" style="border: 2rpx solid rgb(204, 204, 204)">
            <view
              class="w-468rpx py-30rpx flex-center box-border"
              style="border-bottom: 6rpx solid #eeeef6"
              v-if="orderInfo.appraiserId">
              <image class="w-80rpx h-80rpx rounded-50%" :src="orderInfo.appraiserImage" mode="aspectFill"></image>
              <text class="text-28rpx text-#999999 ml-40rpx">{{ orderInfo.appraiserName }}</text>
            </view>

            <view class="text-60rpx font-500 py-30rpx">{{ orderInfo.statusName }}</view>

            <image
              class="w-140rpx h-140rpx pos-absolute top-120rpx right-20rpx"
              :src="`https://cdn.puresnake.com/xy-web/img_appraise_order_${orderInfo.status}.png`"
              lazy-load
              mode="aspectFill"></image>

            <view class="flex-center text-30rpx mt-8rpx snake-font-medium" v-if="orderInfo.appraiseCode">
              {{ $t('appraise.order.codeDeduction') }}：{{ orderInfo.appraiseCode }}
            </view>

            <view class="py-30rpx" v-if="orderInfo.status === 'need_img' && orderInfo.extraImageRmd">
              <view class="w-468rpx" style="border-bottom: 1px solid #eeeef6; margin: 0 auto"></view>
              <view class="mt-30rpx text-24rpx text-#ff3d3d" style="overflow-wrap: break-word">
                {{ $t('appraise.check.remarkPlaceholder') }}：{{ orderInfo.extraImageRmd }}
              </view>
            </view>

            <view class="result-message" v-else-if="orderInfo.finalSuggestion">
              <view class="w-468rpx" style="border-bottom: 1px solid #eeeef6; margin: 0 auto"></view>
              <view class="mt-30rpx text-24rpx text-#ff3d3d" style="overflow-wrap: break-word">
                {{ $t('appraise.appraiserDetail.appraiserOpinion') }}：{{ orderInfo.finalSuggestion }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-20rpx px-24rpx py-20rpx bg-white">
        <view class="flex-items-center">
          <image
            class="w-80rpx h-80rpx rounded-50%"
            :src="orderInfo.userImage ? orderInfo.userImage : 'https://static.puresnake.com/imgextra/static/avatar.png'"
            mode="aspectFill"></image>
          <text class="text-28rpx text-#666666 ml-40rpx">{{ orderInfo.userName }}</text>
          <view
            class="text-24rpx py-2rpx px-6rpx rounded-4rpx ml-10rpx"
            style="border: 1px solid red"
            v-if="orderInfo.preAppraise">
            {{ $t('appraise.appraiserDetail.preAppraise') }}
          </view>
          <text class="font-500 text-28rpx text-#666666 ml-10rpx">
            | {{ $u.formatTime(orderInfo.gmtCreate, 'yyyy-mm-dd hh:MM') }}{{ $t('common.publish') }}
          </text>
        </view>
        <view class="text-#666666 font-300 text-24rpx pt-8rpx">
          <template v-if="type === 'orderHall'">
            <view class="mt-14rpx break-all">{{ $t('appraise.appraiserDetail.equipmentName') }}：{{ orderInfo.productName || $t('common.none') }}</view>
            <view class="mt-14rpx break-all">{{ $t('appraise.appraiserDetail.remark') }}：{{ orderInfo.description || $t('common.none') }}</view>
            <view class="mt-14rpx break-all">{{ $t('appraise.appraiserDetail.purchaseSource') }}：{{ orderInfo.fromOrigin || $t('common.none') }}</view>
            <view class="mt-14rpx break-all">{{ $t('appraise.appraiserDetail.releaseYear') }}：{{ orderInfo.releaseDate || $t('common.none') }}</view>
            <view class="mt-14rpx break-all">{{ $t('appraise.appraiserDetail.purchasePrice') }}：{{ orderInfo.buyPrice || $t('common.none') }}</view>
            <view class="mt-14rpx break-all">{{ $t('appraise.order.orderId') }}：{{ orderInfo.id || $t('common.none') }}</view>
          </template>
          <template v-else>
            <view class="mt-14rpx break-all">{{ $t('appraise.appraiserDetail.appraiseProduct') }}：{{ orderInfo.productName || $t('common.none') }}</view>
            <view class="mt-14rpx break-all">{{ $t('appraise.appraiserDetail.remark') }}：{{ orderInfo.description || $t('common.none') }}</view>
            <view class="mt-14rpx break-all">{{ $t('appraise.order.orderId') }}：{{ orderInfo.id || $t('common.none') }}</view>
          </template>
        </view>
      </view>

      <view class="bg-white mt-20rpx">
        <view class="w-670rpx text-center mx-auto" v-for="(item, index) in orderInfo.imageList" :key="index">
          <view class="font-500 py-30rpx">- {{ item.modelName }} -</view>
          <image
            class="w-670rpx h-670rpx"
            :src="item.image"
            mode="aspectFill"
            @tap="
              previewImage(
                orderInfo.imageList.map((e) => e.image),
                index,
              )
            "></image>
        </view>
      </view>
      <view class="mt-20rpx mb-40rpx bg-white px-24rpx py-30rpx" v-if="orderInfo.orderLogList.length">
        <view class="mt-10rpx text-26rpx font-400" v-for="log in orderInfo.orderLogList" :key="log.id">
          <view class="flex-items-center justify-between">
            <view class="inline-block">{{ log.operate }}:</view>
            <view class="">{{ $u.formatTime(log.gmtCreate, 'yyyy-mm-dd hh:MM') }}</view>
          </view>
          <view class="block mt-6rpx text-gray-5 text-24rpx" v-if="log.remark">{{ log.remark }}</view>
        </view>
      </view>

      <snake-select-picker
        :show="pickerShow"
        :columns="reasonList"
        v-model="reasonValue"
        @close="pickerShow = false"
        @confirm="selectPickerConfirm"></snake-select-picker>

      <u-modal
        :show="modalShow"
        showCancelButton
        :content="$t('app.update.noticeUpdate')"
        @confirm="modalConfirmHandle"
        @cancel="modalShow = false"></u-modal>

      <view class="h-132rpx pb-safe"></view>
      <view class="snake-fixed-bottom" v-if="orderInfo.status === 'unappraised'">
        <view class="flex-items-center py-12rpx px-24rpx">
          <u-button
            v-if="type === 'orderHall'"
            type="primary"
            :throttle-time="600"
            custom-style="height: 88rpx; border-radius: 16rpx; margin: 0"
            @click="grabOrderHandle">
            {{ $t('appraise.appraiser.grabOrderNow') }}
          </u-button>

          <template v-else>
            <u-button
              type="primary"
              color="#fff"
              plain
              :throttle-time="600"
              custom-style="height: 88rpx; border: 1px solid #000; color:#000; border-radius: 16rpx 0 0 16rpx; margin: 0"
              @click="pickerShow = true">
              {{ $t('appraise.appraiser.cancelGrabOrder') }}
            </u-button>
            <u-button
              type="primary"
              color="#000"
              :throttle-time="600"
              custom-style="height: 88rpx; border-radius: 0 16rpx 16rpx 0; margin: 0"
              @click="identifyHandle">
              {{ $t('appraise.appraiser.identifyNow') }}
            </u-button>
          </template>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import {
  getAppraiseAppraiserDoItApi,
  getAppraiseAppraiserGiveUpApi,
  getAppraiseCheckModifyApi,
  getAppraiseOrderDetailApi,
} from '@/api/appraise';

import { previewImage } from '@/utils';
import { getAppDictValue } from '@/api/user';

const $u = uni.$u;

const orderId = ref();
const orderInfo = ref(null);
const pickerShow = ref(false);
const reasonList = ref([]);
const reasonValue = ref('');
const modalShow = ref(false);
const type = ref('');
const listIndex = ref(-1);

const isReplace = ref(false);

onLoad((options) => {
  type.value = options?.type || '';
  listIndex.value = Number(options.listIndex === undefined ? -1 : options.listIndex);

  if (options.orderId) {
    orderId.value = options.orderId;
    getDetail();
    getDictValue();
  }
});

onShow(() => {
  if (isReplace.value) {
    isReplace.value = false;
    replaceDetail();
  }
});

const getDetail = async () => {
  const response = await getAppraiseOrderDetailApi({
    orderId: orderId.value,
  });
  if (response.success) {
    orderInfo.value = response.data || {};
  } else {
    uni.$u.toast(response.msg);
  }
};

const getDictValue = async () => {
  const response = await getAppDictValue({
    type: 'appraise_cancel_reason',
    value: 'reason',
  });
  if (response.success) {
    try {
      const newList = JSON.parse(response.data as string);
      reasonList.value = newList.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
    } catch (error) {
      reasonList.value = [];
    }
  } else {
    uni.$u.toast(response.msg);
  }
};

const selectPickerConfirm = async () => {
  if (!reasonValue.value) {
    uni.$u.toast(uni.$t('appraise.appraiser.pleaseSelectCancelReason'));
    return;
  }

  const response = await getAppraiseAppraiserGiveUpApi({
    id: orderId.value,
    reason: reasonValue.value,
  });
  if (response.success) {
    uni.$u.toast(response.data as string);
    uni.$u.getHistoryPage(-1)?.refreshList?.();
    await uni.$u.sleep(1000);
    pickerShow.value = false;
    uni.navigateBack();
  } else {
    uni.$u.toast(response.msg);
  }
};

const modalConfirmHandle = () => {
  getDetail();
  modalShow.value = false;
};

const identifyHandle = async () => {
  if (orderInfo.value.fromOrigin === 'tb_yj') {
    const response = await getAppraiseCheckModifyApi({
      appraiseOrderId: orderId.value,
    });
    if (response.status === 10086) {
      modalShow.value = true;
      return;
    }
  }
  const stringParams = uni.$u.queryParams({
    appraiseId: orderId.value,
    catId: orderInfo.value.catId,
    requestId: orderInfo.value.requestId,
    fromOrigin: orderInfo.value.fromOrigin,
    isAhsOrder: orderInfo.value.subOrigin === 'ahs' && orderInfo.value.storeId !== undefined,
  });
  uni.$u.navTo(`/pages/appraise/appraiseCheck${stringParams}`);
};

// 抢单按钮
const grabOrderHandle = async () => {
  const response = await getAppraiseAppraiserDoItApi({
    id: orderId.value,
  });
  if (response.success) {
    uni.$u.toast(uni.$t('appraise.appraiser.grabSuccess'));
    uni.$u.getHistoryPage(-1)?.refreshList?.();
    await uni.$u.sleep(1000);
    uni.navigateBack();
  } else {
    uni.$u.toast(response.msg);
  }
};

// 替换详情
const replaceDetail = async () => {
  let orderList = uni.$u.getHistoryPage(-1)?.orderList;

  let length = (orderList?.value?.length || 0) - 1;

  const loadingStatus = uni.$u.getHistoryPage(-1)?.loadingStatus;

  if (loadingStatus.value !== 'nomore' && listIndex.value === length) {
    await uni.$u.getHistoryPage(-1)?.getMyOrderList();
    orderList = uni.$u.getHistoryPage(-1)?.orderList.value || [];
    length = orderList.value.length - 1;
  }

  if (listIndex.value < length) {
    const index = listIndex.value + 1;
    const orderId = orderList.value?.[index]?.id;
    orderId && uni.$u.navTo(`/pages/appraise/appraiserDetail?orderId=${orderId}&listIndex=${index}`, 'redirectTo');
  } else {
    getDetail();
  }
};

defineExpose({
  isReplace,
});
</script>

<style lang="scss" scoped></style>
