<template>
  <view class="snake-dropdown-item">
    <uv-overlay :customStyle="overlayStyle" :show="overlayShow" :zIndex="-2" @click="overlayClick"></uv-overlay>
    <uv-transition :show="overlayShow" mode="slide-down" :duration="200" :custom-style="overlayStyle" @click="overlayClick">
      <view class="snake-dropdown-item__content" :style="{ height: `${contentHeight}` }">
        <slot />
      </view>
    </uv-transition>
  </view>
</template>

<script>
/**
 * u-dropdownitem
 * @description
 * @tutorial url
 * @property {String}
 * @event {Function}
 * @example
 */
export default {
  name: 'u-dropdown-item',
  mixins: [uni.$u.mpMixin, uni.$u.mixin],
  props: {
    // 当前选中项的value值
    value: {
      type: [Number, String, Array],
      default: '',
    },
    // 菜单项标题
    title: {
      type: [String, Number],
      default: '',
    },
    // 是否禁用此菜单项
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否显示
    show: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      overlayShow: false,
      contentHeight: 'auto',
      rect: {},
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    // 发生变化时，需要去更新父组件对应的值
    dataChange(newValue, oldValue) {
      this.updateParentData();
    },
    overlayShow(newval) {
      if (!newval) {
        this.contentHeight = 'auto';
      }
    },
  },
  computed: {
    overlayStyle() {
      let { top = 0 } = this.rect;
      // #ifdef H5
      top += uni.getSystemInfoSync().windowTop;
      // #endif
      const style = {
        position: 'fixed',
        top: `${top}px`,
        left: 0,
        right: 0,
        zIndex: 9,
        bottom: 0,
      };
      return this.$u.deepMerge(style, this.$u.addStyle(this.customStyle));
    },
    // 监听对应变量的变化
    dataChange() {
      return [this.title, this.disabled, this.value, this.show];
    },
  },
  methods: {
    init() {
      this.updateParentData();
    },
    // 获取下拉菜单内容的高度
    getContentHeight() {
      this.$nextTick(async () => {
        await this.$u.sleep(20);
        const size = await this.$uGetRect('.snake--dropdown-item');
        this.rect = size;
        this.contentHeight = 'auto';
      });
    },
    // 更新父组件所需的数据
    updateParentData() {
      // 获取父组件u-dropdown
      this.getParentData('snake-dropdown');
      if (!this.parent) {
        console.error('snake-dropdown-item必须配合u-dropdown使用');
      }
      // 查找父组件menuList数组中对应的标题数据
      const menuIndex = this.parent.menuList.findIndex((item) => item.title === this.title);
      const menuContent = {
        title: this.title,
        disabled: this.disabled,
        value: this.value,
        show: this.show,
      };
      if (menuIndex >= 0) {
        // 如果能找到，则直接修改
        this.parent.menuList[menuIndex] = menuContent;
      } else {
        // 如果无法找到，则为第一次添加，直接push即可
        this.parent.menuList.push(menuContent);
      }
      this.parent.updateData(this.parent.menuList);
    },
    // 点击遮罩
    overlayClick() {
      this.overlayShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.snake-dropdown-item {
  &__content {
    /* #ifndef APP-NVUE */
    overflow: hidden;
    transition: all 0.15s;
    /* #endif */
    color: #000;
    background-color: #ffffff;
    // 骗系统开启硬件加速
    transform: transition3d(0, 0, 0);
  }
}
</style>
