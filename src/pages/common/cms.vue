<template>
  <view :style="{ backgroundColor: pageInfo.bgColor }">
    <snake-cms ref="cmsRef" :pageInfo="pageInfo" :pageComponents="pageComponents" :customNavHeight="0" :scrollTop="scrollTop">
      <template v-slot:kefu>
        <view class="snake-m-20" v-if="pageId == 973">
          <button type="primary" open-type="contact">客服</button>
        </view>
      </template>
    </snake-cms>
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
  onLoad(options) {
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
        uni.$u.toast(response.msg)
      }
    },
  },
};
</script>

<style></style>
