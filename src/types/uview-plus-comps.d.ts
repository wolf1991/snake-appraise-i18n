declare module 'vue' {
  export interface GlobalComponents {
    // 基础组件
    ['u-icon']: (typeof import('src/uni_modules/uview-plus/types/comps/icon'))['Icon'];
    ['u-image']: (typeof import('src/uni_modules/uview-plus/types/comps/image'))['Image'];
    ['u-button']: (typeof import('src/uni_modules/uview-plus/types/comps/button'))['Button'];
    ['u-text']: (typeof import('src/uni_modules/uview-plus/types/comps/text'))['Text'];
    ['u-row']: (typeof import('src/uni_modules/uview-plus/types/comps/row'))['Row'];
    ['u-col']: (typeof import('src/uni_modules/uview-plus/types/comps/col'))['Col'];
    ['u-cell']: (typeof import('src/uni_modules/uview-plus/types/comps/cell'))['Cell'];
    ['u-cell-group']: (typeof import('src/uni_modules/uview-plus/types/comps/cellGroup'))['CellGroup'];
    ['u-badge']: (typeof import('src/uni_modules/uview-plus/types/comps/badge'))['Badge'];
    ['u-tag']: (typeof import('src/uni_modules/uview-plus/types/comps/tag'))['Tag'];
    ['u-loading-icon']: (typeof import('src/uni_modules/uview-plus/types/comps/loadingIcon'))['LoadingIcon'];
    ['u-loading-page']: (typeof import('src/uni_modules/uview-plus/types/comps/loadingPage'))['LoadingPage'];

    // 表单组件
    ['u-form']: (typeof import('src/uni_modules/uview-plus/types/comps/form'))['Form'];
    ['u-form-item']: (typeof import('src/uni_modules/uview-plus/types/comps/formItem'))['FormItem'];
    ['u-calendar']: (typeof import('src/uni_modules/uview-plus/types/comps/calendar'))['Calendar'];
    ['u-keyboard']: (typeof import('src/uni_modules/uview-plus/types/comps/keyboard'))['Keyboard'];
    ['u-picker']: (typeof import('src/uni_modules/uview-plus/types/comps/picker'))['Picker'];
    ['u-datetime-picker']: (typeof import('src/uni_modules/uview-plus/types/comps/datetimePicker'))['DatetimePicker'];
    ['u-rate']: (typeof import('src/uni_modules/uview-plus/types/comps/rate'))['Rate'];
    ['u-search']: (typeof import('src/uni_modules/uview-plus/types/comps/search'))['Search'];
    ['u-number-box']: (typeof import('src/uni_modules/uview-plus/types/comps/numberBox'))['NumberBox'];
    ['u-upload']: (typeof import('src/uni_modules/uview-plus/types/comps/upload'))['Upload'];
    ['u-code']: (typeof import('src/uni_modules/uview-plus/types/comps/code'))['Code'];
    ['u-input']: (typeof import('src/uni_modules/uview-plus/types/comps/input'))['Input'];
    ['u-textarea']: (typeof import('src/uni_modules/uview-plus/types/comps/textarea'))['Textarea'];
    ['u-checkbox']: (typeof import('src/uni_modules/uview-plus/types/comps/checkbox'))['Checkbox'];
    ['u-checkbox-group']: (typeof import('src/uni_modules/uview-plus/types/comps/checkboxGroup'))['CheckboxGroup'];
    ['u-radio']: (typeof import('src/uni_modules/uview-plus/types/comps/radio'))['Radio'];
    ['u-radio-group']: (typeof import('src/uni_modules/uview-plus/types/comps/radioGroup'))['RadioGroup'];
    ['u-switch']: (typeof import('src/uni_modules/uview-plus/types/comps/switch'))['Switch'];
    ['u-slider']: (typeof import('src/uni_modules/uview-plus/types/comps/slider'))['Slider'];
    ['u-album']: (typeof import('src/uni_modules/uview-plus/types/comps/album'))['Album'];

    // 数据组件
    ['u-list']: (typeof import('src/uni_modules/uview-plus/types/comps/list'))['List'];
    ['u-list-item']: (typeof import('src/uni_modules/uview-plus/types/comps/listItem'))['ListItem'];
    ['u-line-progress']: (typeof import('src/uni_modules/uview-plus/types/comps/lineProgress'))['LineProgress'];
    ['u-count-down']: (typeof import('src/uni_modules/uview-plus/types/comps/countDown'))['CountDown'];
    ['u-count-to']: (typeof import('src/uni_modules/uview-plus/types/comps/countTo'))['CountTo'];

    // 反馈组件
    ['u-tooltip']: (typeof import('src/uni_modules/uview-plus/types/comps/tooltip'))['Tooltip'];
    ['u-action-sheet']: (typeof import('src/uni_modules/uview-plus/types/comps/actionSheet'))['ActionSheet'];
    ['u-alert']: (typeof import('src/uni_modules/uview-plus/types/comps/alert'))['Alert'];
    ['u-toast']: (typeof import('src/uni_modules/uview-plus/types/comps/toast'))['Toast'];
    ['u-notice-bar']: (typeof import('src/uni_modules/uview-plus/types/comps/noticeBar'))['NoticeBar'];
    ['u-notify']: (typeof import('src/uni_modules/uview-plus/types/comps/notify'))['Notify'];
    ['u-swipe-action']: (typeof import('src/uni_modules/uview-plus/types/comps/swipeAction'))['SwipeAction'];
    ['u-swipe-action-item']: (typeof import('src/uni_modules/uview-plus/types/comps/swipeActionItem'))['SwipeActionItem'];
    ['u-collapse']: (typeof import('src/uni_modules/uview-plus/types/comps/collapse'))['Collapse'];
    ['u-collapse-item']: (typeof import('src/uni_modules/uview-plus/types/comps/collapseItem'))['CollapseItem'];
    ['u-popup']: (typeof import('src/uni_modules/uview-plus/types/comps/popup'))['Popup'];
    ['u-modal']: (typeof import('src/uni_modules/uview-plus/types/comps/modal'))['Modal'];

    // 布局组件
    ['u-scroll-list']: (typeof import('src/uni_modules/uview-plus/types/comps/scrollList'))['ScrollList'];
    ['u-line']: (typeof import('src/uni_modules/uview-plus/types/comps/line'))['Line'];
    ['u-overlay']: (typeof import('src/uni_modules/uview-plus/types/comps/overlay'))['Overlay'];
    ['u-no-network']: (typeof import('src/uni_modules/uview-plus/types/comps/noNetwork'))['NoNetwork'];
    ['u-grid']: (typeof import('src/uni_modules/uview-plus/types/comps/grid'))['Grid'];
    ['u-grid-item']: (typeof import('src/uni_modules/uview-plus/types/comps/gridItem'))['GridItem'];
    ['u-swiper']: (typeof import('src/uni_modules/uview-plus/types/comps/swiper'))['Swiper'];
    ['u-skeleton']: (typeof import('src/uni_modules/uview-plus/types/comps/skeleton'))['Skeleton'];
    ['u-sticky']: (typeof import('src/uni_modules/uview-plus/types/comps/sticky'))['Sticky'];
    ['u-divider']: (typeof import('src/uni_modules/uview-plus/types/comps/divider'))['Divider'];

    // 导航组件
    ['u-tabbar']: (typeof import('src/uni_modules/uview-plus/types/comps/tabbar'))['Tabbar'];
    ['u-tabbar-item']: (typeof import('src/uni_modules/uview-plus/types/comps/tabbarItem'))['TabbarItem'];
    ['u-back-top']: (typeof import('src/uni_modules/uview-plus/types/comps/backTop'))['BackTop'];
    ['u-navbar']: (typeof import('src/uni_modules/uview-plus/types/comps/navbar'))['Navbar'];
    ['u-tabs']: (typeof import('src/uni_modules/uview-plus/types/comps/tabs'))['Tabs'];
    ['u-subsection']: (typeof import('src/uni_modules/uview-plus/types/comps/subsection'))['Subsection'];
    ['u-index-list']: (typeof import('src/uni_modules/uview-plus/types/comps/indexList'))['IndexList'];
    ['u-index-item']: (typeof import('src/uni_modules/uview-plus/types/comps/indexItem'))['IndexItem'];
    ['u-index-anchor']: (typeof import('src/uni_modules/uview-plus/types/comps/indexAnchor'))['IndexAnchor'];
    ['u-steps']: (typeof import('src/uni_modules/uview-plus/types/comps/steps'))['Steps'];
    ['u-steps-item']: (typeof import('src/uni_modules/uview-plus/types/comps/stepsItem'))['StepsItem'];
    ['u-empty']: (typeof import('src/uni_modules/uview-plus/types/comps/empty'))['Empty'];

    // 其他组件
    ['u-parse']: (typeof import('src/uni_modules/uview-plus/types/comps/parse'))['Parse'];
    ['u-code-input']: (typeof import('src/uni_modules/uview-plus/types/comps/codeInput'))['CodeInput'];
    ['u-loadmore']: (typeof import('src/uni_modules/uview-plus/types/comps/loadMore'))['LoadMore'];
    ['u-read-more']: (typeof import('src/uni_modules/uview-plus/types/comps/readMore'))['ReadMore'];
    ['u-gap']: (typeof import('src/uni_modules/uview-plus/types/comps/gap'))['Gap'];
    ['u-avatar']: (typeof import('src/uni_modules/uview-plus/types/comps/avatar'))['Avatar'];
    ['u-avatar-group']: (typeof import('src/uni_modules/uview-plus/types/comps/avatarGroup'))['AvatarGroup'];
    ['u-link']: (typeof import('src/uni_modules/uview-plus/types/comps/link'))['Link'];
    ['u-transition']: (typeof import('src/uni_modules/uview-plus/types/comps/transition'))['Transition'];
    ['u-status-bar']: (typeof import('src/uni_modules/uview-plus/types/comps/statusBar'))['StatusBar'];
    ['u-safe-bottom']: (typeof import('src/uni_modules/uview-plus/types/comps/safeBottom'))['SafeBottom'];
  }
}

export {};
