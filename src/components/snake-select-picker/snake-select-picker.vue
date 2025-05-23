<template>
  <u-popup :show="show" type="bottom" @close="close">
    <view class="flex-center h-90rpx pos-relative">
      <text>请选择</text>
      <view class="pos-absolute right-20rpx" @click="close">
        <u-icon name="close" bold size="28rpx"></u-icon>
      </view>
    </view>
    <scroll-view scroll-y class="max-h-712rpx min-h-300rpx px-20rpx">
      <u-radio-group placement="column" @change="handleChange">
        <u-radio
          v-for="(item, index) in filterColumns"
          :key="index"
          :customStyle="{ marginBottom: '8px' }"
          :label="item[labelKey]"
          :name="item[valueKey]"></u-radio>
      </u-radio-group>
    </scroll-view>
    <view class="py-20rpx px-24rpx">
      <u-button type="primary" @click="onConfirm">确定</u-button>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  open: {
    type: Function,
    default: () => {},
  },
  modelValue: {
    type: String,
    default: () => '',
  },
  /** 选择器数据，一维数组 */
  columns: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  /** 选项对象中，value 对应的 key */
  valueKey: {
    type: String,
    default: 'value',
  },
  /** 选项对象中，展示的文本对应的 key */
  labelKey: {
    type: String,
    default: 'label',
  },
});
const emit = defineEmits(['change', 'confirm', 'update:modelValue', 'close']);

const selectValue = ref('');
const filterColumns = ref<Array<Record<string, any>>>([]);

watch(
  () => props.columns,
  (newValue) => {
    filterColumns.value = newValue;
  },
  {
    deep: true,
    immediate: true,
  },
);

function handleChange(e) {
  selectValue.value = e;
  emit('change', { value: e });
}

function close() {
  emit('close');
}

function onConfirm() {
  emit('update:modelValue', selectValue.value);
  emit('confirm', {
    value: selectValue.value,
    selectedItems: filterColumns.value.filter((item) => selectValue.value.includes(item[props.valueKey])),
  });
}
</script>

<style lang="scss" scoped>
::v-deep .u-radio__label-wrap {
  width: 100%;
}
</style>
