<template>
  <!-- 外层添加高度 防止高度塌陷 -->
  <view :style="{ height: height }">
    <view :class="{ 'search-fixed': datas.position === 1 }">
      <!-- 搜索 -->
      <view class="search" :style="{ background: datas.backgroundColor, padding: `${datas.pageMargin}rpx` }">
        <!-- 搜索框 -->
        <view
          class="center"
          :style="{
            height: datas.heights + 'rpx',
            background: datas.borderBgColor,
            borderRadius: datas.borderRadius + 'rpx',
            border: datas.showBorder ? `${datas.borderSize}rpx solid ${datas.borderColor}` : 'none',
          }">
          <view class="search-left">
            <u-icon name="search" size="44rpx" :color="datas.textColor"></u-icon>
            <!-- 占位符 -->
            <view v-if="!datas.textList.length" class="input-search" @click="toPage(datas.url)">
              <input
                v-if="datas.isSearch"
                class="input"
                :type="datas.inputType"
                :disabled="!datas.isSearch"
                :placeholder="datas.searchText"
                @confirm="confirm" />
              <text class="text" v-else :style="{ color: datas.textColor }">{{ datas.searchText }}</text>
            </view>
            <!-- 热词竖向滚动 -->
            <view :style="{ width: hotordsWidth + 'px' }" v-else>
              <u-notice-bar
                :datas="datas"
                direction="column"
                :icon="null"
                :text="hotordsList"
                :bgColor="datas.borderBgColor"
                :color="datas.textColor"
                :duration="3000"
                :customStyle="{ padding: '9rpx 12rpx' }"
                @click="hotordsClick"></u-notice-bar>
            </view>
          </view>
          <view class="search-right" :style="{ paddingRight: datas.rightImage.marginRight + 'rpx' }" v-if="datas.rightImage.show">
            <image
              class="search-right-image"
              :src="datas.rightImage.src"
              :style="{
                borderRadius: datas.rightImage.borderRadius + 'rpx',
                width: datas.rightImage.width + 'rpx',
                height: datas.rightImage.height + 'rpx',
              }" />
          </view>
        </view>
        <!-- 右侧icon图片 最多两个 -->
        <template v-if="datas.iconImgList.length !== 0">
          <view :id="item.id" class="right" v-for="(item, index) in datas.iconImgList" :key="index" @click="$u.navTo(item.url)">
            <image class="right-image" :src="item.src" :style="{ width: item.width + 'rpx', height: item.height + 'rpx' }" />
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'commoditysearch',
  props: { datas: Object },
  data() {
    return {
      hotordsWidth: 0, // 热词滚动的宽度
      height: 0, // 容器高度
    };
  },
  computed: {
    // 热词列表
    hotordsList() {
      let list = [];
      if (this.datas.textList.length) {
        list = this.datas.textList.map((item) => item.text);
      }
      return list;
    },
  },
  async mounted() {
    if (this.datas.position === 1) {
      // 组件吸顶 获取占位的高度
      this.$uGetRect('.search-fixed').then((size) => {
        this.height = `${size.height}px`;
      });
    } else {
      this.height = 'auto';
    }
    // 获取搜索框的占位文本，用于热词滚动的宽度
    this.hotordsWidth = (await this.$uGetRect('.search-left')).width;
    if (this.datas.rightImage.show) {
      this.hotordsWidth -= (await this.$uGetRect('.search-right')).width;
    }
  },
  methods: {
    // 点击热词跳转
    hotordsClick(index) {
      uni.$u.navTo(this.datas.textList[index].url);
    },
    toPage() {
      // 如果可以回车搜索 则不能跳转
      if (this.datas.isSearch) {
        return false;
      }
      uni.$u.navTo(this.datas.url);
    },
    confirm(e) {
      if (!this.datas.url) {
        return this.$u.toast('跳转路径不存在');
      }
      uni.$u.navTo(this.datas.url + e.detail.value);
    },
  },
};
</script>

<style scoped lang="scss">
.search-fixed {
  width: 100%;
  position: fixed;
  /* #ifndef MP-WEIXIN */
  top: 0;
  /* #endif */
  /* #ifdef H5 */
  top: 44px;
  /* #endif */
  left: 50%;
  transform: translateX(-50%);
  z-index: 9;
  box-sizing: border-box;
}

.search {
  display: flex;
  align-items: center;
  flex: 1;

  /* 搜索框 */
  .center {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 24rpx;
    padding-left: 20rpx;
    overflow: hidden;

    .search-left {
      display: flex;
      align-items: center;
      flex: 1;

      text:nth-child(2) {
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //用省略号显示
        white-space: nowrap; //不换行
        font-size: 24rpx;
        padding-left: 5rpx;
        width: 100%;
      }

      .input-search {
        width: 100%;
        padding-left: 10rpx;

        .input {
          font-size: 24rpx;
          width: 100%;
        }
        .text {
          font-size: 26rpx;
        }
      }
    }

    .search-right {
      display: flex;
      justify-content: center;
      align-items: center;

      .search-right-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;

    .right-image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
