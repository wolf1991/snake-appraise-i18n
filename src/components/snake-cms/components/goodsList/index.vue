<template>
  <view class="goods-list" :style="[{ padding: `15rpx ${pageMargin + imageMargin}rpx 0`, backgroundColor: bgColor }]">
    <view
      v-for="(item, index) in goodsList"
      :key="item.id"
      class="item"
      :style="[itemStyle]"
      @click="$emit('item-click', item, index)">
      <view class="card-img">
        <snake-lazy-load :image="imageFilter(item)" style="width: 100%" />
        <template v-if="listType === 'sale' || listType === 'new'">
          <view v-if="(item.channelStatus === 'off' || item.amount <= 0) && listType === 'sale'" class="mantle">
            <image class="mantle__image" src="https://cdn.puresnake.com/joker/static/daily-new-soldout.png" />
          </view>
          <view v-if="item.newestTime && item.status === 'selling'" class="dailyNew-time">{{ item.newestTime }}上新</view>
        </template>
        <template v-if="listType === 'auction'">
          <view v-if="item.channelStatus === 'off' || item.amount <= 0" class="mantle">
            <image class="mantle__image" src="https://cdn.puresnake.com/joker/static/daily-new-soldout.png" />
          </view>
          <view class="auction-tag">
            <view class="image-warp">
              <!-- 新人标签 -->
              <template v-if="item.tag">
                <image class="new-image" :src="newImage" />
                <view class="tag-text">
                  {{ item.tag.title }}
                </view>
              </template>
              <!-- 出价标签 -->
              <template v-if="item.activityInfo && item.activityInfo.attendance && attendanceShow">
                <image class="hot-image" :src="hotImage" />
                <view class="tag-text">{{ item.activityInfo.attendance }}人出价中</view>
              </template>
            </view>
          </view>
          <!-- 出价价格 -->
          <view v-if="item.activityInfo && item.activityInfo.myRank" class="auction__tips" :style="[tipsStyle(item)]">
            <text class="price">
              {{ item.activityInfo.myRank }}
            </text>
          </view>
        </template>
      </view>
      <view class="goods-content">
        <template v-if="listType === 'sale' || listType === 'new'">
          <view class="goods-name u-line-2">
            {{ item.name || item.goodsName }}
          </view>
          <view class="goods-desc">
            <view class="price">
              {{ item.price || item.discountPrice || item.jokerPrice || item.salePrice || 0 }}
            </view>
            <view v-if="item.size" class="size">
              <view class="u-line-1" style="max-width: 100rpx">
                {{ item.size }}
              </view>
              <view v-if="item.gradeName || item.grade" class="u-line-1" style="max-width: 90rpx">
                ·
                {{ item.gradeName || item.grade }}
              </view>
            </view>
            <view v-if="item.type == 'deep' && item.amount" class="stock">
              <text class="u-line-1">库存 {{ item.amount > 99 ? '99+' : item.amount }}</text>
            </view>
          </view>
          <view v-if="listType === 'sale'" class="goods-tag">
            <view v-if="item.jokerDiscount" class="item-tags" style="background: #26273a; border: none">
              <text
                style="
                  background: linear-gradient(90deg, #dabda8 0%, #eedacc 100%);
                  -webkit-background-clip: text;
                  color: transparent;
                  line-height: 30rpx;
                  font-size: 20rpx;
                ">
                {{ item.jokerDiscount || '99' }}
              </text>
            </view>
            <!-- <view v-if="item.activityInfo && item.activityInfo.activityTag" class="item-tags">
              {{ item.activityInfo.activityTag }}
            </view> -->
            <view v-if="item.savePrice" class="item-tags">省¥{{ item.savePrice }}</view>
            <view v-if="item.activityTag === 'new'" class="item-tags">新人专享</view>
            <view v-if="item.activityTag === 'discount'" class="item-tags">限时折扣</view>
            <view
              v-if="item.packTag === true"
              class="item-tags"
              style="border: 2rpx solid #2d57e7; background: #eaf1ff; color: #2d57e7">
              支持打包
            </view>
          </view>
        </template>
        <template v-if="listType === 'auction'">
          <view class="goods-tag" style="padding-bottom: 10rpx">
            <view
              v-if="item.activityInfo && item.activityInfo.endTime && isEndTime(item)"
              class="item-tags"
              style="border: 2rpx solid #f3eaff; background: #f3eaff; color: #7a3bff">
              捡漏
            </view>
          </view>

          <view class="goods-name u-line-2">
            <!-- {{ item.gradeName ? ` · ${item.gradeName}` : '' }} -->
            {{ item.size }} | {{ item.name }}
          </view>
          <view class="goods-desc" style="padding-top: 25rpx">
            <view class="goods-auction-price">
              <view class="price">
                {{ (item.activityInfo && item.activityInfo.startPrice) || 0 }}
                <text class="text">起报</text>
              </view>
              <text v-if="listType === 'offer'" class="offer__price">¥1200最高还价</text>
            </view>
            <view
              class="auction__btn"
              hover-class="u-hover-class"
              :style="[bgStyle(item)]"
              @click.stop="$emit('handlerOffer', item, index)">
              {{ item.activityInfo && item.activityInfo.myPrice ? '修改报价' : '参与报价' }}
            </view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'goods-list',
  props: {
    goodsList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: '#F6F6F6',
    },
    // 商品类型
    listType: {
      type: String,
      default() {
        return 'goods';
      },
    },
    pageMargin: {
      type: Number,
      default: 10,
    },
    imageMargin: {
      type: Number,
      default: 10,
    },
    commodityType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      newImage: 'https://cdn.puresnake.com/joker/auction/newcomer_product.png',
      hotImage: 'https://cdn.puresnake.com/joker/auction/popular_product.png',
    };
  },
  computed: {
    itemStyle() {
      const style = { width: `calc(${100 / (this.commodityType + 2)}% - ${this.imageMargin}rpx)` };
      return style;
    },
    // 报价背景颜色
    bgStyle() {
      return (item) => {
        const style = {};
        if (!item.activityInfo?.myPrice) {
          style.backgroundColor = ' #2D57E7';
          style.color = '#FFFFFF';
        }
        return style;
      };
    },
    // 出价中背景颜色
    tipsStyle() {
      return (item) => {
        const style = {};
        if (item.activityInfo?.myRank) {
          style.backgroundColor = '#E8E8E8';
          style.color = '#888891';
        }
        return style;
      };
    },
    isEndTime() {
      return (item) => {
        const currentTime = Date.now();
        const endTime = item.activityInfo?.endTime || '';
        const timeDifference = endTime - currentTime;
        const twoHoursInMilliseconds = 2 * 60 * 60 * 1000; // 2小时 单位毫秒
        return !item.activityInfo?.attendance && timeDifference <= twoHoursInMilliseconds;
      };
    },
  },
  methods: {
    imageFilter(item) {
      if (item.name && item.name.includes('潮服')) {
        return `${item.image}?x-oss-process=style/ys`;
      } else {
        return `${item.image}?x-oss-process=style/baidi`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20rpx 20rpx 0;
}

.item {
  // width: calc(50% - 10rpx);
  background: #ffffff;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
}

.card-img {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 345rpx;
  overflow: hidden;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
}

// 已售出蒙层
.mantle {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(15, 17, 19, 0.6);

  .mantle__image {
    width: 155rpx;
    height: 155rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.dailyNew-time {
  width: 362rpx;
  height: 44rpx;
  background: rgba(62, 62, 66, 0.7);
  font-family: PingFangSC-Regular;
  font-size: 24rpx;
  z-index: 1;
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

// 标签
.auction-tag {
  position: absolute;
  top: 4rpx;
  right: 16rpx;

  .image-warp {
    position: relative;

    .new-image {
      width: 158rpx;
      height: 50rpx;
    }

    .hot-image {
      width: 176rpx;
      height: 50rpx;
    }

    .tag-text {
      position: absolute;
      top: 16rpx;
      left: 60rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 20rpx;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}

.auction__tips {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 44rpx;
  line-height: 44rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 20rpx;
  color: #888891;

  .price {
    font-weight: 700;
  }

  .text {
    margin-left: 6rpx;
  }
}

.goods-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12rpx 20rpx 21rpx;
}

.goods-name {
  height: 64rpx;
  line-height: 32rpx;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 24rpx;
  color: #0f1113;
}

.goods-desc {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #1f1f27;

  .price {
    font-size: 38rpx;
    font-weight: bold;
    font-family: DIN-Bold;
    color: #26273a;

    &::before {
      content: '¥';
      font-size: 28rpx;
    }
  }

  .size,
  .stock {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 20rpx;
    color: #646471;
  }

  .goods-auction-price {
    display: flex;
    flex-direction: column;

    .price {
      font-size: 36rpx;
      font-weight: bold;
      font-family: Arial-BoldMT;
      color: #1f1f27;

      &::before {
        content: '¥';
        font-size: 24rpx;
      }
    }

    .text {
      font-size: 22rpx;
      font-weight: 300;
      font-family: PingFangSC-Light;
      color: #646471;
      margin-left: 2rpx;
    }

    .offer__price {
      color: rgba(100, 100, 113, 1);
      font-size: 24rpx;
      font-face: PingFangSC;
      font-weight: 400;
    }
  }
}

.auction__btn {
  width: 128rpx;
  height: 44rpx;
  line-height: 44rpx;
  border: 2rpx solid #2d57e7;
  border-radius: 2rpx;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  font-size: 26rpx;
  color: #2d57e7;
  text-align: center;
}

.goods-tag {
  display: flex;
  align-items: center;
  margin-top: 8rpx;

  .item-tags {
    height: 32rpx;
    padding: 0 8rpx;
    white-space: nowrap;
    font-size: 20rpx;
    color: #fd5b5b;
    background: transparent;
    border: 2rpx solid #fd5b5b;
    border-radius: 4rpx;
    margin-right: 8rpx;
    display: flex;
    align-items: center;
  }
}
</style>
