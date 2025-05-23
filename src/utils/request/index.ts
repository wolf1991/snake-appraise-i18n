import { setConfig } from './util';

// 引入拦截器配置
import { requestInterceptors } from './requestInterceptors';
import { responseInterceptors } from './responseInterceptors';

const initRequest = () => {
  // 初始化请求配置
  setConfig();

  requestInterceptors();
  responseInterceptors();
};
export { initRequest };
