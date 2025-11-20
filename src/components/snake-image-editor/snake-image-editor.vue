<template>
  <u-popup @close="cancelHandler" :show="show" mode="bottom" bgColor="transparent" :safeAreaInsetBottom="true">
    <view class="imgage-editor" :style="[{ height: winHeight + 'px' }]">
      <view class="editor-header">
        <view class="editor-header__cancel" @click="cancelHandler">取消</view>
      </view>
      <view class="imgage-editor-wrapper" :style="[{ height: canvasHeight && canvasHeight + 'px', marginTop: marginTop }]">
        <canvas
          class="board-canvas"
          :canvas-id="cid"
          :id="cid"
          disable-scroll
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          :style="[{ width: canvasWidth && canvasWidth + 'px', height: canvasHeight && canvasHeight + 'px' }]"></canvas>
      </view>
      <view class="imgage-editor-action">
        <view class="next-icons icon-pen action-pen" :class="[{ 'action-pen__active': isLine }]" @click="isLine = !isLine"></view>
        <view style="display: flex; align-items: center">
          <u-button custom-style="width: 136rpx;height: 76rpx; border-radius: 8rpx;" @click="clearCanvas">清空</u-button>
          <u-button custom-style="width: 136rpx;height: 76rpx; border-radius: 8rpx;margin-left: 10rpx;" @click="saveHandler">
            完成
          </u-button>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
/**
 * canvas snake-image-editor
 * @description 在图片上涂鸦
 * @property {String} cid canvas id 不设置则默认为 cid-时间戳
 * @property {String} bgImage 画布背景图
 * @property {String | Number} index 点击完成的时候传递事件出去的index（用于区分点击了哪一个）
 * @event {Function} close 关闭弹窗
 * @event {Function} change 点击完成时的回调
 * @example <snake-image-editor><snake-image-editor>
 */
import uploader from '@/utils/uploader/uploader';
export default {
  name: 'snake-image-editor',
  props: {
    // 是否展示弹窗
    show: {
      type: Boolean,
      default: false,
    },
    // canvas id
    cid: {
      type: String,
      default: `cid-${Date.now()}`,
    },
    // 画布背景图
    bgImage: {
      type: String,
      default: '',
    },
    // 点击完成的时候传递事件出去的index（用于区分点击了哪一个）
    index: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      canvasCtx: null,
      lineData: [],
      winWidth: 0,
      winHeight: 0,
      canvasWidth: null,
      canvasHeight: null,
      penLineWidth: 4, // 画笔大小
      penLineColor: '#ff0000', // 线条颜色
      isLine: false, // 是否可以画线条
      marginTop: 0,
      safeAreaInsetsBottom: 0,
    };
  },
  created() {
    // 获取窗口宽高
    const { windowWidth, windowHeight, safeAreaInsets } = uni.getSystemInfoSync();
    this.winWidth = windowWidth;
    this.winHeight = windowHeight;
    // #ifdef MP-WEIXIN ||  MP-ALIPAY
    this.winHeight = this.winHeight - safeAreaInsets.bottom;
    this.safeAreaInsetsBottom = safeAreaInsets.bottom;
    // #endif
  },
  async mounted() {
    this.marginTop = 0;
    this.canvasCtx = uni.createCanvasContext(this.cid, this);
    this.initBoard();
    this.setBackgroundImage();
  },
  methods: {
    initBoard() {
      this.canvasCtx.setLineCap('round'); // 让线条圆润
      this.canvasCtx.strokeStyle = this.penLineColor;
      this.canvasCtx.setFillStyle(this.penLineColor);
      this.canvasCtx.setLineWidth(this.penLineWidth);
    },
    async setBackgroundImage() {
      if (this.bgImage) {
        // 获取尺寸
        const sizeInfo = await this.$uGetRect('.imgage-editor-action');
        const imgInfo = await this.getImageInfo(this.bgImage);
        // 图片的宽高比
        const imgScale = imgInfo.width / imgInfo.height;
        // 图片最大展示的高度
        const screenHeight = this.winHeight - 45 - sizeInfo.height + this.safeAreaInsetsBottom;
        // 计算高度，保持图片宽高比不变
        let drawWidth = this.winWidth;
        // 根据宽高比计算高度
        let drawHeight = drawWidth / imgScale;
        // 如果计算出的图片高度超过屏幕高度，则需要调整目标宽度和高度
        if (drawHeight > screenHeight) {
          drawHeight = screenHeight;
          drawWidth = drawHeight * imgScale; // 根据新的高度计算宽度
        } else {
          this.marginTop = (screenHeight - drawHeight) / 2 + 'px'; // 垂直居中
        }
        this.canvasWidth = drawWidth;
        this.canvasHeight = drawHeight;
        // 微信小程序直接使用this.bgImage 图片不渲染
        this.canvasCtx.drawImage(imgInfo.path, 0, 0, drawWidth, drawHeight);
        this.canvasCtx.draw(true);
      }
    },
    // 获取图片信息
    getImageInfo(src) {
      return new Promise((resolve, reject) => {
        uni.getImageInfo({
          src,
          success: (res) => {
            resolve(res);
          },
          fail(err) {
            reject(err);
          },
        });
      });
    },
    // 关闭弹窗
    cancelHandler() {
      this.$emit('close');
    },
    // 保存png图片，文件名配置 filename 仅支持 h5
    async saveHandler(filename = 'h5') {
      const tempFilePath = await this.canvasToTempFilePath();
      console.log(tempFilePath);
      let result = {};

      // #ifdef H5
      // 创建FormData对象
      // let formData = new FormData();
      // // 转换base64为二进制对象并添加到formData中
      // formData.append('file', this.tempFilePath(base64Data), 'image.jpg');
      // image = await uploader.uploadOss(formData);
      // #endif

      // #ifndef H5
      result = await uploader.uploadOss(tempFilePath);
      // #endif
      this.$emit('change', { image: result?.url || '', index: this.index });
      this.cancelHandler();
    },
    // 将base64字符串转换为二进制对象
    base64ToBlob(base64Data) {
      const arr = base64Data.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    // canvas 保存为临时图片路径，h5返回 base64
    canvasToTempFilePath(conf = { quality: 1 }) {
      return new Promise((resolve, reject) => {
        uni.canvasToTempFilePath(
          {
            canvasId: this.cid,
            destWidth: this.canvasWidth * 2,
            destHeight: this.canvasHeight * 2,
            ...conf,
            success: (res) => {
              resolve(res.tempFilePath);
            },
            fail: (err) => {
              console.log('fail', err);
              reject(err);
            },
          },
          this,
        );
      });
    },
    // 手指触摸屏幕时候触发
    onTouchStart(e) {
      if (!this.isLine) return false;
      const pos = e.touches[0];
      this.lineData.push({
        style: {
          color: this.penLineColor,
          width: this.penLineWidth,
        },
        // 屏幕坐标
        coordinates: [
          {
            type: e.type,
            x: pos.x,
            y: pos.y,
          },
        ],
      });
      this.drawLine();
    },
    // 手指在屏幕上滑动的时候连续地触
    onTouchMove(e) {
      if (!this.isLine) return false;
      const pos = e.touches[0];
      this.lineData[this.lineData.length - 1].coordinates.push({
        type: e.type,
        x: pos.x,
        y: pos.y,
      });
      this.drawLine();
    },
    // 手指从屏幕上离开的时候触发
    onTouchEnd(e) {
      if (!this.isLine) return false;
      this.$emit('end', this.lineData);
    },
    // 清空画布
    clearCanvas() {
      this.lineData = [];
      this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.canvasCtx.draw();
      this.initBoard();
      this.setBackgroundImage();
    },
    // 绘制线条
    drawLine() {
      const lineDataLen = this.lineData.length;
      if (!lineDataLen) return;
      const currentLineData = this.lineData[lineDataLen - 1];
      const coordinates = currentLineData.coordinates;
      const coordinatesLen = coordinates.length;
      if (!coordinatesLen) return;
      let startPos;
      let endPos;
      if (coordinatesLen < 2) {
        // 只有开始，没有移动事件
        startPos = coordinates[coordinatesLen - 1];
        endPos = {
          x: startPos.x + 1,
          y: startPos.y,
        };
      } else {
        startPos = coordinates[coordinatesLen - 2];
        endPos = coordinates[coordinatesLen - 1];
      }

      const style = currentLineData.style;
      this.canvasCtx.beginPath();
      this.canvasCtx.setLineCap('round');
      this.canvasCtx.setStrokeStyle(style.color);
      this.canvasCtx.setLineWidth(style.width);
      this.canvasCtx.moveTo(startPos.x, startPos.y);
      this.canvasCtx.lineTo(endPos.x, endPos.y);
      this.canvasCtx.stroke();
      this.canvasCtx.draw(true);
    },
  },
};
</script>

<style lang="scss" scoped>
.imgage-editor {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.editor-header {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
  &__cancel {
    font-size: 32rpx;
    color: #fff;
  }
}

.imgage-editor-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.imgage-editor-action {
  position: fixed;
  bottom: 0;
  padding: 12rpx 36rpx 0;
  padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 200;

  .action-pen {
    font-size: 36rpx;
    color: #999;
    &__active {
      color: #fff !important;
    }
  }
}
.board-canvas {
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>
