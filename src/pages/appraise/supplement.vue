<template>
  <view class="bg-white pb-24rpx" v-if="!$u.test.empty(orderInfo)">
    <view class="px-40rpx">
      <view class="flex-center pt-44rpx pb-20rpx" style="border-bottom: 1px dashed #e6e7ea">
        <image
          class="w-50rpx h-50rpx rounded-50%"
          style="border: 1px solid rgba(209, 209, 209, 1)"
          :src="orderInfo.appraiserImage"></image>
        <text class="text-28rpx ml-16rpx">{{ orderInfo.appraiserName }}</text>
      </view>
      <view class="text-center py-60rpx">
        <view class="text-56rpx font-600">{{ $t('appraise.order.need_img') }}</view>
        <view class="mt-12rpx text-26rpx" v-if="orderInfo.status === 'need_img' && orderInfo.extraImageRmd">
          {{ $t('appraise.check.remarkPlaceholder') }}：{{ orderInfo.extraImageRmd }}
        </view>
      </view>
    </view>
    <view class="px-24rpx">
      <block v-for="(image, index) in imageList" :key="index">
        <view class="pos-relative my-40rpx" @click="previewImage(imageList, index)">
          <image class="w-702rpx h-702rpx" :src="$u.imageResize(image, 702)" mode="aspectFill"></image>
          <view class="pos-absolute top-[-18rpx] right-[-18rpx]" @click.stop="clearImage(index)">
            <u-icon size="44rpx" name="close" />
          </view>
        </view>
      </block>
      <view class="flex-center h-88rpx" style="border: 1px solid rgba(246, 242, 242, 1)" @click="chooseImage()">
        <image
          class="w-80rpx h-80rpx"
          src="https://s.qiuxietang.com/imgextra/appraise/template/other.png"
          mode="aspectFit"></image>
        <text class="text-#ff3367 text-28rpx">{{ $t('common.addImage') }}</text>
      </view>
    </view>
    <view class="h-104rpx pb-safe"></view>
    <view class="snake-fixed-bottom">
      <view class="px-24rpx py-12rpx">
        <u-button type="primary" :throttle-time="600" @click="saveSupplement">{{ $t('common.publish') }}</u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getAppraiseOrderDetailApi, postMoreImageApi } from '@/api/appraise';
import useUpload from '@/hooks/useUpload';
import { previewImage } from '@/utils';

const $u = uni.$u;

const orderId = ref();
const orderInfo = ref(null);

const imageList = ref([]);

const { data, run: chooseImage } = useUpload();

watchEffect(() => {
  if (data.value) {
    imageList.value.push(data.value);
  }
});

onLoad((options) => {
  if (options.orderId) {
    orderId.value = options.orderId;
    getDetail();
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

const clearImage = (index: number) => {
  imageList.value.splice(index, 1);
};

const saveSupplement = async () => {
  if (!imageList.value.length) {
    uni.$u.toast(uni.$t('appraise.supplement.minOneImage'));
    return;
  }
    uni.showLoading({
      title: uni.$t('appraise.supplement.uploading'),
      mask: true,
    });
  const response = await postMoreImageApi({
    imageList: imageList.value,
    orderId: orderId.value,
  });
  uni.hideLoading();
  if (response.success) {
    uni.$u.toast(uni.$t('appraise.supplement.complete'));
    await uni.$u.sleep(1000);
    uni.navigateBack();
  } else {
    uni.$u.toast(response?.msg || uni.$t('appraise.supplement.failed'));
  }
};
</script>

<style lang="scss" scoped></style>
