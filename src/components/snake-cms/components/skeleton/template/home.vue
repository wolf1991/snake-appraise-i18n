<template>
  <view class="home">
    <view class="search-box">
      <image class="search" src="https://s.qiuxietang.com/images/202212/bG5mDAZ5Qw.png" mode="widthFix"></image>
    </view>
    <view class="main">
      <view class="meun">
        <block v-for="(item, index) in 10" :key="index">
          <view style="min-width: 20%">
            <skeleton
              avatar
              direction="column"
              avatarShape="square"
              :title="true"
              :titleWidth="'100%'"
              :titleHeight="10"
              :avatarSize="45"
              :loading="loading"
              :customStyle="{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '51rpx',
              }"></skeleton>
          </view>
        </block>
      </view>
      <view class="banner">
        <skeleton
          :rows="1"
          :title="false"
          :rowsWidth="[167]"
          :rowsHeight="[232]"
          :loading="loading"
          :customStyle="{ display: 'flex', alignItems: 'center', marginBottom: '30rpx' }"></skeleton>
        <view>
          <block v-for="item in 2" :key="item">
            <skeleton
              :rows="1"
              :title="false"
              :rowsWidth="[167]"
              :rowsHeight="[113]"
              :loading="loading"
              :customStyle="{ display: 'flex', alignItems: 'center', marginBottom: '10rpx' }"></skeleton>
          </block>
        </view>
      </view>
      <view class="meun-2">
        <block v-for="(item, index) in 4" :key="index">
          <view style="min-width: 25%">
            <skeleton
              :rows="2"
              :title="false"
              :rowsWidth="[65, 41]"
              :rowsHeight="[24, 10]"
              :loading="loading"
              :customStyle="{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '27rpx',
              }"></skeleton>
          </view>
        </block>
      </view>
      <view class="list">
        <block v-for="item in 4" :key="item">
          <skeleton
            :rows="1"
            :title="false"
            :rowsWidth="[167]"
            :rowsHeight="[232]"
            :loading="loading"
            :customStyle="{ display: 'flex', alignItems: 'center', marginBottom: '10rpx' }"></skeleton>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
// 首页骨架屏
import skeleton from '../skeleton.vue';
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    skeleton,
  },
};
</script>

<style lang="scss" scoped>
.home {
  .main {
    margin: 0 36rpx;
  }

  .search {
    width: 100%;
    height: 80rpx;
  }

  .meun {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20rpx;
  }

  .meun-2 {
    display: flex;
    flex-wrap: wrap;
  }

  .banner {
    display: flex;
    justify-content: space-between;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
