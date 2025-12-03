<template>
  <view>
    <view class="bg-white px-24rpx">
      <view class="py-16rpx flex-items-center justify-between" style="border-bottom: 1px solid #eaeaeb">
        <text class="text">{{ $t('appraise.check.needSupplementImage') }}</text>
        <switch class="" color="#06D290" @change="switchChange" style="transform: scale(0.8)" />
      </view>

      <view class="status-select" style="border-bottom: 1px solid #eaeaeb" v-if="!needImgSwtich">
        <view class="text-28rpx font-600 flex-center">{{ $t('appraise.check.selectResult') }}</view>
        <view class="status-group">
          <view
            class="status"
            :class="[{ 'active active_finish': selectStatus === 'finish' }]"
            @click="setStatusHandle('finish')">
            <text>{{ $t('appraise.check.identifyTrue') }}</text>
            <view class="next-icons icon-selected"></view>
          </view>
          <view class="status" :class="[{ active: selectStatus === 'fake' }]" @click="setStatusHandle('fake')">
            <text>{{ $t('appraise.check.identifyFalse') }}</text>
            <view class="next-icons icon-selected"></view>
          </view>
          <view class="status" :class="[{ active: selectStatus === 'fail' }]" @click="setStatusHandle('fail')">
            <text>{{ $t('appraise.check.cannotIdentify') }}</text>
            <view class="next-icons icon-selected"></view>
          </view>
          <view class="status" :class="[{ active: selectStatus === 'outrange' }]" @click="setStatusHandle('outrange')">
            <text>{{ $t('appraise.check.outOfRange') }}</text>
            <view class="next-icons icon-selected"></view>
          </view>
        </view>
      </view>

      <template v-if="selectStatus == 'need_img' || selectStatus == 'finish' || selectStatus == 'outrange'">
        <view class="pt-20rpx pos-relative">
          <textarea
            class="py-24rpx px-20rpx bg-#f6f6f6 w-100% h-160rpx text-28rpx box-border"
            type="text"
            :placeholder="$t('appraise.check.suggestionPlaceholder')"
            :maxlength="80"
            v-model="suggestion"
            :disabled="needImgSwtich && fromOrigin === 'tb_yj'"
            placeholder-class="text-#999999; text-28rpx" />
          <text class="pos-absolute right-10rpx bottom-25rpx text-22rpx text-#8f8f9b" v-if="suggestion.length > 0">
            {{ suggestion.length }} / 80
          </text>
        </view>
        <view class="pt-16rpx pb-30rpx" style="border-bottom: 1px solid #eaeaeb">
          <view class="text-28rpx text-#999999">{{ $t('appraise.check.quickSuggestion') }}</view>
          <view class="flex flex-wrap items-center">
            <text
              class="p-15rpx text-28rpx rounded-8rpx mt-24rpx mr-12rpx"
              style="border: 1px solid rgb(199, 199, 204)"
              v-for="(value, index) in reasonList"
              :key="index"
              @click="suggestion = value">
              {{ value }}
            </text>
          </view>
        </view>
      </template>

      <view class="pt-30rpx pb-16rpx pos-relative">
        <textarea
          class="py-24rpx px-20rpx bg-#f6f6f6 w-100% h-160rpx text-28rpx box-border"
          :placeholder="$t('appraise.check.remarkPlaceholder')"
          :maxlength="80"
          v-model="remark"
          type="text"
          placeholder-class="text-#999999; text-28rpx" />
        <text class="pos-absolute right-10rpx bottom-25rpx text-22rpx text-#8f8f9b" v-if="remark.length > 0">
          {{ remark.length }} / 80
        </text>
      </view>
    </view>

    <u-modal
      :show="modalShow"
      showCancelButton
      :content="$t('app.update.noticeUpdate')"
      @confirm="modalConfirmHandle"
      @cancel="modalShow = false"></u-modal>

    <u-modal
      :show="checkResultShow"
      showCancelButton
      :title="$t('appraise.check.confirmResult')"
      :content="$t('appraise.check.confirmResultContent', { result: stateMap.value[selectStatus] })"
      @confirm="confirmIdentify"
      @cancel="checkResultShow = false"></u-modal>

    <view class="h-132rpx pb-safe"></view>
    <view class="snake-fixed-bottom">
      <view class="py-12rpx px-24rpx">
        <u-button
          type="primary"
          :disabled="submitDisabled"
          :loading="btnLoading"
          customStyle="border-radius: 16rpx; height: 88rpx; font-size: 28rpx"
          @click="checkResultConfirm">
          {{ $t('common.submit') }}
        </u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getAppraiseRmdReasonListApi, postAppraiserDoAppraiseApi } from '@/api/appraise';
import { Base64 } from '@/utils/js/base64';
import { usePageTitle } from '@/hooks/usePageTitle';

usePageTitle('pages.appraiseCheck');

const requestId = ref('');

const appraiseId = ref();
const catId = ref();
const fromOrigin = ref('');
const isAhsOrder = ref(false);

const selectStatus = ref('');
const needImgSwtich = ref(false);

const suggestion = ref('');
const remark = ref('');

const manySelectedStr = ref('');
const oneSelectedStr = ref('');
const hintImageList = ref([]);

const reasonList = ref([]);
const modalShow = ref(false);
const checkResultShow = ref(false);

const btnLoading = ref(false);

const stateMap = computed(() => ({
  unappraised: uni.$t('appraise.order.unappraised'),
  finish: uni.$t('appraise.check.identifyTrue'),
  fail: uni.$t('appraise.check.cannotIdentify'),
  fake: uni.$t('appraise.check.identifyFalse'),
  outrange: uni.$t('appraise.check.outOfRange'),
  need_img: uni.$t('appraise.order.need_img'),
}));

const submitDisabled = computed(() => {
  if (needImgSwtich.value) {
    return false;
  } else if (selectStatus.value) {
    return false;
  }
  return true;
});

onLoad((options) => {
  requestId.value = options?.requestId;
  appraiseId.value = options?.appraiseId;
  catId.value = options.catId;
  fromOrigin.value = options?.fromOrigin;
  isAhsOrder.value = JSON.parse(options?.isAhsOrder || 'false');
  getAppraiseFastList();
});

const switchChange = (e) => {
  needImgSwtich.value = e.detail.value;
  selectStatus.value = needImgSwtich.value ? 'need_img' : '';
};
const setStatusHandle = (status) => {
  selectStatus.value = status;
  if (status === 'fake' || status === 'fail') {
    const selectedStr = status === 'fake' ? manySelectedStr.value : oneSelectedStr.value;
    const stringParams = uni.$u.queryParams({
      status,
      selectedStr,
      orderId: appraiseId.value,
      catId: catId.value,
      fromOrigin: fromOrigin.value,
    });
    uni.$u.navTo(`/pages/appraise/selectReason${stringParams}`);
  }
};

const getAppraiseFastList = async () => {
  uni.showLoading({
    mask: true,
    title: uni.$t('common.loading'),
  });
  const response = await getAppraiseRmdReasonListApi({ id: appraiseId.value });
  uni.hideLoading();
  if (response.success) {
    reasonList.value = Object.values(response.data);
  } else {
    uni.$u.toast(response.msg);
  }
};

const modalConfirmHandle = async () => {
  uni.$u.getHistoryPage(-1)?.getDetail?.();
  await uni.$u.sleep(300);
  uni.navigateBack();
};

const checkResultConfirm = () => {
  if (isAhsOrder.value) {
    checkResultShow.value = true;
    return;
  }
  confirmIdentify();
};

const confirmIdentify = async () => {
  const en = Base64.encode(requestId.value);
  const params = {
    requestId: en,
    id: appraiseId.value,
    suggestion: suggestion.value || null,
    remark: remark.value || null,
    status: null,
    hintImageList: null,
  };

  if (['fake', 'fail'].includes(selectStatus.value)) {
    params.suggestion = selectStatus.value === 'fake' ? manySelectedStr.value : oneSelectedStr.value;
    if (!params.suggestion) {
      return uni.$u.toast(uni.$t('appraise.check.pleaseSelectReason'));
    }
    if (selectStatus.value === 'fake' && !hintImageList.value.length) {
      return uni.$u.toast(uni.$t('appraise.check.selectAtLeastOne'));
    }
    params.hintImageList = hintImageList.value;
  }

  params.status = needImgSwtich.value ? 'need_img' : selectStatus.value;

  btnLoading.value = true;

  try {
    const response = await postAppraiserDoAppraiseApi(params);
    checkResultShow.value = false;
    if (response.success) {
      uni.$u.toast(uni.$t('appraise.check.identifyComplete'));
      if (['fake', 'fail'].includes(selectStatus.value)) {
        // 清掉缓存
        uni.removeStorageSync(`fake_${catId.value}_reason_list`);
        uni.removeStorageSync(`fail_${catId.value}_reason_list`);
      }
      uni.removeStorageSync('image_select_list');
      uni.$u.getHistoryPage(-1).isReplace.value = true;
      await uni.$u.sleep(1000);
      btnLoading.value = false;
      uni.navigateBack();
    } else if (response.status === 10086) {
      modalShow.value = true;
    } else {
      uni.$u.toast(response.msg);
      btnLoading.value = false;
    }
  } catch (error) {
    // TODO handle the exception
    btnLoading.value = false;
    checkResultShow.value = false;
  }
};

defineExpose({
  oneSelectedStr,
  manySelectedStr,
  hintImageList,
});
</script>

<style lang="scss" scoped>
.status-select {
  padding: 16px 0;
  border-bottom: 1px #f5f5f9 solid;

  .status-group {
    margin-top: 40rpx;

    .status {
      width: 100%;
      height: 96rpx;
      font-size: 32rpx;
      padding: 0 20rpx;
      color: #888891;
      background: #f6f6f6;
      border-radius: 4rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;

      + .status {
        margin-top: 10rpx;
      }

      text {
        font-family: PingFangSC-Medium;
        font-weight: 600;
      }

      &.active_finish {
        color: #06d290 !important;
        background: #06d2901a !important;
        border: 1px solid #06d290 !important;
      }

      &.active {
        color: #ff525d;
        background: #ff525d1a;
        border: 1px solid #ff525d;
      }
    }
  }
}
</style>
