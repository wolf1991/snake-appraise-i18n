<template>
  <view class="graphicnavigation" v-if="datas.imageList.length">
    <!-- 固定列表 -->
    <block v-if="datas.imgStyle === 0">
      <view
        class="defaultNavigation"
        :style="{ padding: `0 ${datas.pageMargin}rpx`, backgroundColor: datas.backgroundColor, flexWrap: 'wrap' }">
        <view
          class="navigationList__item"
          v-for="(item, index) in datas.imageList"
          :key="index"
          :style="{ padding: datas.imgMargin + 'rpx', width: 100 / datas.showSize + '%' }"
          @click="navTo(item.url)">
          <image
            class="image-warp"
            :src="item.src"
            :style="{ borderRadius: $u.pxTorpx(datas.borderRadius) }"
            mode="widthFix"
            v-if="datas.navigationType === 0"></image>
          <text class="text" :style="[textStyle]" v-if="item.text">{{ item.text }}</text>
        </view>
      </view>
    </block>
    <!-- 横向滑动列表 -->
    <block v-if="datas.imgStyle === 1">
      <view
        class="scrollList-box"
        :style="{
          padding: `0 ${datas.pageMargin}rpx`,
          backgroundColor: datas.backgroundColor,
        }">
        <u-scroll-list
          :indicatorWidth="50"
          :indicatorBarWidth="25"
          :indicator="datas.showSlider && datas.imageList.length > datas.showSize"
          indicatorColor="#cccccc"
          indicatorActiveColor="#404155">
          <view class="scroll-list">
            <view class="scroll-list__line" v-for="(scrollItem, scrollIndex) in scrollList" :key="scrollIndex">
              <view
                class="scroll-list__line__item"
                v-for="(item, index) in scrollItem.data"
                :key="index"
                :class="[index === item.length - 1 && 'scroll-list__line__item--no-margin-right']"
                :style="{
                  minWidth: 100 / datas.showSize + '%',
                }">
                <image class="scroll-list__line__item__image" :src="item.src" mode="widthFix"></image>
                <text class="scroll-list__line__item__text">{{ item.text }}</text>
              </view>
            </view>
          </view>
        </u-scroll-list>
      </view>
    </block>
  </view>
</template>

<script>
export default {
  name: 'graphicnavigation',
  props: { datas: Object },
  data() {
    return {};
  },
  computed: {
    // 文字样式
    textStyle() {
      const style = {};
      style.color = this.datas.textColor;
      style.fontSize = this.$u.pxTorpx(this.datas.textSize);
      style.height = `${this.datas.textHeight}rpx`;
      style.lineHeight = `${this.datas.textHeight}rpx`;
      style.padding = '10rpx 0';
      return style;
    },
    // 横向滑动列表
    scrollList() {
      // 拷贝原数组 防止splice方法影响了原数组
      const copyList = [...this.datas.imageList];
      const list = [];
      if (this.datas.imageList.length <= 5) {
        list.push({ data: this.datas.imageList });
      } else {
        // 数组长度大于等于20平等分3份，否则分成两份
        const row = 2;
        // if (this.datas.imageList.length >= 20) {
        // 	row = 3
        // }
        const middleIndex = Math.ceil(this.datas.imageList.length / row);
        list.push({ data: copyList.splice(0, middleIndex) });
        list.push({ data: copyList.splice(-middleIndex) });
        // if (row == 3) {
        // 	list.push({ data: copyList })
        // }
      }
      return list;
    },
  },
};
</script>

<style scoped lang="scss">
.graphicnavigation {
  width: 100%;

  .defaultNavigation {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
  }

  .navigationList__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    .image-warp {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    p {
      font-size: 12px;
      margin: 5px 0;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      box-sizing: border-box;
    }
  }
}

// 横向滑动列表
.scrollList-box {
  width: 100%;
  box-sizing: border-box;
}

.scroll-list {
  width: 100%;
  display: flex;
  flex-direction: column;

  &__line {
    display: flex;
    margin-top: 10px;

    &__item {
      text-align: center;
      // display: flex;
      // align-items: center;
      // flex-direction: column;
      // margin-right: 15px;

      &__image {
        width: 61px;
        height: 48px;
      }

      &__text {
        // margin-top: 5px;
        color: #666666;
        font-size: 12px;
        // text-align: center;
        display: flex;
        justify-content: center;
      }

      &--no-margin-right {
        margin-right: 0;
      }
    }
  }
}
</style>
