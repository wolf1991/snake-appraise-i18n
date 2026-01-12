<template>
  <view class="px-24rpx py-20rpx bg-white">
    <view class="flex-items-center justify-between">
      <view>{{ $t('appraise.onlineEditing.isOnline') }}</view>
      <u-switch v-model="onLine" activeColor="#06D290" @change="showModal"></u-switch>
    </view>
    <u-modal :show="show" :content="content" :showCancelButton="true" @cancel="cancel" @confirm="getOnlineDoItChange"></u-modal>
  </view>
</template>

<script>
import { getAppraiseUserDetailApi } from '@/api/appraise';
import { usePageTitle } from '@/hooks/usePageTitle';
export default {
  data() {
    return {
      onLine: false,
      show: false,
      content: '',
    };
  },
  onLoad() {
    usePageTitle('pages.appraiserStatus');
    this.getUserDetail();
  },
  methods: {
    async getUserDetail() {
      const response = await getAppraiseUserDetailApi();
      if (response.success) {
        this.onLine = response.data.onLine;
      } else {
        uni.$u.toast(response.msg);
      }
    },
    async getOnlineDoItChange() {
      const response = await getAppraiseOnlineChangeApi({
        onLine: this.onLine,
      });
      if (response.success) {
        uni.$u.toast(response.data);
        this.show = false;
      } else {
        uni.$u.toast(response.msg);
      }
    },
    cancel() {
      this.show = false;
      this.onLine = !this.onLine;
    },
    showModal() {
      if (!this.onLine) {
        this.content = uni.$t('appraise.onlineEditing.closeOnlineStatus');
        this.show = true;
      } else {
        this.content = uni.$t('appraise.onlineEditing.openOnlineStatus');
        this.show = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
