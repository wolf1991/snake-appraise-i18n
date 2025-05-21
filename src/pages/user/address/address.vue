<template>
  <view class="snake-p-24">
    <block v-for="item in addressList" :key="item.id">
      <view class="address-item snake-space-between snake-flex-vcenter" @click="checkAddress(item)">
        <view class="snake-flex-vcenter">
          <view class="snake-mr-20">
            <u-image :src="`https://s.qiuxietang.com/fcwx/address.png`" :width="20" :height="20"></u-image>
          </view>
          <view>
            <view class="snake-flex-vcenter" style="height: 30rpx">
              <text class="snake-font-medium snake-fs-28">{{ item.name }}</text>
              <text class="snake-font-dinmedium snake-fs-28 snake-ml-10">{{ item.phone }}</text>
              <text
                v-if="item.isDefault"
                class="snake-flex-allcenter snake-py-5 snake-px-6 snake-fs-20 snake-ml-20 snake-rd-8 snake-bg-green">
                默认
              </text>
            </view>
            <view
              class="address-detail snake-mt-12 snake-fs-24"
              style="line-height: 32rpx; word-break: break-all; color: #1c1c1c">
              {{ item.province + item.city + item.county + item.detail }}
            </view>
          </view>
        </view>
        <view class="snake-pl-40 snake-flex-vcenter solid" style="height: 60rpx">
          <view class="next-icons icon-edit snake-fs-36" @click.stop.prevent="addAddressClick('edit', item)"></view>
        </view>
      </view>
    </block>

    <u-empty v-if="!addressList.length" mode="list" marginTop="120" text="您还没有添加收货地址"></u-empty>

    <view class="snake-h-120 u-safe-area-inset-bottom"></view>
    <view class="snake-fixed-bottom">
      <view class="snake-py-12 snake-px-24">
        <u-button type="primary" customStyle="border-radius: 8rpx; height: 80rpx" @click="addAddressClick('add')">
          新增收货地址
        </u-button>
      </view>
    </view>
  </view>
</template>
<script>
import { getAddressList } from '@/api/user';
import { postOrderAddressUpdate } from '@/api/order';
export default {
  data() {
    return {
      source: 0,
      addressList: [],
      editAddress: null,
    };
  },
  onLoad(option) {
    this.source = parseInt(option.source || 0, 10);
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
      if (this.source === 1) {
        uni.showLoading();
        uni.$u.getHistoryPage(-1).addressData = item;
        await this.$u.sleep(200);
        uni.hideLoading();
        uni.navigateBack();
      } else if (this.source === 2) {
        this.$u.getHistoryPage(-1).addressData = item;
        // 修改地址
        await this.updateOrderAdress(item);
      }
    },
    async updateOrderAdress(addressData) {
      uni.showLoading();
      const response = await postOrderAddressUpdate({
        orderId: this.$u.getHistoryPage(-1).orderId,
        ...addressData,
      });
      if (response.success) {
        this.$u.toast(response.data || '修改成功');
        await this.$u.sleep(200);
        uni.hideLoading();
        uni.navigateBack();
      } else {
        uni.$u.toast(response.msg);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.address-item {
  padding: 24rpx;
  margin-bottom: 20rpx;
  border-radius: 4rpx;
  background-color: #fff;

  &:last-child {
    margin-bottom: unset;
  }
}

.snake-border-radius {
  border-radius: 100rpx !important;
}

.address-detail {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.solid {
  border-left: 1px solid #f8f8f8;
  margin: 30rpx 0 30rpx;
}
</style>
