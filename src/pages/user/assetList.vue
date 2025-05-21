<template>
  <view>
    <view class="snake-px-24 snake-mt-12">
      <view class="snake-px-30 snake-bg-white">
        <view class="snake-title snake-border-b">
          <text class="snake-h4">资金明细</text>
          <text class="snake-border-b"></text>
        </view>
      </view>
      <view class="snake-list snake-bg-white">
        <view class="snake-list-items" v-for="(item, index) in assetList" :key="index">
          <view class="snake-list-body" style="margin-right: 20rpx">
            <view class="snake-list-title">
              <text class="snake-list-title-text">{{ item.name }}</text>
              <text class="snake-list-title-desc snake-bold snake-red">{{ item.amount || 0 }}</text>
            </view>
            <view class="snake-list-title">
              <text class="snake-list-body-desc">{{ $u.formatTime(item.gmtCreate) }}</text>
              <text class="snake-list-title-desc snake-ellipse-1" style="max-width: 400rpx">{{ item.remark }}</text>
            </view>
          </view>
        </view>
        <u-empty
          v-if="!assetList.length"
          customStyle="padding: 120rpx 0 20rpx;"
          textColor="#ACACB7"
          src="https://cdn.puresnake.com/joker/static/empty-balance.png"
          text="暂无资金明细"></u-empty>
      </view>
    </view>
  </view>
</template>
<script>
import { getAssetCardList } from '@/api/recycle';
export default {
  data() {
    return {
      assetList: [],
    };
  },
  onLoad() {
    this.getAssetList();
  },
  methods: {
    // 余额列表
    async getAssetList() {
      const response = await getAssetCardList();
      if (response.success) {
        this.assetList = response.data || [];
      }
    },
  },
};
</script>
<style></style>
