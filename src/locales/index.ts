import { createI18n } from 'vue-i18n';
import type { App } from 'vue';

import zhCN from './zh-CN';
import enUS from './en-US';
import ruRU from './ru-RU';

export type Locale = 'zh-CN' | 'en-US' | 'ru-RU';
export type MessageSchema = typeof zhCN;

export const SUPPORTED_LOCALES: Array<{ label: string; value: Locale }> = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
  { label: 'Русский', value: 'ru-RU' },
];

const isSupportedLocale = (locale?: string): locale is Locale =>
  !!locale && SUPPORTED_LOCALES.some((item) => item.value === locale);

const resolveLocale = (locale?: string, fallback: Locale = 'zh-CN'): Locale =>
  isSupportedLocale(locale) ? locale : fallback;

const ENV_DEFAULT_LOCALE = import.meta.env?.VITE_DEFAULT_LOCALE;
const ENV_FALLBACK_LOCALE = import.meta.env?.VITE_FALLBACK_LOCALE;

export const DEFAULT_LOCALE: Locale = resolveLocale(ENV_DEFAULT_LOCALE, 'zh-CN');
const FALLBACK_LOCALE: Locale = resolveLocale(ENV_FALLBACK_LOCALE, DEFAULT_LOCALE);
const STORAGE_KEY = '__SNAKE_LOCALE__';

// 是否在编译时指定了默认语言
const IS_ENV_LOCALE_FORCED = !!ENV_DEFAULT_LOCALE && isSupportedLocale(ENV_DEFAULT_LOCALE);

const getInitialLocale = (): Locale => {
  // 优先级1: 环境变量 VITE_DEFAULT_LOCALE 指定的语言（编译时指定，优先级最高）
  // 如果编译时指定了语言，强制使用该语言，忽略本地存储
  if (ENV_DEFAULT_LOCALE && isSupportedLocale(ENV_DEFAULT_LOCALE)) {
    return ENV_DEFAULT_LOCALE;
  }

  // 优先级2: 用户之前选择的语言（本地存储）
  const cached = uni.getStorageSync(STORAGE_KEY) as Locale;
  if (cached && SUPPORTED_LOCALES.some((item) => item.value === cached)) {
    return cached;
  }

  // 优先级3: 系统语言
  const systemLocale = (uni.getLocale && (uni.getLocale() as Locale)) || DEFAULT_LOCALE;
  const matched = SUPPORTED_LOCALES.find((item) => systemLocale.startsWith(item.value.split('-')[0]));

  // 优先级4: 默认语言（如果没有设置环境变量，则使用 zh-CN）
  return matched?.value || DEFAULT_LOCALE;
};

const messages: Record<Locale, MessageSchema> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ru-RU': ruRU,
};

export const i18n = createI18n<[MessageSchema], Locale>({
  legacy: false,
  globalInjection: true,
  locale: getInitialLocale(),
  fallbackLocale: FALLBACK_LOCALE,
  messages,
});

export const setupI18n = (app: App) => {
  app.use(i18n);
  // 挂载到 uni 对象上，方便在非 Vue 组件中使用
  (uni as any).$t = i18n.global.t;
  // globalInjection: true 已经启用了全局注入，模板中可以直接使用 $t

  // 修改 tabBar 文字：应用初始化后根据当前语言更新 tabBar 显示文字
  // updateTabBarText 内部已实现重试机制，无需延迟调用
  updateTabBarText();

  return i18n;
};

/**
 * 更新 tabBar 文字以支持国际化
 * 修改 tabBar 文字：根据当前语言设置动态更新 tabBar 的显示文字
 * 使用重试机制确保在实机上的可靠性
 */
export const updateTabBarText = (retryCount = 0, maxRetries = 5) => {
  // 重试逻辑
  const retry = () => {
    if (retryCount < maxRetries) {
      const delay = Math.min(1000, 100 * Math.pow(2, retryCount));
      console.log(`Retrying tabBar update in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
      setTimeout(() => updateTabBarText(retryCount + 1, maxRetries), delay);
    }
  };

  try {
    // 设置第一个 tabBar（鉴别）
    uni.setTabBarItem({
      index: 0,
      text: i18n.global.t('pages.main'),
      success: () => {
        // 设置第二个 tabBar（我的）
        uni.setTabBarItem({
          index: 1,
          text: i18n.global.t('pages.user'),
          success: () => console.log('TabBar text updated successfully'),
          fail: retry,
        });
      },
      fail: retry,
    });
  } catch (error) {
    console.warn('Failed to update tabBar text:', error);
    retry();
  }
};

export const setLocale = (locale: Locale) => {
  if (!SUPPORTED_LOCALES.some((item) => item.value === locale)) {
    return;
  }

  // 如果编译时强制指定了语言（VITE_DEFAULT_LOCALE），不允许用户切换
  if (IS_ENV_LOCALE_FORCED) {
    console.warn(`Language is forced to ${ENV_DEFAULT_LOCALE} by VITE_DEFAULT_LOCALE, cannot change to ${locale}`);
    return;
  }

  (i18n.global.locale as unknown as { value: Locale }).value = locale;
  uni.setLocale(locale);
  uni.setStorageSync(STORAGE_KEY, locale);

  // 修改 tabBar 文字：语言切换后更新 tabBar 显示文字
  updateTabBarText();
};

export const getLocale = () => (i18n.global.locale as unknown as { value: Locale }).value as Locale;

