// 获取环境变量
const { VITE_SERVER_BASEURL, VITE_SERVER_BASEURL_DEV, VITE_USER_NODE_ENV } = import.meta.env;

console.log('env->', import.meta.env);

// 项目公共配置
let config = {
  // baseUrl
  baseUrl: VITE_SERVER_BASEURL,
  baseUrlList: [...new Set([VITE_SERVER_BASEURL, VITE_SERVER_BASEURL_DEV].filter((url) => !!url))],
  ossCdnUrl: 'https://s.qiuxietang.com',
  a: '01C01F01F01C01H01J01D01K',
  b: '02P01G01G01L01I01I01J02T02Q01H02Q02P01G01G01H01C02P02P01G02R01L01J02Q02P01F02T02S02Q02P01H01K02S',
  // #ifdef MP-ALIPAY
  appId: 999231, // 后端维护的应用appId，可对应查找小程序appid
  // #endif
};

if (VITE_USER_NODE_ENV === 'development') {
  console.log('\n %c 开发环境 \n', 'color: #ffffff; background: #ff0000; padding:5px 0; border-radius: 5px;');
  // 这里可配置开发环境的baseUrl等参数
  config = Object.assign(config, {
    baseUrl: VITE_SERVER_BASEURL_DEV || config.baseUrl,
  });
} else {
  console.log('生产环境');
}

export default config;
