import appConfig from '@/config/config';
import { useUserStore } from '@/stores';
import { fromCode, processRequestParams } from './util';

/**
 * 请求拦截器
 */
export const requestInterceptors = () => {
  uni.$u.http.interceptors.request.use(
    (config) => {
      // 可使用async await 做异步操作
      // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
      config.data = config.data || {};

      if (!config.url.includes('cms') && !config.url.includes('v3')) {
        config.url = `/v3${config.url}`;
      }

      // 获取全局store中的userStore
      const userStore = useUserStore();

      // token的请求头
      if (userStore.userInfo?.token) {
        config.header.token = userStore.userInfo.token;
      }

      // 初始化接口参数，取出appid、timestamp和appSecret组成待签名参数
      const appid = fromCode(appConfig.a);
      const appSecret = fromCode(appConfig.b);
      config = processRequestParams(config, appid, appSecret);

      const skChannel = uni.getStorageSync('__SK_CHANNEL');

      // if (store.getters?.inviter) {
      //   config.header['snake-inviter'] = store.getters.inviter;
      // }

      // #ifdef H5
      config.header.appId = '202310111401';
      config.header.platform = 'h5';
      config.header['snake-channel'] = skChannel ? `h5_${skChannel}` : 'snake-h5';
      // #endif

      // #ifdef MP-WEIXIN
      config.header.appId = uni.getAccountInfoSync().miniProgram.appId;
      config.header.platform = 'wxma';
      config.header['snake-version'] = uni.getAccountInfoSync().miniProgram.version;
      config.header['snake-channel'] = skChannel ? `miniapp_${skChannel}` : 'miniapp';
      // #endif

      // #ifdef MP-ALIPAY
      config.header.appId = uni.getAccountInfoSync().miniProgram.appId;
      config.header.platform = 'alima';
      config.header['snake-channel'] = skChannel ? `alima_${skChannel}` : 'alima';
      // #endif

      // #ifdef APP-PLUS
      if (uni.$u.os() === 'ios') {
        config.header.platform = 'ios';
      }
      if (uni.$u.os() === 'android') {
        config.header.platform = 'android';
      }
      // #endif
      return config;
    },
    (config) => {
      console.error('请求拦截器发生错误:', config);
      // 可使用async await 做异步操作
      return Promise.reject(config);
    },
  );
};
