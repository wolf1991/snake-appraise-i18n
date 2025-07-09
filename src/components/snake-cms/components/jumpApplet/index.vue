<template>
  <view>
    <view class="jumpApplet" v-if="datas.isButton">
      <button class="jumpAppletBtn" :style="{ color: datas.textColor, backgroundColor: datas.btnColor }" @click="jump">
        {{ datas.title }}
      </button>
    </view>
    <image v-else :src="datas.imageUrl" mode="widthFix" @click="jump"></image>
  </view>
</template>

<script>
import config from '@/config/config';
export default {
  name: 'jumpApplet',
  props: { datas: Object },
  data() {
    return {};
  },
  mounted() {
    if (this.datas.isAuto) {
      this.jump();
    }
  },
  methods: {
    async jump() {
      if (this.datas.isWeCom) {
        this.jumpH5();
        return;
      }
      if (!this.datas.appId) {
        uni.$u.toast('缺少appId');
        return;
      }
      if (!this.datas.path) {
        uni.$u.toast('缺少跳转页面路径');
        return;
      }
      // #ifdef MP
      let { path } = this.datas;
      if (this.datas.query) {
        path += this.datas.query;
      }
      uni.navigateToMiniProgram({
        appId: this.datas.appId,
        path,
        extraData: {},
        success(res) {
          // 打开成功
          // console.log(res);
        },
        fail(res) {
          console.log('err', res);
        },
      });
      // #endif
      // #ifdef H5
      const timestamp = new Date().getTime();
      const response = await this.$http.post('/user/weixin/generateUrlScheme', {
        appid: this.datas.appId,
        path: this.datas.path,
        query: this.datas.query,
        timestamp,
      });
      if (response.success) {
        location.href = response.data;
      } else {
        uni.$u.toast(response.msg);
      }
      // #endif
    },
    jumpH5() {
      if (!this.datas.path) {
        uni.$u.toast('缺少跳转页面路径');
        return;
      }
      try {
        uni.showLoading({ title: '跳转中...' });
        const query = uni.$u.getQueryParams(window.location.href);
        // 上报巨量 且跳转到微信-添加企业微信
        uni.request({
          url: `${config.baseUrl}/juliang`,
          method: 'post',
          header: { 'Content-Type': 'application/json' },
          data: {
            event_type: 'work_wechat_added',
            context: {
              ad: {
                callback: query.clickid, // callback 这里需要填写的就是从启动参数里获取的 clickid
              },
            },
            timestamp: Date.now(),
          },
          success: (res) => {
            uni.navigateTo({ url: `/pages/custom/webview?url=${this.datas.path}&back=true` });
            uni.hideLoading();
          },
          fail(res) {
            console.log(res);
            uni.hideLoading();
          },
        });
      } catch (e) {
        // TODO handle the exception
        uni.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.jumpApplet {
  margin: 10rpx 40rpx;
}

.jumpAppletBtn {
  cursor: pointer;

  &::after {
    border: none;
  }
}
</style>
