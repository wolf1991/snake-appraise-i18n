<template>
  <u-popup :show="show" type="bottom" round="12rpx" @close="close">
    <view class="flex-center h-90rpx pos-relative">
      <text>请选择</text>
      <view class="pos-absolute right-20rpx" @click="close">
        <u-icon name="close" bold size="28rpx"></u-icon>
      </view>
    </view>
    <u-search
      v-if="filterable"
      v-model="filterVal"
      :showAction="false"
      placeholder="搜索"
      margin="20rpx"
      @search="searchHandle"
      @clear="searchHandle"></u-search>

    <scroll-view scroll-y @scrolltolower="emit('scrolltolower', $event)" class="max-h-712rpx h-712rpx px-20rpx">
      <u-radio-group placement="column" @change="handleChange">
        <view v-for="(item, index) in filterColumns" :key="index" :id="'radio' + item[valueKey]">
          <u-radio
            :customStyle="{ margin: '10rpx 0' }"
            :label="item[labelKey]"
            :name="item[valueKey]"
            :disabled="item.disabled"></u-radio>
        </view>
      </u-radio-group>
    </scroll-view>
    <view class="py-20rpx px-24rpx">
      <u-button type="primary" @click="onConfirm">确定</u-button>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';

defineOptions({
  name: 'snake-select-picker',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
});
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
  /** 选项对象中，展示的文本对应的 key */
  labelKey: {
    type: String,
    default: 'label',
  },
  /** 选项对象中，value 对应的 key */
  valueKey: {
    type: String,
    default: 'value',
  },
  /** 可搜索 */
  filterable: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['search', 'update:searchValue', 'scrolltolower', 'change', 'confirm', 'update:modelValue', 'close']);

const selectValue = ref('');
const filterVal = ref('');
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

const searchHandle = () => {
  emit('update:searchValue', filterVal.value);
  emit('search', filterVal.value);
};
</script>

<style lang="scss" scoped>
::v-deep .u-radio__label-wrap {
  width: 100%;
}
</style>
