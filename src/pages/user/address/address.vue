<template>
  <view class="p-24rpx">
    <block v-for="item in addressList" :key="item.id">
      <view class="p-24rpx mb-20rpx bg-white rounded-6rpx flex-items-center justify-between" @click="checkAddress(item)">
        <view class="flex-items-center">
          <u-image :src="`https://s.qiuxietang.com/fcwx/address.png`" :width="20" :height="20"></u-image>
          <view class="pl-20rpx">
            <view class="flex-items-center h-30rpx text-28rpx">
              <text class="snake-font-medium">{{ item.name }}</text>
              <text class="snake-font-dinmedium ml-10rpx">{{ item.phone }}</text>
              <text
                v-if="item.isDefault"
                class="flex-center py-2rpx text-22rpx ml-20rpx px-10rpx text-white bg-#06d290 rounded-4rpx">
                {{ $t('common.default') }}
              </text>
            </view>
            <view class="line-clamp-2 mt-12rpx text-24rpx text-#1c1c1c">
              {{ item.province + item.city + item.county + item.detail }}
            </view>
          </view>
        </view>
        <view class="flex-items-center">
          <view class="next-icons icon-edit text-36rpx" @click.stop.prevent="addAddressClick('edit', item)"></view>
        </view>
      </view>
    </block>

    <u-empty v-if="!addressList.length" mode="list" marginTop="120" :text="$t('common.noAddressYet')"></u-empty>

    <view class="h-120rpx pb-safe"></view>
    <view class="snake-fixed-bottom">
      <view class="py-12rpx px-24rpx">
        <u-button type="primary" customStyle="border-radius: 8rpx; height: 80rpx" @click="addAddressClick('add')">
          {{ $t('common.addAddress') }}
        </u-button>
      </view>
    </view>
  </view>
</template>
<script>
import { getAddressList } from '@/api/user';
import { usePageTitle } from '@/hooks/usePageTitle';
export default {
  data() {
    return {
      source: 0,
      addressList: [],
      editAddress: null,
    };
  },
  onLoad(options) {
    usePageTitle('pages.address');
    this.source = parseInt(options.source || 0, 10);
  },
  onShow() {
    this.getAddressList();
  },
  methods: {
    // 获取地址列表
    async getAddressList() {
      const response = await getAddressList();
      if (response.success) {
        this.addressList = response.data || [];
      } else {
        this.$u.toast(response.msg);
      }
    },
    addAddressClick(type, item = {}) {
      uni.navigateTo({
        url: `/pages/user/address/addressManage?type=${type}&addressId=${item?.id || ''}`,
      });
    },
    // 选择地址
    async checkAddress(item) {
      if (this.source === 0) {
        uni.navigateTo({
          url: `/pages/user/address/addressManage?type=edit&addressId=${item?.id || ''}`,
        });
      } else if (this.source === 1) {
        uni.showLoading();
        uni.$u.getHistoryPage(-1).addressData.value = item;
        await this.$u.sleep(200);
        uni.hideLoading();
        uni.navigateBack();
      } else {
        uni.showLoading();
        uni.$u.getHistoryPage(-1).addressData = item;
        await this.$u.sleep(200);
        uni.hideLoading();
        uni.navigateBack();
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
