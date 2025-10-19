<template>
  <view>
    <swiper
      class="swiper-card"
      previous-margin="0"
      next-margin="0"
      :circular="false"
      :autoplay="false"
      :current="currentIndex"
      @change="swiperChange">
      <block v-for="(item, index) in newQuestionsAnswer" :key="item.id">
        <swiper-item>
          <scroll-view scroll-y :style="{ height: `${mainHeight}px` }">
            <view class="swiper-item">
              <view class="header">{{ index + 1 }} / {{ totalNum }}</view>
              <view class="content">
                <view class="content-title">
                  <text class="text">{{ index + 1 }}、</text>
                  <text>{{ item.questionName }}</text>
                </view>
                <view class="boxbody" v-for="(self, idxs) in item.optionsMapList" :key="idxs">
                  <view class="selectItem" @click="selectChange(index, idxs)">
                    <view class="next-icons icon-selected select" v-if="self.isSelect"></view>
                    <view class="next-icons icon-notselected select-on" v-else></view>
                    <view>{{ self.options }}、{{ self.answers }}</view>
                  </view>
                </view>
              </view>
              <view class="imageList">
                <block v-for="(imgItem, imgIndex) in item.questionImage" :key="imgIndex">
                  <view class="image" @click="previewImage(item.questionImage)">
                    <image :src="imgItem" lazy-load mode="aspectFill"></image>
                  </view>
                </block>
              </view>
            </view>
          </scroll-view>
          <view class="footer-btn">
            <view class="ftbtn1" @click="showPopup = true">
              <view class="next-icons icon-file snake-f20"></view>
              <view>{{ index + 1 }} / {{ totalNum }}</view>
            </view>
            <view class="ftbtn2" @click="submit">去交卷</view>
          </view>
        </swiper-item>
      </block>
    </swiper>
    <u-popup :show="showPopup" @close="showPopup = false" :z-index="99">
      <view class="questions">
        <view class="header">
          <text>{{ currentIndex + 1 }} / {{ totalNum }}</text>
          <view class="btn" @click="submit">去交卷</view>
        </view>
        <scroll-view scroll-y style="height: 720rpx">
          <view class="questions-list">
            <block v-for="(item, index) in newQuestionsAnswer" :key="item.id">
              <view class="questions-item" :class="{ active: isActive(item) }" @click="currentChange(index)">
                {{ index + 1 }}
              </view>
            </block>
          </view>
        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { debounce, previewImage } from '@/utils';
export default {
  props: {
    dataList: {
      type: Array,
      default() {
        return [];
      },
    },
    currentValue: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      totalNum: 0,
      currentIndex: 3,
      newQuestionsAnswer: [],
      formSubmitData: [], // 提交所需数据
      mainHeight: 0,
      showPopup: false,
    };
  },
  computed: {
    isActive() {
      return (item) => {
        return item.optionsMapList.some((e) => e.isSelect);
      };
    },
  },
  watch: {
    dataList: {
      immediate: true,
      handler(newArr) {
        if (newArr.length) {
          this.newQuestionsAnswer = [...newArr];
          this.totalNum = this.newQuestionsAnswer.length;
          this.setEmptyData();
        }
      },
    },
    currentValue: {
      immediate: true,
      handler(n) {
        if (n !== this.currentIndex) {
          this.currentIndex = this.currentValue;
        }
      },
    },
  },
  mounted() {
    setTimeout(() => {
      this.init();
    }, 100);
  },
  methods: {
    previewImage,
    async init() {
      const pageHeight = (await this.queryRect('.swiper-card'))?.height || 0;
      const footerHeight = (await this.queryRect('.footer-btn'))?.height || 0;
      this.mainHeight = pageHeight - footerHeight;
    },
    queryRect(el) {
      return new Promise((resolve) => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select(el)
          .boundingClientRect((size) => {
            resolve(size);
          })
          .exec();
      });
    },
    // 创建提交数组的数据结构
    setEmptyData() {
      this.newQuestionsAnswer.forEach((answerItem) => {
        if (answerItem.options) {
          const options = JSON.parse(answerItem?.options || '{}');
          const optionsMapList = [];
          Object.keys(options).forEach((item) => {
            optionsMapList.push({
              options: item,
              answers: options[item],
              isSelect: answerItem.userAnswer === item ? 1 : 0,
            });
          });
          answerItem.optionsMapList = optionsMapList;
        }
        if (!Array.isArray(answerItem.questionImage) && answerItem.questionImage) {
          answerItem.questionImage = answerItem.questionImage.split(',');
        }
        this.formSubmitData.push({
          id: answerItem.id, // 题目id
          userAnswer: answerItem.userAnswer, // 答案
        });
      });
    },
    submit: debounce(function () {
      const result = this.formSubmitData.findIndex((item) => !item.userAnswer);
      if (result !== -1) {
        uni.showModal({
          title: '提示',
          showCancel: false,
          content: `当前未完成第${result + 1}题！`,
        });
        return;
      }
      this.$emit('submit');
    }, 300),
    // 单选事件
    selectChange(j, e) {
      if (this.newQuestionsAnswer[j].optionsMapList[e].isSelect) {
        this.newQuestionsAnswer[j].optionsMapList[e].isSelect = 0;
        this.formSubmitData[j].userAnswer = '';
      } else {
        for (let i = 0; i < this.newQuestionsAnswer[j].optionsMapList.length; i++) {
          if (this.newQuestionsAnswer[j].optionsMapList[i].isSelect) {
            this.newQuestionsAnswer[j].optionsMapList[i].isSelect = 0;
          }
        }
        this.newQuestionsAnswer[j].optionsMapList[e].isSelect = 1;
        this.formSubmitData[j].userAnswer = this.newQuestionsAnswer[j].optionsMapList[e].options;
        this.next(j);
      }
      this.newQuestionsAnswer = JSON.parse(JSON.stringify(this.newQuestionsAnswer));
    },
    // swiper改变时
    swiperChange(e) {
      this.currentIndex = e.detail.current;
    },
    // 上一题
    back(index) {
      if (!index) return;
      this.currentIndex = index - 1;
    },
    // 下一题
    next: debounce(function (index, j) {
      this.$emit('next', this.formSubmitData[index]);
      if (this.currentIndex + 1 >= this.totalNum) return false;
      this.currentIndex = index + 1;
    }, 500),
    currentChange(index) {
      this.currentIndex = index;
      this.showPopup = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.swiper-card {
  width: 100%;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  /* #ifndef H5 */
  height: 100vh;
  /* #endif */
  background: #ffffff;

  .swiper-item {
    width: 100%;
    padding: 20rpx 30rpx;
    box-sizing: border-box;

    .header {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      margin-bottom: 16rpx;
    }
  }

  .content {
    width: 100%;
    font-size: 30rpx;
    color: #333333;

    .content-title {
      padding-bottom: 32rpx;

      .text {
        width: 50rpx;
        height: 34rpx;
      }
    }
  }

  .boxbody {
    margin-left: 18rpx;
    margin-bottom: 28rpx;
  }

  .selectItem {
    display: flex;
    align-items: center;

    .select {
      font-size: 34rpx;
      color: #2ebd7c;
      margin-right: 16rpx;
    }

    .select-on {
      font-size: 34rpx;
      color: #dddddd;
      margin-right: 16rpx;
    }
  }

  .imageList {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .image {
      padding-bottom: 16rpx;

      image {
        width: 336rpx;
        height: 336rpx;
      }
    }
  }

  .footer-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    margin: 0 28rpx;
    padding: 12rpx 0;
    padding-bottom: calc(12rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(12rpx + env(safe-area-inset-bottom));
  }

  .ftbtn1 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 340rpx;
    height: 88rpx;
    border: 2rpx solid #000000;
    font-size: 30rpx;
    font-weight: 500;
    color: #000;
    border-radius: 16rpx;
    box-sizing: border-box;
  }

  .ftbtn2 {
    width: 340rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: #000000;
    font-size: 30rpx;
    font-weight: 500;
    color: #ffffff;
    border-radius: 16rpx;
  }
}

.questions {
  width: 100%;
  height: 860rpx;
  background-color: #fff;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 34rpx 40rpx;
    font-size: 32rpx;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 204rpx;
    height: 80rpx;
    border: 4rpx solid #000000;
    border-radius: 16rpx;
    box-sizing: border-box;
  }
}

.questions-list {
  display: flex;
  flex-wrap: wrap;
  margin-left: 34rpx;

  .questions-item {
    width: 80rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 24rpx;
    color: #acacb7;
    border: 4rpx solid #acacb7;
    border-radius: 50%;
    margin-right: 36rpx;
    margin-bottom: 40rpx;
    box-sizing: border-box;
  }

  .active {
    color: #fff;
    background: #000000;
    border: 4rpx solid #000;
  }
}
</style>
