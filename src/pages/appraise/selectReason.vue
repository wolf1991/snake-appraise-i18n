<template>
  <view>
    <view class="pb-20rpx pl-42rpx pr-20rpx bg-white">
      <block v-for="(item, index) in reasonList" :key="index">
        <view class="reason-item" @click="selsectReason(item)">
          <view class="reason-item__label">{{ item.label }}</view>
          <text v-if="item.checked" class="next-icons icon-selected reason-item__icon" style="color: #2ebd7c"></text>
          <text v-else class="next-icons icon-selected reason-item__icon"></text>
        </view>
        <view class="reason-item__textarea" v-if="item.checked && item.isOtherRemark">
          <textarea v-model="item.otherRemark" placeholder="请输入其他问题" />
        </view>
      </block>
      <u-empty :show="!reasonList.length" text="没有选项原因" margin-top="80"></u-empty>
    </view>

    <view class="h-124rpx pb-safe"></view>

    <view class="snake-fixed-bottom">
      <view class="py-12rpx px-24rpx">
        <u-button color="#000000" customStyle="border-radius: 16rpx;" @click="nextSelectImage">
          {{ status === 'fail' ? '确定' : '下一步（选部位图）' }}
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { getAppDictValue } from '@/api/user';

export default {
  data() {
    return {
      orderId: '',
      status: '',
      catId: '',
      fromOrigin: '',
      reasonList: [],
      selectedList: [],
    };
  },
  onLoad(option) {
    this.selectedList = (option?.selectedStr && option?.selectedStr.split(',')) || [];
    this.status = option?.status || '';
    this.orderId = option?.orderId || '';
    this.catId = option?.catId || '';
    this.fromOrigin = option?.fromOrigin || '';

    const list = uni.getStorageSync(`${this.status}_${this.catId}_reason_list`) || [];
    if (list.length) {
      this.reasonList = list;
    } else {
      this.getDictValue();
    }
  },
  methods: {
    // 获取原因列表
    async getDictValue() {
      uni.showLoading({
        mask: false,
        title: '加载中...',
      });

      const valueKey =
        this.fromOrigin === 'tb_yj' ? `${this.fromOrigin}_${this.status}_${this.catId}` : `${this.status}_${this.catId}`;
      // 1000001潮鞋	1000037潮服	1000300箱包	1000180首饰
      const response = await getAppDictValue({ type: 'identifier_reason', value: valueKey });
      uni.hideLoading();
      if (response.success) {
        this.reasonList = JSON.parse(response?.data || '[]');
        if (this.reasonList.length) {
          this.reasonList.forEach((item, index) => {
            this.$set(item, 'checked', false);
          });
        }
      } else {
        uni.$u.toast(response.msg);
      }
    },
    // 选择原因
    selsectReason(item) {
      // 多选
      if (this.status === 'fake') {
        item.checked = !item.checked;
      }
      // 单选
      if (this.status === 'fail') {
        this.reasonList.forEach((item, index) => {
          this.$set(item, 'checked', false);
        });
        item.checked = !item.checked;
      }
    },
    // 下一步(选部位图)
    nextSelectImage() {
      const selectedStr = this.reasonList
        .filter((item) => item.checked)
        .map((el) => (el.isOtherRemark ? el.otherRemark : el.label))
        .join(',');
      if (!selectedStr) {
        return this.$u.toast('请选择原因');
      }
      uni.setStorageSync(`${this.status}_${this.catId}_reason_list`, this.reasonList);
      const key = this.status === 'fail' ? 'oneSelectedStr' : 'manySelectedStr';
      uni.$u.getHistoryPage(-1)[key].value = selectedStr;
      if (this.status === 'fail') {
        uni.navigateBack();
        return;
      }
      uni.$u.navTo(`/pages/appraise/selectImage?orderId=${this.orderId}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.reason-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 104rpx;

  box-sizing: border-box;

  + .reason-item {
    border-top: 1px solid #eee;
  }

  &__label {
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 28rpx;
    color: #888891;
  }
  &__icon {
    font-size: 32rpx;
    color: #e8e8e8;
  }
  &__textarea {
    background-color: #f4f4f4;
    padding: 20rpx;
    box-sizing: border-box;
    height: 180rpx;
    border-radius: 4rpx;

    textarea {
      font-size: 28rpx;
    }
  }
}
</style>
