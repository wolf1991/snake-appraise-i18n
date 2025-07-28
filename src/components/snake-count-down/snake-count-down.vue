<template name="graceCountDown">
  <view class="snake-countdown" v-if="show">
    <block v-if="!noday">
      <view
        class="snake-countdown-numbers"
        :style="{
          width: width,
          height: width,
          fontSize: fontSize,
          lineHeight: width,
          color: fontColor,
          background: bgrColor,
          border: border,
          borderColor: borderColor,
        }"
        v-if="d > 0">
        {{ d }}
      </view>
      <view class="snake-countdown-splitor" :style="{ color: splitorColor, lineHeight: width, fontSize: fontSize }" v-if="d > 0">
        {{ splitorText[0] }}
      </view>
    </block>
    <view
      class="snake-countdown-numbers"
      :style="{
        width: width,
        height: width,
        fontSize: fontSize,
        lineHeight: width,
        color: fontColor,
        background: bgrColor,
        border: border,
        borderColor: borderColor,
      }"
      v-if="h != '00' || zeroShow">
      {{ h }}
    </view>
    <view
      class="snake-countdown-splitor"
      :style="{ color: splitorColor, lineHeight: width, fontSize: fontSize }"
      v-if="h != '00' || zeroShow">
      {{ splitorText[1] }}
    </view>
    <view
      class="snake-countdown-numbers"
      :style="{
        width: width,
        height: width,
        fontSize: fontSize,
        lineHeight: width,
        color: fontColor,
        background: bgrColor,
        border: border,
        borderColor: borderColor,
      }">
      {{ i }}
    </view>
    <view class="snake-countdown-splitor" :style="{ color: splitorColor, lineHeight: width, fontSize: fontSize }">
      {{ splitorText[2] }}
    </view>
    <view
      class="snake-countdown-numbers"
      :style="{
        width: width,
        height: width,
        fontSize: fontSize,
        lineHeight: width,
        color: fontColor,
        background: bgrColor,
        border: border,
        borderColor: borderColor,
      }">
      {{ s }}
    </view>
    <view class="snake-countdown-splitor" :style="{ color: splitorColor, lineHeight: width, fontSize: fontSize }">
      {{ splitorText[3] }}
    </view>
  </view>
</template>
<script>
/**
 * 倒计时组件
 * @description 仿电子钟封装的倒计时组件 常用于秒杀安排场次的倒计时显示
 * @public
 * @property {String} bgrColor 单个数字板框体的背景色
 * @property {String} borderColor 单个数字板边框色
 * @property {String} fontColor 倒计时字体颜色
 * @property {String} fontSize 倒计时字体尺寸
 * @property {String} splitorColor 分隔符冒号颜色
 * @property {String} timer 目标时间时间戳
 * @property {String} width 单时间格宽度
 * @property {Array} splitorText = [':', ':', ':', ''] 分隔符
 * @property {Boolean} show 组件v-if显示开关
 * @property {Boolean} zeroShow 小时为0时显示开关
 * @property {Boolean} noday 不显示天
 * @event change 输入变动后调用该事件
 * @example
 *	<snakeCountDown style="align-items: center" :noday="true" :zeroShow="false" fontColor="#FE0832"
 *		splitorColor="#FE0832" bgrColor="none" borderColor="transparent"
 *		:timer="itemData.endTime | formatTime" width="26rpx" fontSize="26rpx" ref="graceCountDown1">
 *	</snakeCountDown>
 */
export default {
  name: 'graceCountDown',
  props: {
    bgrColor: {
      type: String,
      default: '#FFFFFF',
    },
    border: {
      type: String,
      default: '1px solid #000000',
    },
    borderColor: {
      type: String,
      default: '#000000',
    },
    fontColor: {
      type: String,
      default: '#000000',
    },
    fontSize: {
      type: String,
      default: '22rpx',
    },
    splitorColor: {
      type: String,
      default: '#000000',
    },
    timer: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '40rpx',
    },
    splitorText: {
      type: Array,
      default() {
        return [':', ':', ':', ''];
      },
    },
    show: {
      type: Boolean,
      default: true,
    },
    zeroShow: {
      type: Boolean,
      default: true,
    },
    noday: {
      type: Boolean,
      default: true,
    }, // 增加不显示天的props --by Tim
  },
  data() {
    return {
      d: 0,
      h: '',
      i: '',
      s: '',
      leftTime: 0,
      outTimer: null,
      timerIn: '',
      leftTimeNum: 0,
    };
  },
  created() {
    this.timerIn = this.timer;
    this.runbase();
  },
  methods: {
    runbase() {
      const reg = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
      const res = this.timerIn.match(reg);
      if (res == null) {
        this.outTimer = setTimeout(() => {
          this.runbase();
        }, 1000);
        return false;
      }
      const year = parseInt(res[1]);
      if (year < 1000) {
        return false;
      }
      const month = parseInt(res[2]);
      const day = parseInt(res[3]);
      const h = parseInt(res[4]);
      if (h < 0 || h > 24) {
        return false;
      }
      const i = parseInt(res[5]);
      if (i < 0 || i > 60) {
        return false;
      }
      const s = parseInt(res[6]);
      if (s < 0 || s > 60) {
        return false;
      }
      const leftTime = new Date(year, month - 1, day, h, i, s);
      this.leftTime = leftTime;
      clearTimeout(this.outTimer);
      this.countDown();
    },
    countDown() {
      const leftTime = this.leftTime - new Date();
      this.leftTimeNum = leftTime;
      if (leftTime > 0) {
        const day = parseInt(leftTime / (1000 * 60 * 60 * 24));
        let hours = 0;
        if (this.noday) {
          hours = parseInt(leftTime / (1000 * 60 * 60));
        } else {
          hours = parseInt((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        }
        let minutes = parseInt((leftTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = parseInt((leftTime % (1000 * 60)) / 1000);
        if (hours < 10) {
          hours = `0${hours}`;
        }
        if (minutes < 10) {
          minutes = `0${minutes}`;
        }
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }
        this.h = hours;
        this.i = minutes;
        this.s = seconds;
        this.d = day;
        this.outTimer = setTimeout(() => {
          this.countDown();
        }, 1000);
      } else {
        clearTimeout(this.outTimer);
        this.h = '00';
        this.i = '00';
        this.s = '00';
        this.d = 0;
        this.$emit('endDo');
      }
    },
    reSetTimer(timer) {
      clearTimeout(this.outTimer);
      this.timerIn = timer;
      this.runbase();
    },
    getTimeRemaining() {
      if (this.leftTimeNum < 0) {
        return 0;
      }
      return parseInt(this.leftTimeNum / 1000);
    },
  },
};
</script>
<style scoped>
.snake-countdown {
  display: flex;
  flex-wrap: nowrap;
  /* justify-content: center; */
}
.snake-countdown-splitor {
  justify-content: center;
}
.snake-countdown-numbers {
  border-radius: 8rpx;
  text-align: center;
  font-size: 22rpx;
  font-family: 'DIN', 'PingFangSC-Medium';
  font-weight: 500;
}
</style>
