export const DROP_MENU_KEY = Symbol('snake-drop-menu');

export const dorpMenuProps = {
  /**
   * 弹框层级
   */
  zIndex: {
    type: Number,
    default: 12,
  },
  /**
   * 是否展示蒙层
   */
  modal: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否点击蒙层时关闭
   */
  closeOnClickModal: {
    type: Boolean,
    default: true,
  },
  /**
   * 菜单展开收起动画时间，单位 ms
   */
  duration: {
    type: Number,
    default: 200,
  },
  customStyle: {
    type: String,
    default() {
      return '';
    },
  },
};
