<template>
  <u-index-list
    ref="uIndexListRef"
    :sticky="false"
    :index-list="brandGroupIndexList"
    inactiveColor="#ACACB7"
    activeColor="#26273A"
    v-if="brandGroupList.length">
    <u-index-item v-for="(item, index) in brandGroupList" :key="index">
      <u-index-anchor
        :text="brandGroupIndexList[index]"
        v-if="brandGroupIndexList[index]"
        color="#26273A"
        bg-color="#F6F6F6"
        size="18"
        height="40"></u-index-anchor>
      <view
        class="text-24rpx flex-items-center justify-between"
        style="padding: 20rpx 40rpx; background: #ffffff"
        v-for="(cell, cellIndex) in item"
        :key="cellIndex"
        @click.stop="navToNext(cell)">
        <view class="flex-items-center" style="align-items: center">
          <view class="flex-items-center rounded-100rpx h-70rpx w-70rpx" style="border: 1px solid #c8c7cc">
            <image class="rounded-50% h-100% w-100rpx m-10rpx" :src="$u.imageResize(cell.image, 160)" mode="widthFix"></image>
          </view>
          <view class="pl-20rpx">{{ cell.brandName }}</view>
        </view>
      </view>
    </u-index-item>
  </u-index-list>
</template>

<script>
import { getCategoryBrandListApi } from '@/api/appraise';
export default {
  data() {
    return {
      current: 0,
      brandVals: {},
      rangeId: '',
      catId: '',
      appraiserId: '',
      appraiseCode: '',
      price: '',
    };
  },

  computed: {
    brandGroupList() {
      const data = Object.assign({}, this.brandVals || {});
      delete data.hot;
      const dataArray = Object.values(data);
      return dataArray;
    },
    brandGroupIndexList() {
      return Object.keys(this.brandVals).filter((item) => item !== 'hot');
    },
  },
  async onLoad(option) {
    this.current = Number(option?.current || 0);
    this.appraiserId = option.appraiserId || '';
    this.catId = option.cat_id || '';
    this.appraiseCode = option.appraiseCode || '';

    const pages = getCurrentPages();
    const page = pages.find((item) => item.route.includes('pages/custom/dydetail'));

    const appraiseCode = uni.getStorageSync('appraiseCode') || '';
    if (page) {
      this.appraiseCode = appraiseCode;
    } else {
      appraiseCode && uni.setStorageSync('appraiseCode', '');
    }

    this.price = option.price || '';
    this.loadData('refresh');
  },
  async onPullDownRefresh() {
    this.loadData('refresh');
    await this.$u.sleep(500);
    uni.stopPullDownRefresh();
  },
  methods: {
    async loadData(type = '') {
      if (type === 'refresh') {
        this.brandVals = {};
      }
      const params = {
        catId: this.catId,
        code: this.appraiseCode,
        price: this.price || '',
      };
      const response = await getCategoryBrandListApi(params);
      if (response.success) {
        this.brandVals = response.data || {};
      } else {
        this.$u.toast(response.msg);
      }
    },
    navToNext(item) {
      if (this.price) {
        return;
      }

      let url = `/pages/appraise/identify?item=${encodeURIComponent(JSON.stringify(item))}`;

      if (this.appraiseCode) {
        url = `${url}&appraiseCode=${this.appraiseCode}`;
      }
      if (this.appraiserId) {
        url = `${url}&appraiserId=${this.appraiserId}`;
      }
      uni.$u.navTo(url);
    },
  },
};
</script>

<style lang="scss" scoped></style>
