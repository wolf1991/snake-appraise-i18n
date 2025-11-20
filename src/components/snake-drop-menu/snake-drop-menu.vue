<template>
  <view class="drop-menu" :style="customStyle" @click.stop.prevent="noop" @touchmove.stop.prevent="noop" :id="dropMenuId">
    <u-overlay
      :show="overlayVisible"
      :duration="duration"
      :z-index="12"
      :custom-style="modalStyle"
      @click="handleClickOverlay"
      @touchmove="noop" />

    <view class="drop-menu__list">
      <view
        v-for="(child, index) in children"
        :key="index"
        @click="toggle(child)"
        :class="`drop-menu__item ${child.disabled ? 'is-disabled' : ''} ${child.$.exposed!.getShowPop() ? 'is-active' : ''}`">
        <view class="drop-menu__item-title">
          <view class="drop-menu__item-title-text">{{ getDisplayTitle(child) }}</view>
          <view class="drop-menu__arrow">
            <u-icon :name="child.icon" :size="child.iconSize" customStyle="line-height: unset !important;" />
          </view>
        </view>
      </view>
    </view>
    <slot></slot>
  </view>
</template>

<script lang="ts">
export default {
  name: 'snake-drop-menu',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
};
</script>

<script setup lang="ts">
import { getRect } from '@/utils';
import { dorpMenuProps, DROP_MENU_KEY } from './props';
import { useChildren } from '../composables/useChildren';
import { computed, onBeforeMount, ref, watch } from 'vue';

const $u = uni.$u;

const props = defineProps(dorpMenuProps);

const emit = defineEmits([]);

const dropMenuId = ref(`dropMenuId${uni.$u.guid(16)}`);
const offset = ref(0);
const windowHeight = ref(0);
const overlayVisible = ref(false);
let overlayTimer: ReturnType<typeof setTimeout> | null;

const { linkChildren, children } = useChildren(DROP_MENU_KEY);

linkChildren({ props, fold, offset });

const showOverlay = computed(() => {
  return children.some((child) => child.$.exposed!.getShowPop());
});

const modalStyle = computed(() => {
  return `top: calc(var(--window-top) + ${offset.value}px); bottom: 0;`;
});

// 延迟关闭遮罩层，避免闪烁
// 小程序中，即使先 fold 再 closeOther 也会有闪烁，使用延迟关闭遮罩层处理
watch(showOverlay, (newVal) => {
  if (overlayTimer) {
    clearTimeout(overlayTimer);
  }
  if (newVal) {
    overlayVisible.value = true;
  } else {
    overlayTimer = setTimeout(() => {
      overlayVisible.value = false;
      overlayTimer = null;
    }, 16);
  }
});

function noop() {}

function getDisplayTitle(child: any) {
  const { title, modelValue, options, valueKey, labelKey } = child;

  if (title) {
    return title;
  }
  for (let i = 0, len = options.length; i < len; i++) {
    if (modelValue === options[i][valueKey]) {
      return options[i][labelKey];
    }
  }
  console.error('选项选项中没有匹配的值');
}

function toggle(child: any) {
  // 点击当前 menu, 关闭其他 menu
  if (child && !child.disabled) {
    children.forEach((item) => {
      if (item.$.uid !== child.$.uid) {
        item.$.exposed.close();
      }
    });
    fold(child);
  }
}

/**
 * 控制菜单内容是否展开
 */
function fold(child: any) {
  getRect(`#${dropMenuId.value}`, false).then((rect: { bottom: number }) => {
    if (!rect) return;
    offset.value = Number(rect.bottom);
    child.$.exposed!.toggle();
  });
}

function updateDropMenuRect() {
  getRect(`#${dropMenuId.value}`, false).then((rect: { bottom: number }) => {
    if (!rect) return;
    offset.value = Number(rect.bottom);
  });
}

function handleClickOverlay() {
  if (props.closeOnClickModal) {
    // 关闭所有打开的菜单项
    children.forEach((child) => {
      child.$.exposed!.close();
    });
  }
}

onBeforeMount(() => {
  windowHeight.value = uni.getSystemInfoSync().windowHeight;
});
defineExpose({ colseAll: handleClickOverlay, updateDropMenuRect });
</script>

<style lang="scss" scoped>
.drop-menu {
  font-size: 28rpx;
  color: #262626;
  box-sizing: border-box;
  position: relative;

  &__list {
    display: flex;
    text-align: center;
    background-color: #fff;
  }
  &__item {
    flex: 1;
    min-width: 0;
    height: 96rpx;
    line-height: 96rpx;
    text-align: center;

    &.is-active {
      font-weight: 500%;
      color: $u-primary;

      .drop-menu__arrow {
        transform: scale(0.8) rotate(-180deg);
        transform-origin: center center;
      }
    }
    &.is-disabled {
    }

    &-title {
      position: relative;
      display: inline-block;
      max-width: 100%;
      padding: 0 30rpx;
      box-sizing: border-box;

      &-text {
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  &__arrow {
    position: absolute;
    display: inline-block;
    top: 0;
    right: -4px;
    transition: transform 0.3s;
    transform: scale(0.8);
    font-size: 28rpx;
  }
}
</style>
