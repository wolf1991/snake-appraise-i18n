import { onShow } from '@dcloudio/uni-app';

/**
 * 设置页面标题的 composable
 * @param titleKey 语言配置中的 key，例如 'pages.main'
 */
export function usePageTitle(titleKey: string) {
  onShow(() => {
    // 使用全局的 uni.$t，不需要导入 useI18n
    uni.setNavigationBarTitle({
      title: uni.$t(titleKey as any),
    });
  });
}

