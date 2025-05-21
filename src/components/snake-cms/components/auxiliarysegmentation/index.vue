<template>
  <view class="auxiliarysegmentation">
    <view
      class="contan"
      :style="{
        height: $u.addUnit(datas.blankHeight),
        padding: datas.paddType === 0 ? '0px' : '0px 15px',
        backgroundColor: datas.bgColor,
      }">
      <view
        v-show="datas.segmentationtype === 1"
        style="height: 1px; width: 100%; border-top-width: 1px"
        :style="{
          'border-top-style': datas.bordertp,
          'border-top-color': datas.auxliarColor,
        }" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'auxiliarysegmentation',
  props: {
    datas: Object,
  },
};
</script>

<style scoped lang="scss">
.auxiliarysegmentation {
  .contan {
    width: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
