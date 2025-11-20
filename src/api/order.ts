const { http } = uni.$u;

// 订单价格计算
export const postOrderCalc = (params) => http.post('/app/order/calc', params);

// 创建订单
export const postOrderCreate = (params) => http.post('/app/order/create', params);

// 订单列表
export const getOrderList = (params) =>
  http.get('/app/order/list', {
    data: params,
  });

// 订单详情
export const getOrderDetail = (params) =>
  http.get('/app/order/detail', {
    data: params,
  });

// 订单支付
export const postOrderPay = (params) => http.post('/app/order/pay', params);

// 订单取消
export const postOrderCancel = (params) => http.post('/app/order/cancel', params);

// 修改地址
export const postOrderAddressUpdate = (params) => http.post('/app/order/address/update', params);
