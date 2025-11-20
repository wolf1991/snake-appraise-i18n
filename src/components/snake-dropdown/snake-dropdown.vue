<template>
  <view class="snake-dropdown">
    <view class="snake-dropdown__menu" :style="{ height: $u.addUnit(height) }" ref="snake-dropdown__menu">
      <view
        class="snake-dropdown__menu__item"
        v-for="(item, index) in menuList"
        :key="index"
        @tap.stop="clickHandler(item, index)">
        <view class="snake-dropdown__menu__item__content" v-if="item.show">
          <text class="snake--dropdown__menu__item__content__text" :style="[index === current ? activeStyle : inactiveStyle]">
            {{ item.value || item.title }}
          </text>
          <view
            class="snake--dropdown__menu__item__content__arrow"
            :class="[index === current && 'snake--dropdown__menu__item__content__arrow--rotate']">
            <u-icon
              :name="index === current && isIconDown(item) ? 'arrow-up' : 'arrow-down'"
              :size="$u.addUnit(menuIconSize)"></u-icon>
          </view>
        </view>
      </view>
    </view>
    <view class="snake--dropdown__content">
      <slot />
    </view>
  </view>
</template>

<script>
/**
 * snake-dropdown
 * @description
 * @tutorial url
 * @property {String}
 * @event {Function}
 * @example
 */
export default {
  name: 'snake-dropdown',
  mixins: [uni.$u.mpMixin, uni.$u.mixin],
  props: {
    // 标题选中时的样式
    activeStyle: {
      type: [String, Object],
      default: () => ({
        color: '#2EBD7C',
        fontSize: '13px',
      }),
    },
    // 标题未选中时的样式
    inactiveStyle: {
      type: [String, Object],
      default: () => ({
        color: '#606266',
        fontSize: '13px',
      }),
    },
    // 点击遮罩是否关闭菜单
    closeOnClickMask: {
      type: Boolean,
      default: true,
    },
    // 点击当前激活项标题是否关闭菜单
    closeOnClickSelf: {
      type: Boolean,
      default: true,
    },
    // 过渡时间
    duration: {
      type: [Number, String],
      default: 300,
    },
    // 标题菜单的高度
    height: {
      type: [Number, String],
      default: 40,
    },
    // 是否显示下边框
    borderBottom: {
      type: Boolean,
      default: false,
    },
    // 标题的字体大小
    titleSize: {
      type: [Number, String],
      default: 13,
    },
    // 下拉出来的内容部分的圆角值
    borderRadius: {
      type: [Number, String],
      default: 0,
    },
    // 菜单右侧的icon图标
    menuIcon: {
      type: String,
      default: 'arrow-down',
    },
    // 菜单右侧图标的大小
    menuIconSize: {
      type: [Number, String],
      default: 14,
    },
  },
  data() {
    return {
      // 菜单数组
      menuList: [],
      current: 0,
      contentHeight: 0,
      contentStyle: {},
    };
  },
  computed: {
    isIconDown() {
      return (item) => {
        let bool = false;
        this.children.forEach((child) => {
          if (child.title === item.title) {
            bool = child.overlayShow;
          }
        });
        return bool;
      };
    },
  },
  created() {
    // 引用所有子组件(u-dropdown-item)的this，不能在data中声明变量，否则在微信小程序会造成循环引用而报错
    this.children = [];
  },
  methods: {
    // 点击菜单
    clickHandler(item, index) {
      this.children.forEach((child) => {
        if (child.title === item.title) {
          this.current = index;
          if (this.menuList[index].disabled) {
            child.$emit('change', index);
            return;
          }
          this.$emit('click', index, !child.overlayShow);
          child.overlayShow = !child.overlayShow;
          child.getContentHeight();
        } else {
          child.overlayShow = false;
        }
      });
    },
    updateData(newMenuList) {
      this.menuList = [];
      this.menuList = newMenuList;
    },
    // 关闭下拉弹窗
    close(index) {
      const child = this.children[index];
      child.overlayShow = false;
      this.$emit('close', index, false);
    },
  },
};
</script>

<style lang="scss" scoped>
.snake-dropdown {
  width: 100%;

  &__menu {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__item {
      width: 100%;
      display: flex;
      justify-content: center;

      &__content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 162rpx;
        height: 56rpx;
        background: #fafafa;

        &__text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
