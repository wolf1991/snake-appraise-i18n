<template>
  <view :style="{ backgroundColor: pageInfo.bgColor }">
    <snake-cms
      ref="cmsRef"
      :pageInfo="pageInfo"
      :pageComponents="pageComponents"
      :customNavHeight="customNavHeight"
      :scrollTop="scrollTop"></snake-cms>
  </view>
</template>

<script>
import { getCmsInfo } from '@/api/cms';
export default {
  data() {
    return {
      pageId: '',
      pageInfo: {},
      pageComponents: [],
      scrollTop: 0,
    };
  },
  computed: {
    customNavHeight() {
      const sys = uni.getSystemInfoSync();
      let height = 0;
      // #ifdef H5
      height = sys.statusBarHeight + sys.windowTop;
      // #endif
      return height;
    },
  },
  onLoad(options) {
    let q = options?.q || '';
    // #ifdef MP-ALIPAY
    q = my.getLaunchOptionsSync().query.qrCode;
    // #endif
    // 扫普通二维码进入参数 {"q":"https%253A%252F%252Fxy.puresnake.com%252Fs%253Fp%253D60201715","scancode_time":"1603866721"}
    q = uni.$u.getQueryParams(decodeURIComponent(q));
    options = { ...options, ...q };
    this.pageId = options.pageId;
    if (this.pageId) {
      this.getPageData();
    } else {
      this.$u.toast('pageId不存在');
    }
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  // 上拉加载
  onReachBottom() {
    this.$refs.cmsRef.loadMore();
  },
  // 下拉刷新
  async onPullDownRefresh() {
    this.refresh();
    await this.$u.sleep(300);
    uni.stopPullDownRefresh();
  },
  // 分享好友
  onShareAppMessage(e) {
    if (e.from === 'button') {
      // 来自页面内分享按钮
      console.log(e);
    }
    return {
      title: this.pageInfo.shareParams?.title || 'cms',
      path: `/pages/custom/cms?pageId=${this.pageId}&type=shareLink`,
      imageUrl: this.pageInfo.shareParams?.imageUrl || '',
    };
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.pageInfo.shareParams?.title || 'cms',
      path: `/pages/custom/cms?pageId=${this.pageId}&type=shareLink`,
      imageUrl: this.pageInfo.shareParams?.imageUrl || '',
    };
  },
  methods: {
    refresh() {
      this.$refs.cmsRef.init();
    },
    // 获取cms组件数据
    async getPageData() {
      const response = await getCmsInfo({ id: this.pageId });
      if (response.success) {
        this.pageInfo = response.data.page || {};
        this.pageInfo.pageId = this.pageId;
        this.pageComponents = response.data.pageComponent || [];
        uni.setNavigationBarTitle({ title: response.data.page.name });
        uni.setNavigationBarColor({
          backgroundColor: response?.data?.page?.headerBgColor || '#ffffff',
          // #ifndef MP-ALIPAY
          frontColor: '#000000',
          animation: {
            duration: 300,
            timingFunc: 'easeIn',
          },
          // #endif
        });
      } else {
        uni.$u.toast(response.msg);
      }
    },
  },
};
</script>

<style></style>
