<template>
  <view class="activity-session" v-if="list.length">
    <scroll-view class="scroll-view" :scroll-x="list.length > 3" :scroll-left="tabsScrollLeft" :scroll-with-animation="true">
      <view class="defaultNavigation">
        <view class="navigationList__item" v-for="(item, index) in list" :key="index" @click="handelClick(item, index)">
          <view style="position: relative; display: flex; flex-direction: column; align-items: center">
            <!-- 图片 -->
            <image class="image-warp" :src="item.squareImage" :style="[current == item.id ? activeStyle : '']"></image>
            <!-- 倒计时 -->
            <view class="time" :style="[timeStyle(item)]">
              <view
                class="time_box"
                v-if="item.endTime"
                :style="{ backgroundColor: item.tag ? '#FA4D52' : '', opacity: item.tag ? '10' : '' }">
                <view class="time__icon next-icons icon-countdown"></view>
                <!-- <u-count-down :time="item.endTime"></u-count-down> -->
                <text style="min-width: 100%; height: 36rpx">{{ formatDateTime(item.endTime, 'MM-DD HH:mm') }}</text>
              </view>
            </view>
            <!-- 标题 -->
            <view class="title" v-if="index !== 0">
              <text class="title__0">{{ item.name }}</text>
              <text class="title__1">{{ item.subtitle }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'activity-session',
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    current: {
      type: [String, Number],
      default: '001',
    },
  },
  data() {
    return {
      tabsScrollLeft: 0,
      currentIndex: 0,
    };
  },
  computed: {
    activeStyle() {
      const style = {};
      style.width = `${180 * 1.09}rpx`;
      style.height = `${180 * 1.09}rpx`;
      style.border = '5rpx solid #2D57E7';
      return style;
    },
    timeStyle() {
      return (item) => {
        const style = {};
        if (this.current === item.id) {
          style.top = '4rpx';
          style.left = '5rpx';
        }
        return style;
      };
    },
  },
  async mounted() {
    await this.$u.sleep(30);
    this.list.forEach((item, index) => {
      if (this.current === item.id) {
        this.currentIndex = index;
        this.scrollIntoView();
      }
    });
  },
  methods: {
    // 时间戳转 YY-mm-dd HH:ii:ss
    formatDateTime(timeStamp, format = 'YYYY-MM-DD HH:mm:ss') {
      const date = new Date();
      if (`${timeStamp}`.length === 10) {
        date.setTime(timeStamp * 1000);
      } else {
        date.setTime(timeStamp);
      }
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? `0${m}` : m;
      let d = date.getDate();
      d = d < 10 ? `0${d}` : d;
      let h = date.getHours();
      h = h < 10 ? `0${h}` : h;
      let minute = date.getMinutes();
      let second = date.getSeconds();
      minute = minute < 10 ? `0${minute}` : minute;
      second = second < 10 ? `0${second}` : second;
      if (format === 'YYYY-MM-DD') {
        return `${y}-${m}-${d}`;
      } else if (format === 'MM月DD日 HH:mm') {
        return `${m}月${d}日 ${h}:${minute}`;
      } else if (format === 'MM-DD HH:mm') {
        return `${m}-${d} ${h}:${minute}`;
      } else if (format === 'HH:mm') {
        return `${h}:${minute}`;
      } else if (format === 'YYYY-MM-DD HH:mm') {
        return `${y}-${m}-${d} ${h}:${minute}`;
      } else {
        return `${y}-${m}-${d} ${h}:${minute}:${second}`;
      }
      // return [y, m, d, h, minute, second]
    },
    handelClick(item, index) {
      this.currentIndex = index;
      this.$emit('change', item, index);
      this.scrollIntoView();
    },
    // 计算tab位置
    scrollIntoView() {
      // item滚动
      this.getElementData('.defaultNavigation', (data) => {
        const list = data[0];
        this.getElementData('.navigationList__item', (data2) => {
          const el = data2[this.currentIndex];
          this.tabsScrollLeft = el && el.width / 2 + -list.left + el.left - list.width / 2;
        });
      });
    },
    getElementData(el, callback) {
      uni
        .createSelectorQuery()
        .in(this)
        .selectAll(el)
        .boundingClientRect()
        .exec((data) => {
          callback(data[0]);
        });
    },
  },
};
</script>

<style scoped lang="scss">
/* 隐藏滚动条样式 */
.scroll-view {
  background-color: #ffffff;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.activity-session {
  width: 100%;
  background-color: #ffffff;

  .defaultNavigation {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 20rpx;
  }

  .navigationList__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 20rpx 0;
    padding-left: 0 !important;
    box-sizing: border-box;

    .image-warp {
      width: 180rpx;
      height: 180rpx;
      border-radius: 8rpx;
      box-sizing: border-box;
    }

    .time {
      position: absolute;
      top: 0;
      left: 0;

      .time_box {
        // width: 136rpx;
        width: 100%;
        height: 36rpx;
        line-height: 36rpx;
        padding-right: 5rpx;
        opacity: 0.6;
        background: #000000;
        border-radius: 4rpx 0 0 0;
        font-size: 20rpx;
        color: #ffffff;

        display: flex;
        align-items: center;

        .time__icon {
          margin: 0 4rpx 0 6rpx;
        }
      }
    }

    .title {
      position: absolute;
      top: 44rpx;
      left: 12rpx;
      color: #333;
      font-family: PingFangSC-S0pxibold;
      font-weight: 600;
      font-size: 26rpx;
      display: flex;
      flex-direction: column;

      .title__1 {
        font-family: PingFangSC-Light;
        font-weight: 300;
        font-size: 20rpx;
      }
    }
  }
}
</style>
