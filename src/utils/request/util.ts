// 引入配置
import config from '@/config/config';
import md5 from '@/utils/js/md5';

// 设置全局配置
export function setConfig() {
  uni.$u.http.setConfig((defaultConfig) => {
    /* defaultConfig 为默认全局配置 */
    defaultConfig.baseURL = `${getBaseUrl()}`; /* 根域名 */
    // #ifdef H5
    if (import.meta.env.VITE_USER_NODE_ENV === 'development') {
      defaultConfig.baseURL = '/api';
    }
    // #endif

    defaultConfig.timeout = 10000; // 超时时间设置为10秒;
    defaultConfig.header['Content-Type'] = 'application/json';

    return defaultConfig;
  });
}

// 获取baseURL
export function getBaseUrl() {
  const storedBaseUrl = uni.getStorageSync('BASE_URL') || '';
  return storedBaseUrl || config.baseUrl;
}

// 判断是否为生产环境的域名
export function getIsProd() {
  const baseUrl = getBaseUrl();
  return baseUrl.includes('puresnake');
}
// 判断是否为生产环境的域名
export const isProd = getIsProd();

/**
 * 生成签名
 * @param {Object} params 请求参数
 * @param {string} appSecret 应用密钥
 * @returns {string} 签名
 */
export function generateSignature(params, appSecret, method) {
  let sstemp = `appid=${params.appid}&timestamp=${params.timestamp}&body=${params.body}&appSecret=${appSecret}`;
  if (method === 'GET') {
    const sortedKeys = Object.keys(params).sort();
    const encodedParams = sortedKeys.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
    sstemp = `${encodedParams}&appSecret=${appSecret}`;
  }
  return md5.md5(sstemp).toUpperCase();
}

/**
 * 处理请求参数
 * @param {Object} config 请求配置
 * @param {string} appid 应用ID
 * @param {string} appSecret 应用密钥
 * @returns {Object} 处理后的请求配置
 */
export function processRequestParams(config, appid, appSecret) {
  const timestamp = Date.now();

  const params = {
    appid,
    timestamp,
  };

  let signParams = config.data;
  if (config.method === 'GET') {
    config.data = {
      ...config.data,
      ...params,
    };
    signParams = config.data;
  } else if (config.method === 'POST') {
    signParams = {
      ...config.params,
      ...params,
      body: JSON.stringify(config.data),
    };
  }

  const sign = generateSignature(signParams, appSecret, config.method);

  if (config.method === 'GET') {
    config.data.sign = sign;
  } else if (config.method === 'POST') {
    config.url += `${config.url.includes('?') ? '&' : '?'}appid=${appid}&timestamp=${timestamp}&sign=${sign}`;
  }

  return config;
}

export function fromCode(str = '') {
  // 定义密钥，36个字母和数字
  const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const l = key.length; // 获取密钥的长度
  let b;
  let b1;
  let b2;
  let b3;
  let d = 0;
  let s; // 定义临时变量
  s = new Array(Math.floor(str.length / 3)); // 计算加密字符串包含的字符数，并定义数组
  b = s.length; // 获取数组的长度
  for (let i = 0; i < b; i++) {
    // 以数组的长度循环次数，遍历加密字符串
    b1 = key.indexOf(str.charAt(d)); // 截取周期内第一个字符串，计算在密钥中的下标值
    d++;
    b2 = key.indexOf(str.charAt(d)); // 截取周期内第二个字符串，计算在密钥中的下标值
    d++;
    b3 = key.indexOf(str.charAt(d)); // 截取周期内第三个字符串，计算在密钥中的下标值
    d++;
    s[i] = b1 * l * l + b2 * l + b3; // 利用下标值，反推被加密字符的Unicode编码值
  }
  // #ifdef H5 || APP-PLUS
  // eslint-disable-next-line no-eval
  b = eval(`String.fromCharCode(${s.join(',')})`);
  // #endif
  // #ifdef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO
  b = String.fromCharCode.apply(null, s);
  // #endif
  return b; // 返回被解密的字符串
}
