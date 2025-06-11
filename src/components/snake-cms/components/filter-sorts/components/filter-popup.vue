<template>
  <view class="" @touchmove.stop.prevent="noop">
    <u-popup mode="right" :show="show" @close="$emit('colse')">
      <view class="filter-container" :style="{ paddingTop: customNavHeight + 'px' }">
        <scroll-view scroll-y class="scroll-view" :style="`height: calc(100vh - ${customNavHeight}px - 145rpx);`">
          <view class="filter-body">
            <template v-if="filter.priceList && filter.priceList.length && priceFilterShow">
              <view class="title">价格区间</view>
              <view class="price-input-box">
                <input
                  class="price-input-item"
                  placeholder="最低价"
                  v-model="priceValue.low"
                  placeholder-style="color: #B1B2C1" />
                <view class="line"></view>
                <input
                  class="price-input-item"
                  placeholder="最高价"
                  v-model="priceValue.high"
                  placeholder-style="color: #B1B2C1" />
              </view>
              <view class="select-list">
                <view
                  class="select-item"
                  v-for="(item, index) in filter.priceList"
                  :key="index"
                  :class="priceValue.low === item.low && priceValue.high === item.high ? 'active' : ''"
                  @click="selectPrice(item)">
                  {{ item.low }}{{ item.high ? `~${item.high}` : '' }}
                </view>
              </view>
            </template>
            <template v-if="filter.brandList && filter.brandList.length">
              <view class="title flex-items-center justify-between">
                <text>品牌列表</text>
                <!-- <text class="snake-gray8 text-24rpx fw-400" @click="brandStyleShow = !brandStyleShow">查看全部</text> -->
              </view>

              <view class="select-list" :style="[brandStyle]">
                <view
                  class="select-item px-12rpx"
                  :class="brandValue.includes(item.value) ? 'active' : ''"
                  v-for="(item, index) in filter.brandList"
                  :key="index"
                  @click="selectBrand(item)">
                  <text class="snake-ellipse-1">{{ item.label }}</text>
                </view>
              </view>
            </template>
          </view>
        </scroll-view>
        <!-- 底部按钮 -->
        <view class="filter-footer">
          <u-button type="primary" plain @click="resetFilter">重置</u-button>
          <u-button type="primary" customStyle="margin-left: 20rpx" @click="confirmFilter">确认</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    filter: {
      type: Object,
      default: () => {},
    },
    priceFilterShow: {
      type: Boolean,
      default: true,
    },
    customNavHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // 价格筛选
      priceValue: {
        low: '',
        high: '',
      },
      brandValue: [],
      // 品牌 是否查看全部
      brandStyleShow: false,
    };
  },
  computed: {
    // 筛选参数
    filterParams() {
      const params = {};
      params.brandFilter = this.brandValue.join(',');
      if (this.priceFilterShow) {
        params.low = this.priceValue.low || '';
        params.high = this.priceValue.high || '';
      }
      return params;
    },
    brandStyle() {
      const style = {};
      // 高度 = this.brandStyleShow ? 品牌列表长度(总数) / 每行个数(3) * (高度58 + 边距20) : 行数(7) * (高度58 + 边距20)
      // console.log(this.filters?.brandList.length);
      if (this.filter.brandList && this.filter.brandList.length > 18) {
        style.height = this.brandStyleShow ? `${(this.filter.brandList.length / 3) * 78 + 30}rpx` : `${6 * 78 - 20}rpx`;
        style.transition = 'all 0.3s';
        style.overflow = 'hidden';
      } else {
        style.height = 'auto';
      }
      return style;
    },
  },
  methods: {
    // 价格选择
    selectPrice(item) {
      if (this.priceValue.low === item.low && this.priceValue.high === item.high) {
        this.priceValue = {};
      } else {
        this.priceValue = { ...item };
      }
    },
    // 品牌选择
    selectBrand(item) {
      if (this.brandValue.includes(item.value)) {
        const i = this.brandValue.indexOf(item.value);
        this.brandValue.splice(i, 1);
      } else {
        this.brandValue.push(item.value);
      }
    },
    // 重置
    resetFilter() {
      this.priceValue = {
        low: '',
        high: '',
      };
      this.brandValue = [];
      this.confirmFilter();
    },
    // 更多筛选 确认
    confirmFilter() {
      this.$emit('confirm', this.filterParams);
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-container {
  width: 569rpx;
  height: 100%;
  // padding: 26rpx 32rpx;
  padding-top: 27rpx;
  padding-left: 32rpx;
  padding-right: 39rpx;
  background: #f6f6f6;
  box-sizing: border-box;

  .scroll-view {
    // height: calc(100vh - 145rpx);
  }
  .filter-body {
    height: 100%;

    .title {
      height: 66rpx;
      line-height: 66rpx;
      font-size: 28rpx;
      font-weight: bold;
    }

    .price-input-box {
      display: flex;
      align-items: center;
      margin-bottom: 24rpx;

      .price-input-item {
        width: 216rpx;
        height: 68rpx;
        padding: 0 12rpx;
        border: 3rpx solid #1c1c1c;
        border-radius: 4px;
        font-size: 24rpx;
        box-sizing: border-box;
      }
      .line {
        margin: 0 18rpx;
        width: 30rpx;
        height: 4rpx;
        background-color: #000;
      }
    }

    .select-list {
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;

      .select-item:nth-child(3n) {
        margin-right: 0;
      }
      .select-item {
        width: 158rpx;
        height: 60rpx;
        line-height: 60rpx;
        margin-bottom: 20rpx;
        margin-right: 12rpx;
        text-align: center;
        font-size: 24rpx;
        color: #1c1c1c;
        background: #e8e8e8;
        border-radius: 4rpx;
        box-sizing: border-box;

        &.active {
          background: #52bc7a33;
          color: #52bc7a;
          border: 1px solid #52bc7a;
        }
      }
    }
  }

  .filter-footer {
    display: flex;
    align-items: center;
    margin-top: 10rpx;
    margin-bottom: 28rpx;
  }
}

::v-deep .u-button {
  width: 240rpx !important;
  height: 80rpx !important;
  padding: 0 !important;
  border-radius: 4rpx !important;
  box-sizing: border-box;
}
</style>
