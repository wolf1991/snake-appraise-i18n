<template>
  <view class="bg-white">
    <view class="flex-center text-28rpx font-500 pt-16rpx pb-20rpx snake-font-medium">— {{ $t('pages.examPaperList') }} —</view>
    <template v-for="item in examPaperList" :key="item.id">
      <view
        class="flex-items-center justify-between py-20rpx px-28rpx snake-border-b"
        @click="$u.navTo(`/pages/examPaper/examPaperDetail?examPaperId=${item.id}`)">
        <view>
          <view class="flex-items-center">
            <view class="text-32rpx snake-font-medium">{{ $t('examPaper.totalQuestions', { count: item.questionCount }) }}</view>
            <view
              class="text-24rpx py-2rpx px-7rpx rounded-8rpx text-white bg-#ff525d mx-10rpx"
              v-if="['ing', 'pending'].includes(item.status)">
              {{ $t('examPaper.incomplete') }}
            </view>
            <view
              class="text-24rpx py-2rpx px-7rpx rounded-8rpx text-white bg-#707184 mx-10rpx"
              v-if="item.answerDate < curTimestamp && ['ing', 'pending'].includes(item.status)">
              {{ $t('examPaper.timeout') }}
            </view>
          </view>
          <view class="text-22rpx pt-10rpx snake-font-regular" v-if="item.correctCount || item.incorrectCount">
            {{ $t('examPaper.answerStats', { correct: item.correctCount || 0, incorrect: item.incorrectCount || 0 }) }}
          </view>
          <view class="text-28rpx text-#707184 font-400 pt-10rpx snake-font-din-Regular">
            {{ $u.formatTime(item.answerDate) }}
          </view>
        </view>
        <view class="next-icons icon-more text-40rpx"></view>
      </view>
    </template>
    <u-empty v-if="!examPaperList.length"></u-empty>
    <u-loadmore v-else :status="loadingStatus"></u-loadmore>
    <view class="h-10rpx"></view>
  </view>
</template>

<script>
import { getAppraiseExamPaperListApi } from '@/api/appraise';
export default {
  data() {
    return {
      page: 1,
      loadingStatus: 'loadmore',
      examPaperList: [],
    };
  },
  onLoad() {
    this.getQuestionList();
  },
  onPullDownRefresh() {
    this.getQuestionList('refresh').then(() => {
      uni.stopPullDownRefresh();
    });
  },
  onReachBottom() {
    if (this.loadingStatus === 'loading') {
      this.getQuestionLis();
    }
  },
  computed: {
    curTimestamp() {
      // 当前时间戳
      return Date.now();
    },
  },
  methods: {
    async getQuestionList(type = '') {
      if (type === 'refresh') {
        this.page = 1;
        this.examPaperList = [];
      }
      uni.showLoading({
        title: uni.$t('common.loading'),
        mask: true,
      });
      const response = await getAppraiseExamPaperListApi({
        page: this.page,
        size: 20,
      });
      if (response.success) {
        const newList = response.data?.items || [];
        this.examPaperList = this.examPaperList.concat(newList);
        // 分页
        if (newList.length < 20) {
          this.loadingStatus = 'nomore';
        } else {
          this.loadingStatus = 'loading';
          this.page++;
        }
        uni.hideLoading();
      } else {
        uni.hideLoading();
        uni.$u.toast(response.msg);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.submit-button {
  width: 640rpx;
  height: 88rpx;
  margin: 0 auto;
  line-height: 88rpx;
  background: rgba(0, 0, 0, 1);
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
.btn {
  align-items: center;
  margin-left: 10rpx;
  padding: 5rpx;
  background-color: #ff525d;
  color: #ffffff;
  border-radius: 8rpx;
}
.btn2 {
  align-items: center;
  margin-left: 10rpx;
  padding: 5rpx;
  background-color: #707184;
  color: #ffffff;
  border-radius: 8rpx;
}
</style>
