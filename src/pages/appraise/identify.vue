<template>
  <view class="pt-20rpx px-24rpx">
    <view
      class="bg-contain bg-no-repeat pl-24rpx py-20rpx flex rounded-4rpx"
      style="background-image: url('https://cdn.puresnake.com/xy-web/identify_top.png')"
      v-if="!$u.test.empty(brandDetail)">
      <view class="w-120rpx h-120rpx rounded-2rpx" style="border: 1px solid #e8e8e8">
        <image class="w-120rpx h-120rpx" :src="$u.imageResize(brandDetail.image, 120)" mode="aspectFit"></image>
      </view>
      <view class="pl-20rpx">
        <view class="font-bold text-28rpx">{{ brandDetail.brandName }}</view>
        <view class="text-24rpx" v-if="brandDetail.remark">{{ brandDetail.remark }}</view>
      </view>
    </view>

    <view class="bg-white mt-20rpx py-34rpx px-24rpx">
      <view class="flex-items-center justify-between pb-36rpx">
        <view class="text-32rpx font-bold">添加鉴别图片(必填)</view>
        <view class="text-24rpx text-#FE0832 flex-items-center" @click="$u.navTo(`/pages/common/cms?pageId=${cmsId || 861}`)">
          <view class="mr-2rpx">新手必看</view>
          <view class="flex-center w-24rpx h-24rpx border border-solid border-1px rounded-50%">?</view>
        </view>
      </view>

      <view class="flex flex-wrap justify-between">
        <template v-for="(model, index) in modelList" :key="index">
          <view class="w-156rpx h-156rpx mb-20rpx" v-if="model.id !== 0 || model.closeable">
            <image
              class="w-156rpx h-156rpx"
              :src="model.image"
              mode="aspectFill"
              @click="chooseImageHandle(model.id, index)"></image>
            <view v-if="model.closeable" class="close" @click="closeWindow(index)">
              <image src="/static/close.png" style="width: 20px; height: 20px" mode="aspectFill"></image>
            </view>
          </view>
        </template>
        <!-- 其他补充 -->
        <view class="w-156rpx h-156rpx mb-20rpx" @click="chooseImageHandle(0, modelList.length)">
          <image
            class="w-156rpx h-156rpx mb-20rpx"
            src="https://s.qiuxietang.com/images/202402/1212394428866498560.png"
            mode="aspectFill"></image>
        </view>
      </view>

      <view class="border-t-#e8e8e8 border-t-1px border-t-solid my-20rpx" style="box"></view>

      <view class="mt-20rpx">
        <u-textarea
          v-model="description"
          placeholder="您可以在这里介绍更多装备信息"
          count
          :maxlength="70"
          :cursorSpacing="200"
          border="none"></u-textarea>
      </view>
    </view>

    <snake-pay-select ref="paySelectRef"></snake-pay-select>

    <view class="h-190rpx pb-safe"></view>

    <view class="snake-fixed-bottom px-24rpx">
      <view class="h-60rpx line-height-60rpx text-24rpx" @click="agreement = !agreement">
        <text v-if="agreement" class="next-icons icon-selected text-#06d290"></text>
        <text v-else class="next-icons icon-notselected text-#888891"></text>
        我已阅读并同意
        <text class="text-#06d290" @click="$u.navTo('/pages/custom/cms?pageId=863')">《鉴别服务协议》</text>
      </view>
      <view class="flex-items-center justify-between pb-20rpx">
        <view class="flex-items-center">
          <text>需支付</text>
          <view class="text-34rpx font-600 color-#ff3367">
            <text>￥</text>
            <text class="text-52rpx">{{ priceParts(identifyPrice).integer }}</text>
            <text>.{{ priceParts(identifyPrice).decimal }}</text>
          </view>
        </view>

        <u-button
          customStyle="width: 286rpx; height: 90rpx; font-size: 32rpx; margin: 0"
          color="#06d290"
          :loading="payLoading"
          :throttleTime="500"
          @click="confirmIdentify">
          去鉴别
        </u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getCategoryBrandDetailApi, postAppraiseOrderApi } from '@/api/appraise';

import uploader from '@/utils/uploader/uploader';

import { useUserStore } from '@/stores/modules/user';
import { requestPayment } from '@/utils/payment';
const userStore = useUserStore();

const $u = uni.$u;

const paySelectRef = ref();

const brandDetail = ref();

const cmsId = ref();
const identifyPrice = ref();
const modelList = ref([]);
const uploadIndex = ref([]);
const description = ref('');
const appraiseCode = ref();

const agreement = ref(false);
const payLoading = ref(false);

const isClick = ref(false);

const priceParts = computed(() => {
  return (price) => {
    if (!price) {
      return {
        integer: '0',
        decimal: '00',
      };
    }
    const [integer, decimal = '00'] = price.toFixed(2).split('.');
    return { integer, decimal };
  };
});

onLoad((options) => {
  brandDetail.value = JSON.parse(decodeURIComponent(options.item));
  appraiseCode.value = options.appraiseCode;
  getBrandDetail();
});

onShow(async () => {
  if (isClick.value) {
    isClick.value = false;
    await uni.$u.sleep(1000);
    uni.$u.navTo('/pages/order/orderList');
  }
});

const getBrandDetail = async () => {
  const params = {
    categoryId: brandDetail.value.categoryId,
    brandId: brandDetail.value.brandId,
  };
  const response = await getCategoryBrandDetailApi(params);
  if (response.success) {
    modelList.value = response.data?.modelList || [];
    cmsId.value = response.data?.cmsId;
    // 有appraiseCode 金额是0
    identifyPrice.value = appraiseCode.value ? 0 : response.data?.price || 0;
  } else {
    uni.$u.toast(response.msg);
  }
};

const chooseImageHandle = (modelId, i) => {
  const uploadFunc = async (filePath) => {
    try {
      uni.showLoading({
        title: '上传中...',
        mask: true,
      });
      const result = await uploader.uploadOss(filePath);
      if (result.url) {
        uploadIndex.value.push(i);
        if (i === modelList.value.length) {
          const tempModel = {
            id: 0,
            name: '其他补充',
            image: result.url,
            closeable: true,
          };
          modelList.value.push(tempModel);
        } else {
          const tempModel = modelList.value[i];
          tempModel.image = result.url;
          modelList.value.splice(i, 1, tempModel);
        }
      }
      uni.hideLoading({ noConflict: true });
    } catch (e) {
      uni.hideLoading({ noConflict: true });
      uni.$u.toast(e?.errMsg || e?.msg || e?.message || '上传失败，请重试！');
    }
  };

  uni.chooseImage({
    count: 1, // 默认9
    sourceType: ['camera', 'album'],
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    success: (res) => {
      const imageSrc = (res.tempFiles && res.tempFiles[0].path) || res.tempFilePaths[0];
      uploadFunc(imageSrc);
    },
    fail(e) {
      console.log(e);
    },
  });
};

const closeWindow = (index) => {
  modelList.value.splice(index, 1);
  uploadIndex.value.splice(uploadIndex.value.indexOf(index), 1);
};

const preparePayment = async () => {
  // 打开支付选项弹窗 让用户选择支付方式
  const result = await paySelectRef.value.asyncOpen({
    payChannelList: [
      {
        payChannel: 'alipay',
        icon: 'icon-zhifubaoicon',
        color: '#01aaef',
        valid: true,
        payChannelName: '支付宝支付',
      },
      {
        payChannel: 'wx',
        icon: 'icon-weixinzhifu',
        color: '#36cb59',
        valid: true,
        payChannelName: '微信支付',
      },
    ],
    price: identifyPrice.value,
  });
  console.log('result', result);
  return result.payType;
};

// 支付
const confirmIdentify = async () => {
  if (!agreement.value) {
    return uni.$u.toast('请同意勾选鉴别服务协议');
  }

  // #ifdef APP-PLUS
  const payType = await preparePayment();
  if (payType === '') {
    return;
  }
  // #endif

  payLoading.value = true;

  const params = {
    // #ifdef MP-ALIPAY
    payType: 'alipay_ma',
    // #endif
    // #ifdef MP-WEIXIN
    payType: 'wx_ma',
    // #endif
    // #ifdef APP-PLUS
    payType,
    // #endif
    buyerId: userStore?.userInfo?.openid || uni.getStorageSync('__SK_OPENID'),
    categoryId: brandDetail.value.categoryId,
    brandId: brandDetail.value.brandId,
    productName: brandDetail.value.brandName,
    description: description.value || null,
    appraiseCode: appraiseCode.value || null,
    imageList: [],
  };
  const imageList = [];

  Array.from(new Set(uploadIndex.value)).forEach((val) => {
    imageList.push({
      image: modelList.value[val].image,
      modelId: modelList.value[val].id,
    });
  });

  params.imageList = imageList;

  try {
    const response = await postAppraiseOrderApi(params);
    if (response.success) {
      const { payDataType, payData, type } = response.data;

      if (appraiseCode.value) {
        uni.$u.toast('下单成功');
        appraiseCode.value && uni.setStorageSync('appraiseCode', '');
        await uni.$u.sleep(1000);
        uni.$u.navTo('/pages/order/orderList');
      } else {
        // 拉起支付
        requestPayment({
          data: {
            payData,
            type: type || params.payType, // 首单免费会有type
            payDataType,
          },
          success: async (res) => {
            appraiseCode.value && uni.setStorageSync('appraiseCode', '');
            if (res?.isClick) {
              isClick.value = res.isClick;
            } else {
              uni.$u.toast('支付成功');
              await uni.$u.sleep(1000);
              uni.$u.navTo('/pages/order/orderList');
            }
          },
          fail: async () => {
            // this.$u.toast('支付失败');
            payLoading.value = false;
            await uni.$u.sleep(1000);
            uni.$u.navTo('/pages/order/orderList');
          },
        });
      }
    }
    uni.$u.toast(response.msg);
    payLoading.value = false;
  } catch (error) {
    // TODO handle the exception
    payLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
::v-deep .u-textarea {
  border-radius: 4rpx !important;
  background: #f6f6f6 !important;
}
::v-deep .u-textarea__count {
  background: #f6f6f6 !important;
}
</style>
