<template>
  <view class="richtext">
    <u-parse :content="datas.myValue"></u-parse>
  </view>
</template>

<script>
export default {
  name: 'richtext',
  props: {
    datas: {
      type: [Object, null],
      default() {
        return {};
      },
    },
  },
};
</script>

<style>
.richtext {
  padding: 0 20rpx;
}
</style>
