export const dorpMenuItemProps = {
  /**
   * 当前选中项对应选中的 value
   */
  modelValue: [String, Number],
  /**
   * 列表数据，对应数据结构 [{text: '标题', value: '0', tip: '提示文字'}]
   */
  options: {
    type: Array,
    default: () => [],
  },
  /**
   * 禁用菜单
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 选中的图标名称(可选名称在 u-icon 组件中)
   */
  iconName: {
    type: String,
    default: 'check',
  },
  /**
   * 菜单标题
   */
  title: String,
  /**
   * 菜单图标
   */
  icon: {
    type: String,
    default: 'arrow-down',
  },
  /**
   * 菜单图标大小
   */
  iconSize: {
    type: String,
    default: '14px',
  },
  /**
   * 自定义点击事件
   */
  beforeToggle: Function,
  /**
   * 选项对象中，value 对应的 key
   */
  valueKey: {
    type: String,
    default: 'value',
  },
  /**
   * 选项对象中，展示的文本对应的 key
   */
  labelKey: {
    type: String,
    default: 'label',
  },
  /**
   * 选项对象中，选项说明对应的 key
   */
  tipKey: {
    type: String,
    default: 'tip',
  },
};
