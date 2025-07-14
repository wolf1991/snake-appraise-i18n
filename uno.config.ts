// uno.config.ts
import { info } from 'console';
import {
  defineConfig,
  presetUno,
  presetAttributify,
  // presetIcons,
  transformerDirectives,
  transformerVariantGroup,
  Preset,
} from 'unocss';

import { presetApplet, presetRemRpx, transformerAttributify } from 'unocss-applet';

// @see https://unocss.dev/presets/legacy-compat
// import { presetLegacyCompat } from '@unocss/preset-legacy-compat'

// 判断是否是小程序
const isMp = process.env?.UNI_PLATFORM?.startsWith('mp') ?? false;

const presets: Preset[] = [];

if (isMp) {
  // 使用小程序预设
  presets.push(
    // 小程序用官方预设
    presetApplet(),
    // 小程序用 rpx 预设
    presetRemRpx(),
  );
} else {
  presets.push(
    // 非小程序用官方预设
    presetUno(),
    // 支持css class属性化
    presetAttributify(),
  );
}
export default defineConfig({
  // presets 是预设
  presets: [
    ...presets,
    // 支持图标，需要搭配图标库，eg: @iconify-json/carbon, 使用 `<button class="i-carbon-sun dark:i-carbon-moon" />`
    // presetIcons({
    //   scale: 1.2,
    //   warn: true,
    //   extraProperties: {
    //     display: 'inline-block',
    //     'vertical-align': 'middle',
    //   },
    // }),
    // 将颜色函数 (rgb()和hsl()) 从空格分隔转换为逗号分隔，更好的兼容性app端，example：
    // `rgb(255 0 0)` -> `rgb(255, 0, 0)`
    // `rgba(255 0 0 / 0.5)` -> `rgba(255, 0, 0, 0.5)`
    // 与群友的正常写法冲突，先去掉！（2024-05-25）
    // presetLegacyCompat({
    //   commaStyleColorFunction: true,
    // }) as Preset,
  ],
  // transformers 是转换器
  transformers: [
    // 启用 @apply 功能
    transformerDirectives(),
    // 启用 () 分组功能
    // 支持css class组合，eg: `<div class="hover:(bg-gray-400 font-medium) font-(light mono)">测试 unocss</div>`
    transformerVariantGroup(),
    // 请勿更改以下顺序
    transformerAttributify({
      // 解决与第三方框架样式冲突问题
      prefixedOnly: true,
      prefix: 'snake',
    }),
  ],
  /**
   * 自定义快捷语句
   * 具体使用方法，在需要使用到 flex justify-center items-center 这个几个类名时，只需要写一个 flex-center 即可
   * @see https://github.com/unocss/unocss#shortcuts
   */
  shortcuts: [
    { 'flex-center': 'flex justify-center items-center' },
    { 'flex-col-center': 'flex flex-col justify-center items-center' },
    { 'flex-items-center': 'flex items-center' },
  ],
  // rules 的作用是：在全局范围内添加自定义规则
  // 下面的配置适用于有安全区域的设备（如 iPhone X 上的刘海屏）
  // 具体使用也很简单，在需要使用安全区域的元素上添加 p-safe 类名即可
  rules: [
    [
      'p-safe',
      {
        padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
  theme: {
    colors: {
      primary: '#0f1113',
      info: '#909399',
      green: '#06d290',
    },
  },
});

/**
 * 最终这一套组合下来会得到：
 * mp 里面：mt-4 => margin-top: 32rpx  == 16px
 * h5 里面：mt-4 => margin-top: 1rem == 16px
 *
 * 如果是传统方式写样式，则推荐设计稿设置为 750，这样设计稿1px，代码写1rpx。
 * rpx是响应式的，可以让不同设备的屏幕显示效果保持一致。
 */
