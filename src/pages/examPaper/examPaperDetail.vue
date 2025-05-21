<template>
  <view>
    <view
      v-if="
        questionsDetail.status === 'pending' ||
        (!['fail', 'pass'].includes(questionsDetail.status) && questionsDetail.answerDate < curTimestamp)
      ">
      <view class="flex-center pt-10rpx">
        <view class="flex-center w-670rpx h-322rpx" style="border: 2px solid #9f9f9f">
          <view class="flex-center w-636rpx h-294rpx" style="border: 1px solid #cccccc">
            <view class="flex-col">
              <view class="text-40rpx text-black flex-center snake-font-medium">
                <text>{{ questionsDetail.paperName }}</text>
                <view
                  v-if="questionsDetail.answerDate < curTimestamp"
                  class="text-24rpx py-2rpx px-7rpx rounded-8rpx text-white bg-#ff525d mx-10rpx">
                  已超时
                </view>
              </view>
              <view class="text-28rpx mt-20rpx text-#888891">考题数量：{{ questionsDetail.questionCount }}</view>
              <view class="text-28rpx mt-20rpx text-#888891">考试时间：{{ questionsDetail.examTime }}分钟</view>
              <view class="text-28rpx mt-20rpx text-#888891">考题截至时间：{{ $u.formatTime(questionsDetail.answerDate) }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else>
      <view class="flex-center pt-10rpx">
        <view class="flex-center w-670rpx h-322rpx" style="border: 2px solid #9f9f9f">
          <view class="flex-center w-636rpx h-294rpx" style="border: 1px solid #cccccc">
            <view class="flex-center flex-col">
              <view class="text-60rpx text-#06d290 snake-font-medium" v-if="questionsDetail.status === 'pass'">及格</view>
              <view class="text-60rpx text-#fd5b5b snake-font-medium" v-if="questionsDetail.status === 'fail'">不及格</view>
              <view class="text-36rpx snake-font-medium">{{ questionsDetail.msg || '正确率0%' }}</view>
              <view class="text-28rpx pt-20rpx text-#646471 snake-font-regular">
                答对{{ questionsDetail.correctCount || 0 }}道题 答错{{ questionsDetail.incorrectCount || 0 }}道题
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="flex-center text-28rpx pt-16rpx pb-20rpx snake-font-medium">— 错题 —</view>

      <template v-if="examQuestionList.length && questionsDetail.status !== 'ing'">
        <view class="questionsItem" v-for="(item, index) in examQuestionList" :key="item.id">
          <view class="top snake-border-b">
            <text class="snake-ellipsis snake-font-semibold text-28rpx max-w-520rpx">题干</text>
            <text class="text-22rpx text-#626772 font-500">{{ index + 1 }}/{{ examQuestionList.length }}</text>
          </view>
          <view class="center">
            <scroll-view scroll-x class="scroll-view w-634rpx">
              <view class="imageList">
                <block v-for="(imgItem, imgIndex) in item.questionImage" :key="imgIndex">
                  <view class="image" @click="previewImageHandler(item.questionImage, imgIndex)">
                    <image :src="imgItem" mode="aspectFill"></image>
                  </view>
                </block>
              </view>
            </scroll-view>
          </view>
          <view class="bottom snake-space-between snake-flex-vcenter snake-border-t">
            <text class="snake-font-regular text-22rpx text-#888891 font-400">已选：{{ item.userAnswer || '未答题' }}</text>
            <text class="snake-font-regular text-32rpx text-#2ebd7c font-600">答案：{{ item.answer || '' }}</text>
          </view>
        </view>
      </template>
      <u-empty v-else></u-empty>
    </view>
    <view class="h-104rpx pb-safe"></view>
    <view
      class="snake-fixed-bottom"
      v-if="questionsDetail.answerDate > curTimestamp && ['fail', 'pass'].includes(questionsDetail.status)">
      <view class="py-12rpx px-24rpx">
        <u-button
          type="primary"
          custom-style="border-radius: 16rpx"
          @click="$u.navTo(`/pages/examPaper/answer?examPaperId=${examPaperId}&status=${questionsDetail.status}`)">
          去刷题
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { getAppraiseExamQuestionDetail } from '@/api/appraise';
export default {
  data() {
    return {
      examPaperId: '',
      questionsDetail: {},
      examQuestionList: [],
    };
  },
  onLoad(option) {
    this.examPaperId = option.examPaperId;
    this.getExamQuestionList();
  },
  computed: {
    curTimestamp() {
      // 当前时间戳
      return new Date().getTime();
    },
  },
  methods: {
    async getExamQuestionList() {
      const response = await getAppraiseExamQuestionDetail({
        examPaperId: this.examPaperId,
        type: 'viewCorrect',
      });
      if (response.success) {
        this.questionsDetail = response?.data || {};
        this.examQuestionList = response.data?.examQuestionDtoList || [];
        this.examQuestionList?.forEach((item) => {
          if (item.questionImage) {
            item.questionImage = item.questionImage.split(',');
          }
        });
      } else {
        this.$toast(response.msg);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.questionsdetail {
  width: 100%;
}

.questionsItem {
  width: 670rpx;
  height: 312rpx;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 #bccecf47;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12rpx 24rpx 12rpx 12rpx;
  box-sizing: border-box;
  margin: 0 auto 20rpx;

  .top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 12rpx;
  }

  .center {
    .imageList {
      display: flex;
      flex-direction: row;
    }

    .image {
      width: 120rpx;
      height: 120rpx;
      margin-right: 6rpx;

      image {
        width: 120rpx;
        height: 120rpx;
      }
    }
  }

  .bottom {
    padding-top: 18rpx;
  }
}

.submit-button {
  width: 640rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: rgba(0, 0, 0, 1);
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  margin: auto;
}
.tag {
  align-items: center;
  margin-left: 10rpx;
  padding: 5rpx 10rpx;
  background-color: #ff525d;
  color: #ffffff;
  border-radius: 4rpx;
  font-size: 22rpx;
}
</style>
