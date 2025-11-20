<template>
  <view
    class="u-lazy-wrap"
    :style="{
      opacity: Number(opacity),
      borderRadius: borderRadius + 'rpx',
      // 因为time值需要改变,所以不直接用duration值(不能改变父组件prop传过来的值)
      transition: `opacity ${time / 1000}s ease-in-out`,
    }">
    <view :id="uid">
      <image
        :style="{ borderRadius: borderRadius + 'rpx', height: imgHeight }"
        v-if="!isError"
        class="u-lazy-item"
        :src="isShow ? image : loadingImg"
        :mode="imgMode"
        @load="imgLoaded"
        @error="loadError"></image>
      <image
        :style="{ borderRadius: borderRadius + 'rpx', height: imgHeight }"
        class="u-lazy-item error"
        v-else
        :src="errorImg"
        :mode="imgMode"
        @load="errorImgLoaded"></image>
    </view>
  </view>
</template>

<script>
/**
 * lazyLoad 图片懒加载
 * @property {String} image 图片路径
 * @property {String} loading-img 预加载时的占位图
 * @property {String} error-img 图片加载出错时的占位图
 * @property {String} threshold 触发加载时的位置，见上方说明，单位 rpx（默认50）
 * @property {String Number} duration 图片加载成功时，淡入淡出时间，单位ms（默认500）
 * @property {String Number} border-radius 图片圆角值，单位rpx（默认0）
 * @property {String Number} height 图片高度，单位rpx（默认450）
 * @property {String Number} mode 图片的裁剪模式，详见image组件裁剪模式（默认aspectFill）
 * @example <snake-lazy-load :image="image"></snake-lazy-load>
 */
export default {
  name: 'snake-lazy-load',
  props: {
    // 图片路径
    image: {
      type: String,
      default: '',
    },
    // 图片裁剪模式
    imgMode: {
      type: String,
      default: 'widthFix',
    },
    // 圆角值
    borderRadius: {
      type: [Number, String],
      default: 0,
    },
    // 占位图片路径
    loadingImg: {
      type: String,
      default: 'https://cdn.puresnake.com/joker/static/snake-loading.png',
    },
    // 加载失败的错误占位图
    errorImg: {
      type: String,
      default: 'https://cdn.puresnake.com/joker/static/loadfail.png',
    },
    // 是否使用过渡效果
    isEffect: {
      type: Boolean,
      default: true,
    },
    // 淡入淡出动画的过渡时间
    duration: {
      type: [Number, String],
      default: 500,
    },
    // 图片进入可见区域前多少像素时，单位rpx，开始加载图片
    // 负数为图片超出屏幕底部多少距离后触发懒加载，正数为图片顶部距离屏幕底部多少距离时触发(图片还没出现在屏幕上)
    threshold: {
      type: [Number, String],
      default: 50,
    },
    // 图片高度，单位rpx
    height: {
      type: [Number, String],
      default: 450,
    },
  },
  data() {
    return {
      isShow: false,
      uid: uni.$u.guid(),
      loadStatus: '', // 默认是懒加载中的状态
      isError: false, // 图片加载失败
      time: this.duration,
      opacity: 1,
    };
  },
  mounted() {
    // 此uOnReachBottom事件由mixin.js发出，目的是让页面到底时，保证所有图片都进行加载，做到绝对稳定且可靠
    this.$nextTick(() => {
      uni.$once('uOnReachBottom', () => {
        if (!this.isShow) {
          this.isShow = true;
        }
      });
    });
    this.init();
  },
  beforeUnmount() {
    this.disconnectObserver('contentObserver');
  },
  computed: {
    // 将threshold从rpx转为px
    getThreshold() {
      // 先取绝对值，因为threshold可能是负数，最后根据this.threshold是正数或者负数，重新还原
      const thresholdPx = uni.upx2px(Math.abs(this.threshold));
      return this.threshold < 0 ? -thresholdPx : thresholdPx;
    },
    // 计算图片的高度，可能为auto，带%，或者直接数值
    imgHeight() {
      return this.$u.addUnit(this.height, 'rpx');
    },
  },
  watch: {
    isShow(nVal) {
      // 如果是不开启过渡效果，直接返回
      if (!this.isEffect) {
        return;
      }
      this.time = 0;
      // 原来opacity为1(不透明，是为了显示占位图)，改成0(透明，意味着该元素显示的是背景颜色，默认的白色)，再改成1，是为了获得过渡效果
      this.opacity = 0;
      // 延时30ms，否则在浏览器H5，过渡效果无效
      setTimeout(() => {
        this.time = this.duration;
        this.opacity = 1;
      }, 30);
    },
    image: {
      handler(n) {
        if (n) {
          this.isError = false;
        } else {
          // 如果传入null或者''，或者undefined，标记为错误状态
          this.isError = true;
        }
      },
    },
  },
  methods: {
    // 初始化
    async init() {
      await this.$u.sleep(30);
      this.observeContent();
      this.loadStatus = '';
    },
    observeContent() {
      // 先断掉之前的观察
      this.disconnectObserver('contentObserver');
      const contentObserver = uni.createIntersectionObserver(this);
      // 要理解这里怎么计算的，请看这个：
      // https://blog.csdn.net/qq_25324335/article/details/83687695
      // 到屏幕顶部的高度时触发
      contentObserver.relativeToViewport({ bottom: this.getThreshold });
      // 绑定观察的元素
      contentObserver.observe(`#${this.uid}`, (res) => {
        if (res.intersectionRatio > 0) {
          this.isShow = true;
          // 如果图片已经加载，去掉监听，减少性能的消耗
          this.disconnectObserver('contentObserver');
        }
      });
      this.contentObserver = contentObserver;
    },
    disconnectObserver(observerName) {
      // 断掉观察，释放资源
      const observer = this[observerName];
      observer && observer.disconnect();
    },
    // 图片加载完成事件，可能是加载占位图时触发，也可能是加载真正的图片完成时触发，通过isShow区分
    imgLoaded() {
      // 占位图加载完成
      if (this.loadStatus === '') {
        this.loadStatus = 'lazyed';
      } else if (this.loadStatus === 'lazyed') {
        // 真正的图片加载完成
        this.loadStatus = 'loaded';
      }
    },
    // 错误的图片加载完成
    errorImgLoaded() {
      this.$emit('error');
    },
    // 图片加载失败
    loadError() {
      this.isError = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.u-lazy-wrap {
  overflow: hidden;
}

.u-lazy-item {
  width: 100%;
  // 骗系统开启硬件加速
  transform: transition3d(0, 0, 0);
  // 防止图片加载“闪一下”
  will-change: transform;
}
</style>
