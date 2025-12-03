<template>
  <view>
    <u-empty :text="$t('examPaper.noQuestions')" marginTop="60" v-if="!examQuestionList.length"></u-empty>
    <questions-list :dataList="examQuestionList" :currentValue="current" @submit="submit" @next="next" v-else></questions-list>
  </view>
</template>

<script>
import {
  getAppraiseExamQuestionDetailApi,
  postAppraiseSaveExamStartApi,
  postAppraiseExamPaperEndApi,
  postAppraiseSaveExamAnswerApi,
} from '@/api/appraise';
import questionsList from './components/questions-list.vue';
import { usePageTitle } from '@/hooks/usePageTitle';
export default {
  components: {
    questionsList,
  },
  data() {
    return {
      examPaperId: '',
      examQuestionList: [],
      current: 0,
    };
  },
  async onLoad(option) {
    usePageTitle('pages.answer');
    this.examPaperId = option.examPaperId || '';
    if (option.status === 'pending') {
      await this.getExamQuestionStart();
    }
    this.getExamQuestionList();
  },
  methods: {
    async getExamQuestionStart() {
      const response = await postAppraiseSaveExamStartApi({
        examPaperId: this.examPaperId,
      });
      if (response.success) {
        uni.$u.toast(uni.$t('examPaper.startAnswer'));
      } else {
        uni.$u.toast(response.msg);
      }
    },
    // 点击提交
    async submit() {
      const response = await postAppraiseExamPaperEndApi({
        examPaperId: this.examPaperId,
      });
      if (response.success) {
        uni.$u.toast(uni.$t('examPaper.submitSuccess'));
        await uni.$u.sleep(500);
        uni.redirectTo({
          url: `/pages/examPaper/examPaperDetail?examPaperId=${this.examPaperId}`,
        });
      } else {
        uni.$u.toast(response.msg);
      }
    },
    async next(data) {
      const response = await postAppraiseSaveExamAnswerApi({
        id: data.id,
        userAnswer: data.userAnswer,
      });
      if (response.success) {
        // uni.$u.toast('提交成功');
      } else {
        uni.$u.toast(response.msg);
      }
    },
    async getExamQuestionList() {
      const response = await getAppraiseExamQuestionDetailApi({
        examPaperId: this.examPaperId,
        type: 'viewCorrect',
      });
      if (response.success) {
        this.questionsDetail = response.data || {};
        const examQuestionList = response.data?.examQuestionDtoList || [];
        examQuestionList?.forEach((item) => {
          item.questionImage = item?.questionImage?.split?.(',');
        });
        this.examQuestionList = [...examQuestionList];
      } else {
        uni.$u.toast(response.msg);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
