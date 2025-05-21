<template>
  <view class="totop" :animation="animationData" :style="{ bottom: platformBottom, background: background, zIndex: zIndex }">
    <slot></slot>
  </view>
</template>
<script>
export default {
  name: 'u-float',
  props: {
    top: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#2EBD7C',
    },
    bottom: {
      type: String,
      default: '80rpx',
    },
    background: {
      type: String,
      default: '#FFFFFF',
    },
    zIndex: {
      type: String,
      default: '89',
    },
  },
  data() {
    return {
      animationData: {}, // 动画
      off: false, // 判断是否开启动画
    };
  },
  mounted() {
    // 初始化一个动画
    const animation = uni.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    });
    this.animation = animation;
  },
  computed: {
    platformBottom() {
      const { bottom } = this;
      // #ifdef H5
      // bottom = `calc(100rpx + ${bottom})`
      // #endif
      return bottom;
    },
  },
  watch: {
    top(topVal, oldVal) {
      this.declick();
    },
  },
  methods: {
    // 开启动画事件
    declick() {
      if (!this.off) {
        this.rotateAndScale();
        this.off = true;
      }
    },
    // 定义滚动时的动画内容
    rotateAndScale() {
      // 定义动画内容
      this.animation.translateX(35).step();
      // 导出动画数据传递给data层
      this.animationData = this.animation.export();
      // 2秒内不滚动时触发
      setTimeout(() => {
        this.off = false;
        this.norotateAndScale();
      }, 2000);
    },
    // 定义停止滚动后的动画内容
    norotateAndScale() {
      this.animation.translateX(0).step();
      this.animationData = this.animation.export();
    },
  },
};
</script>
<style scoped>
.totop {
  width: 40px;
  height: 40px;
  line-height: 40px;
  background: #ffffff;
  color: #2ebd7c;
  position: fixed;
  right: 28rpx;
  bottom: 80px;
  z-index: 971;
  border-radius: 5px;
  text-align: center;
}
</style>
