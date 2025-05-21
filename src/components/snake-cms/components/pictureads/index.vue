<template>
  <view class="pictureads" :style="{ backgroundColor: datas.backgroundColor }">
    <view v-if="!datas.imageList.length" class="upload">暂无图片</view>
    <!-- 一行一个 -->
    <view
      v-if="datas.imageList.length && datas.swiperType === 0"
      class="swiperType0"
      :style="{ padding: `0 ${datas.pageMargin}rpx` }">
      <view
        v-for="(item, index) in datas.imageList"
        :key="index"
        class="imgLis"
        :style="{ 'margin-bottom': datas.imageMargin + 'rpx', height: datas.height * 2 + 'rpx' }"
        @click="navTo(item.url)">
        <!-- 图片 -->
        <image class="image" :src="item.src" :style="{ borderRadius: datas.borderRadius + 'rpx' }" />
        <!-- 标题 -->
        <text v-if="item.text" class="title">{{ item.text }}</text>
      </view>
    </view>
    <!-- 轮播组件 -->
    <view
      v-if="datas.imageList.length && (datas.swiperType === 1 || datas.swiperType === 2)"
      :style="{ padding: `0 ${datas.pageMargin}rpx` }">
      <u-swiper
        :list="datas.imageList"
        :previous-margin="swiperMargin"
        :next-margin="swiperMargin"
        circular
        :height="datas.height + 'rpx'"
        :autoplay="datas.imageList.length > 0"
        :radius="datas.borderRadius"
        key-name="src"
        :show-title="true"
        :loading="loading"
        :interval="datas.interval"
        :indicator-style="datas.pagingType === 'progressbar' ? 'width:100%; top: -2px; zIndex: 999;' : ''"
        @change="change"
        @click="clickPushTo">
        <template v-slot:indicator>
          <view v-if="datas.pagingType">
            <!-- 指示器 -->
            <!-- 样式一 -->
            <view v-if="datas.pagingType === 'bullets'" class="dot-main">
              <view
                v-for="(item, index) in datas.imageList"
                :key="index"
                class="dot-item"
                :style="{ backgroundColor: current == index ? datas.indicatorColor : '' }" />
            </view>
            <text v-if="datas.pagingType === 'fraction'" class="pagination" :style="{ color: datas.indicatorColor }">
              {{ current + 1 }}/{{ datas.imageList.length }}
            </text>
            <!-- 样式3 -->
            <view v-if="datas.pagingType === 'progressbar'" class="progressbar-box">
              <view
                class="progressbar"
                :style="{
                  width: (100 / datas.imageList.length) * (current + 1) + '%',
                  backgroundColor: datas.indicatorColor,
                }" />
            </view>
          </view>
        </template>
      </u-swiper>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Pictureads',
  props: {
    datas: {
      type: [Object, null],
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      current: 1,
      loading: false,
    };
  },
  computed: {
    // 轮播的前边距 和 后边距
    swiperMargin() {
      let margin = '';
      // #ifdef MP-ALIPAY
      margin = this.datas.swiperType === 2 ? '30rpx' : '';
      // #endif
      // #ifndef MP-ALIPAY
      margin = this.datas.swiperType === 2 ? '60rpx' : '';
      // #endif
      return margin;
    },
  },
  async mounted() {
    await this.$u.sleep(300);
    this.loading = false;
  },
  methods: {
    change(e) {
      this.current = e.current;
    },
    clickPushTo(index) {
      if (this.datas.imageList[index]?.isExpire && this.datas.imageList[index]?.datetime) {
        const item = this.datas.imageList[index];
        const now = new Date();
        const startTime = new Date(item.datetime[0]);
        const endTime = new Date(item.datetime[1]);
        // 检查当前时间是否在 startTime 和 endTime 之间（包括边界）
        if (now >= startTime && now <= endTime) {
          return this.navTo(item.url);
        } else {
          return this.$u.toast('活动未开始');
        }
      }
      this.navTo(this.datas.imageList[index].url);
    },
  },
};
</script>

<style scoped lang="scss">
.pictureads {
  position: relative;

  /* 无图片 */
  .upload {
    background: #ccc;
    width: 100%;
    height: 400rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  // 类型0
  .swiperType0 {
    box-sizing: border-box;

    /* 图片列表 */
    .imgLis {
      // width: 750rpx;
      width: 100%;
      position: relative;
      overflow: hidden;

      /* 图片 */
      .image {
        width: 100%;
        height: 100%;
      }

      .title {
        width: 100%;
        height: 72rpx;
        line-height: 72rpx;
        color: #fff;
        background-color: rgba(51, 51, 51, 0.8);
        text-align: center;

        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }

  /* 类型1 */
  .type1 {
    .swiper-slide {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .swiper-slide-image {
      width: 100%;
      height: 100%;
    }

    .title {
      height: 36px;
      width: 100%;
      background-color: rgba(51, 51, 51, 0.8);
      text-align: center;
      line-height: 36px;
      color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: left;
      box-sizing: border-box;
      padding: 0 5px;
    }
  }

  .type3 {
    display: flex;
    align-items: center;
    justify-content: center;

    .swiper-slide {
      height: 460rpx !important;
      text-align: center;
      font-size: 18px;
      box-shadow: rgba(147, 147, 147, 0.8) 0px 7px 24px 0px;
      overflow: hidden;

      /* Center slide text vertically */
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      transition: 300ms;
      transform: scale(0.93);
    }

    .swiper-slide-active {
      height: 400rpx !important;
    }
  }
}

// 轮播
.swiper {
}

// 指示器 样式一
.dot-main {
  display: flex;
  justify-content: center;
  align-items: center;

  .dot-item {
    width: 30rpx;
    height: 4rpx;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
}

// 页码 样式二
.pagination {
  font-size: 28rpx;
}

// 样式三
.progressbar-box {
  width: 100%;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.25);
}

.progressbar {
  height: 4px;
  background-color: #007aff;
  transition: 300ms;
}
</style>
