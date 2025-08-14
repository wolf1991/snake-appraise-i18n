/**
 * 小程序授权获取微信账号登录
 * @param  appId         后端维护的应用appId，可对应查找小程序appid
 * @param  authCode      授权码
 * @param  encryptedData 加密数据
 * @param  iv            加密数据签名
 */
export const postLogin = (params) => uni?.$u?.http?.post<IUserInfo>('/app/token', params);

/**
 * 退出登录
 */
export const postLogout = () => uni?.$u?.http?.post('/app/logout');

/**
 * 刷新token
 * @param  refreshToken  token
 */
export const postRefreshToken = (params) => uni?.$u?.http?.post<IUserInfo>('/app/refresh', params);

/**
 * 注销账号
 */
export const postDestroy = () => uni?.$u?.http?.post('/app/user/destroy');

/**
 * 地址列表
 */
export const getAddressList = (params) =>
  uni?.$u?.http?.get('/app/user/address/list', {
    data: params,
  });

/**
 * 新增地址
 * @param {string} type 类型，default 设置默认，new 新增地址，update 修改地址
 * @param {Object} params 接口请求参数
 */
export const postAddressSave = (type, params) => uni?.$u?.http?.post(`/app/user/address/save/${type}`, params);

/**
 * 获取地址详情
 */
export const getAddressGet = (params) =>
  uni?.$u?.http?.get('/app/user/address/get', {
    data: params,
  });

/**
 * 获取默认地址
 */
export const getAddressGetIsDefault = (params) =>
  uni?.$u?.http?.get('/app/user/address/getIsDefault', {
    data: params,
  });

// 获取字典表参数
export const getAppDictValue = (params) => uni?.$u?.http?.get(`/app/dict/${params.type}/${params.value}`);

// 获取验证码
export const getCaptchCode = (params) => uni?.$u?.http?.post('/app/code', params);

// 绑定推送id
export const postPushBind = (params) => uni?.$u?.http?.post('https://a.puresnake.comc/push/bind', params);
