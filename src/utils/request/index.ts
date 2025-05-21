import { setConfog } from './util';

// 引入拦截器配置
import { requestInterceptors } from './requestInterceptors';
import { responseInterceptors } from './responseInterceptors';

const initRequest = () => {
  // 初始化请求配置
  setConfog();

  requestInterceptors();
  responseInterceptors();
};
export { initRequest };
