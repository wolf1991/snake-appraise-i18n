import { useUserStore } from '@/stores';

import { postRefreshToken } from '@/api/user';

// 是否正在刷新token的标记
let isRefreshing = false;
// 重试请求队列
let requests = [];
// 最大重试次数
const MAX_RETRY = 3;
// 重试次数
let retryCount = 0;

/**
 * 响应拦截器
 */
export const responseInterceptors = () => {
  uni.$u.http.interceptors.response.use(
    (response) => {
      /* 对响应成功做点什么 可使用async await 做异步操作 */
      const data = response.data;

      return data || {};
    },
    (response) => {
      // 请求错误做点什么。可以使用async await 做异步操作
      console.log('err-response', response);

      /* 对响应错误做点什么 （statusCode !== 200） */
      // 401
      if (response.statusCode === 401) {
        return handleUnauthorizedError(response);
      }

      // 通用的错误码
      handleCommonErrors(response);

      return Promise.reject(response.data);
    },
  );
};

const handleUnauthorizedError = async (response) => {
  const userStore = useUserStore();

  // 检查是否存在刷新令牌
  if (!userStore.userInfo?.refreshToken) {
    redirectToLogin();
    return;
  }

  // 检查是否正在刷新令牌
  if (!isRefreshing) {
    // 检查是否可以重试
    if (!canRetry()) {
      userStore.clearUserInfo();
      redirectToLogin();
      return;
    }

    // 正在刷新
    isRefreshing = true;

    try {
      // 带上refresh_token拿到token 并替换现有token
      const refreshSuccess = await refreshTokenHandle(userStore.userInfo?.refreshToken, userStore);
      if (!refreshSuccess) {
        // 刷新token无效 清空请求队列
        requests = [];
        // 刷新失败，拒绝请求
        isRefreshing = false;
        return Promise.reject(response);
      }
      // 执行请求列表
      requests.forEach(async ({ fn, resolve }) => {
        // 逐个按请求队列顺序重新发起请求
        const res = await fn();
        resolve(res);
      });
      // 清空请求队列
      requests = [];
      // 还原标识
      isRefreshing = false;
      return uni.$u.http.request(response.config);
    } catch (error) {
      isRefreshing = false;
      return Promise.reject(response);
    }
  } else {
    // 同时并发出现的请求 新的token没回来之前 先用promise 存入等待队列中
    return new Promise((resolve) => {
      const fn = () => Promise.resolve(uni.$u.http.request(response.config));
      requests.push({
        fn,
        resolve,
      });
    });
  }
};

/**
 * 刷新token
 * @param {string} refreshToken - 刷新token
 */
const refreshTokenHandle = async (refreshToken = '', userStore) => {
  try {
    const response = await postRefreshToken({
      refreshToken,
    });
    if (response.success) {
      userStore.setUserInfo({
        ...response.data,
        token: response.token,
      });
      return true;
    }
    // 刷新失败，清除用户信息并跳转登录
    userStore.clearUserInfo();
    redirectToLogin();
    return false;
  } catch (error) {
    // TODO handle the exception
    userStore.clearUserInfo();
    redirectToLogin();
    return false;
  }
};

/**
 * 处理常见的HTTP错误响应
 *
 * @param response HTTP响应对象
 */
const handleCommonErrors = (response) => {
  const errorMap = {
    400: '请求参数错误',
    403: '没有访问权限',
    404: '资源不存在',
    500: response.data?.msg || '服务器错误',
    502: '网关错误',
    504: '网关超时',
  };

  if (errorMap[response.statusCode]) {
    uni.$u.toast(errorMap[response.statusCode]);
  }

  if (response.errMsg.includes('timeout') || response.errMsg.includes('超时')) {
    uni.$u.toast('请求超时，请稍后重试');
  }
};

/**
 * 判断是否可以重试
 *
 * @returns {boolean} 如果重试次数小于最大重试次数，则返回true，否则返回false
 */
const canRetry = () => {
  return retryCount++ < MAX_RETRY;
};

/**
 * 跳转到登录页面
 */
const redirectToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/oauth',
  });
};
