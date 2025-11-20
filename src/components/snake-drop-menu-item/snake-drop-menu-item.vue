<template>
  <view
    v-if="showWrapper"
    class="drop-item"
    :style="`pointer-events: none; z-index: ${zIndex}; ${positionStyle};`"
    @touchmove.stop.prevent="() => {}">
    <u-popup :show="showPopup" mode="top" :duration="duration" :overlay="false" :closeOnClickOverlay="false" :z-index="zIndex">
      <view v-if="options.length">
        <view
          v-for="(item, index) in options"
          :key="index"
          @click="choose(index)"
          :class="`drop-item__option ${(item[valueKey] !== '' ? item[valueKey] : item) === modelValue ? 'is-active' : ''}`">
          <view class="drop-item__title">
            <text>{{ item[labelKey] ? item[labelKey] : item }}</text>
            <text v-if="item[tipKey]" class="drop-item__tip">{{ item[tipKey] }}</text>
          </view>
          <!-- <u-icon
            v-if="(item[valueKey] !== '' ? item[valueKey] : item) === modelValue"
            :name="iconName"
            size="20px"
            class="drop-item__icon" /> -->
        </view>
      </view>
      <slot v-else />
    </u-popup>
  </view>
</template>

<script lang="ts">
export default {
  name: 'snake-drop-menu-item',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
};
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { dorpMenuItemProps } from './props';
import { useParent } from '../composables/useParent';
import { DROP_MENU_KEY } from '../snake-drop-menu/props';

const props = defineProps(dorpMenuItemProps);
const emit = defineEmits(['update:modelValue', 'change', 'open', 'close']);

const zIndex = ref(12);
const showWrapper = ref<boolean>(false);
const showPopup = ref(false);
const duration = ref<number>(0);

const { parent: dropMenu } = useParent(DROP_MENU_KEY);

const positionStyle = computed(() => {
  let style: string = '';
  if (showWrapper.value && dropMenu) {
    style = `top: calc(var(--window-top) + ${dropMenu.offset.value}px); bottom: 0;`;
  } else {
    style = '';
  }
  return style;
});

function getShowPop() {
  return showPopup.value;
}

// 模拟单选操作 默认根据 value 选中操作
function choose(index: number) {
  if (props.disabled) return;
  const { valueKey } = props;
  const item = props.options[index];
  const newValue = item[valueKey] !== undefined ? item[valueKey] : item;
  emit('update:modelValue', newValue);
  emit('change', {
    value: newValue,
    selectedItem: item,
  });
  close();
}

// 外部关闭弹出框
function close() {
  if (!showPopup.value) {
    return;
  }
  if (uni.$u.test.func(props.beforeToggle)) {
    props.beforeToggle({
      status: true,
      resolve: (isPass) => {
        isPass && handleClose();
      },
    });
  } else {
    handleClose();
  }
}

function handleClose() {
  if (showPopup.value) {
    showPopup.value = false;
    emit('close');
    setTimeout(() => {
      showWrapper.value = false;
    }, duration.value);
  }
}

function open() {
  if (showPopup.value) {
    return;
  }
  if (uni.$u.test.func(props.beforeToggle)) {
    props.beforeToggle({
      status: true,
      resolve: (isPass) => {
        isPass && handleOpen();
      },
    });
  } else {
    handleOpen();
  }
}

function handleOpen() {
  showWrapper.value = true;
  showPopup.value = true;
  if (dropMenu) {
    duration.value = Number(dropMenu.props.duration);
  }
  emit('open');
}

function toggle() {
  if (showPopup.value) {
    close();
  } else {
    open();
  }
}

defineExpose({ getShowPop, open, close, toggle });
</script>

<style lang="scss" scoped>
::v-deep .u-transition {
  position: absolute !important;
  max-height: 80%;
  overflow-y: auto;
  pointer-events: auto;
  background-color: #fff;
}

.drop-item {
  position: fixed;
  right: 0;
  left: 0;
  overflow: hidden;
  font-size: 28rpx;
  width: 100%;
  z-index: 101;

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 96rpx;
    line-height: 96rpx;
    padding: 0 30rpx;
    transition: color 0.2s;

    &.is-active {
      color: $u-primary;
    }
  }

  &__title {
    display: block;
  }

  &__tip {
    display: inline-block;
    color: rgba(0, 0, 0, 0.45);
    font-size: 24rpx;
    margin-left: 4rpx;
  }
}
</style>
