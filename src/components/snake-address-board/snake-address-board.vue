<template>
  <view
    class="address-board"
    :style="[{ borderRadius: radius, padding }, $u.addStyle(customStyle)]"
    :hover-class="isRightArrow ? 'address-board--clickable' : ''"
    :hover-stay-time="250"
    @click="isRightArrow && $emit('click')">
    <view class="address-board-left">
      <u-icon name="map" size="20" color="#000"></u-icon>
      <view class="address-board-info">
        <view v-if="!addressData.name" class="add-new-address">新增收货地址</view>
        <view class="existing-address" v-else>
          <view class="address-details">
            <text class="address-text">{{ addressData.name }}</text>
            <text class="address-text address-phone">{{ addressData.phone }}</text>
          </view>
          <view class="full-address flex-items-center">
            <text>{{ address }}</text>
          </view>
        </view>
      </view>
    </view>
    <u-icon name="arrow-right" size="16" color="#c8c9cc" v-if="isRightArrow"></u-icon>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    addressData: {
      type: Object,
      default() {
        return {};
      },
    },
    // 是否显示右箭头
    isRightArrow: {
      type: Boolean,
      default: true,
    },
    radius: {
      type: String,
      default: '8rpx',
    },
    padding: {
      type: String,
      default: '24rpx 26rpx',
    },
    customStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    address() {
      const { province = '', city = '', region = '', county = '', detail = '' } = this.addressData || {};
      return `${province}${city}${region}${county}${detail}`;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.address-board {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;

  &--clickable {
    background-color: #f3f4f6;
  }

  .address-board-left {
    display: flex;
    align-items: center;

    .address-board-info {
      margin-left: 12rpx;
    }

    .existing-address {
      display: flex;
      flex-direction: column;
      .address-details {
        display: flex;
        align-items: center;
        .address-text {
          font-family: 'PingFangSC-Medium';
          font-weight: 500;
          font-size: 28rpx;
          color: #1c1c1c;
        }
        .address-phone {
          margin-left: 10rpx;
        }
      }

      .full-address {
        margin-top: 17rpx;
        font-size: 30rpx;
        font-weight: 600;
        color: #000000;
      }
    }
  }
}
</style>
