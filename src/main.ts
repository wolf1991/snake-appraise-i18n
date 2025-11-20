import { createSSRApp } from 'vue';
import App from './App.vue';

// style
import 'virtual:uno.css';
import '@/styles/index.scss';

// 引入全局uview-plus
import uviewPlus from '@/uni_modules/uview-plus';
// 引入pinia状态管理库
import pinia from './stores';
// 引入路由拦截器
import { routeInterceptor } from './interceptors';
// 引入全局方法
import utils from '@/utils';
// 引入请求封装库
import { initRequest } from '@/utils/request/index';
// 友盟统计
import uma from '@/utils/uma';
// 国际化
import { setupI18n } from '@/locales';

// 引入uview-plus对小程序分享的mixin封装
// eslint-disable-next-line import/no-named-as-default
import mpShare from '@/uni_modules/uview-plus/libs/mixin/mpShare';

export function createApp() {
  const app = createSSRApp(App);

  app.use(uviewPlus);
  app.use(pinia);
  app.use(routeInterceptor);
  app.use(initRequest);
  setupI18n(app); // setupI18n 内部已挂载 uni.$t

  // 全局方法挂载到uni对象上
  // uni.$u.config.unit = 'rpx';
  uni.$u.props.image.bgColor = 'transparent';

  uni.$u = {
    ...uni.$u,
    ...utils,
  };
  uni.$uma = uma;

  // #ifdef MP
  app.mixin(mpShare);
  // #endif

  return {
    app,
  };
}
