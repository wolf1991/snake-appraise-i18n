import config from '@/config/config';

const SUCCESS_TIP = '支付成功';
const FAIL_TIP = '支付失败';

// 支付成功的统一处理
function handlePaymentSuccess(options, result) {
  if (options.success) {
    options.success(result);
  } else {
    uni.$u.toast(SUCCESS_TIP);
  }
  if (options.complete) {
    options.complete(result);
  }
}

// 支付失败的统一处理
function handlePaymentFail(options, result) {
  if (options.fail) {
    options.fail(result);
  } else {
    uni.$u.toast(FAIL_TIP);
  }
  if (options.complete) {
    options.complete(result);
  }
}

/**
 * 微信支付
 * @param 参数参考[https://uniapp.dcloud.net.cn/api/plugins/payment.html]
 */
export function wxPay(paymentInfo) {
  return new Promise((resolve, reject) => {
    uni.requestPayment({
      provider: 'wxpay',
      // #ifdef APP-PLUS
      orderInfo: {
        appid: paymentInfo.appId,
        noncestr: paymentInfo.nonceStr,
        package: paymentInfo.package,
        partnerid: paymentInfo.partnerId,
        prepayid: paymentInfo.prepayId,
        timestamp: paymentInfo.timeStamp,
        sign: paymentInfo.sign,
      },
      // #endif
      // #ifdef MP-WEIXIN
      timeStamp: paymentInfo.timeStamp,
      nonceStr: paymentInfo.nonceStr,
      package: paymentInfo.package,
      signType: paymentInfo.signType,
      paySign: paymentInfo.paySign,
      // #endif
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        console.log(`wx-fail:${JSON.stringify(err)}`);
        reject(err);
      },
    });
  });
}

/**
 * 支付宝支付
 * @param 参数参考[https://uniapp.dcloud.net.cn/api/plugins/payment.html]
 */
export function aliPay(paymentInfo) {
  return new Promise((resolve, reject) => {
    uni.requestPayment({
      provider: 'alipay',
      tradeNO: paymentInfo,
      success: (res) => {
        if (res.resultCode === '6001') {
          // 用户中途取消
          return reject(res);
        }
        resolve(res);
      },
      fail: (err) => {
        console.log(`ali-fail:${JSON.stringify(err)}`);
        reject(err);
      },
    });
  });
}

/**
 * 统一的支付请求函数
 * @param {Object} options - 支付请求的配置对象
 * @param {Object} options.data - 支付参数，包含支付类型和具体支付信息
 * @param {string} options.data.type - 支付类型，如'FREE', 'WX_JSAPI', 'ALI_JSAPI'
 * @param {Object} options.data.data - 具体的支付信息
 * @param {Object} [options.self] - 当前页面的this
 * @param {Function} [options.success] - 支付成功的回调函数
 * @param {Function} [options.fail] - 支付失败的回调函数
 * @param {Function} [options.complete] - 结束的回调函数(支付成功、支付失败都会执行)
 *
 */
export const requestPayment = (options) => {
  console.log('options?.data', options?.data);
  const { type, payData, payDataType } = options?.data || {};

  console.log('支付渠道-type', type);
  console.log('支付参数-payData', payData);

  // type转为大写
  // ALI_JSAPI("支付宝小程序"),
  // ALI_APP("支付宝app"),
  // WX_APP("微信app"),
  // WX_JSAPI("微信小程序");
  const upperCaseType = type ? type.toLocaleUpperCase() : '';

  if (!type || (!payData && upperCaseType !== 'FREE')) {
    handlePaymentFail(options, {
      errMsg: '支付类型或支付信息不存在',
    });
    return;
  }

  switch (upperCaseType) {
    case 'FREE':
      // 参数示例 {"type": "free"}
      // 免费支付，直接返回成功
      handlePaymentSuccess(options, {});
      break;
    case 'WX_JSAPI':
    case 'WX_APP':
    case 'WX_MA': {
      // 微信小程序支付参数示例：
      // payData:"{"appId":"","timeStamp":"","nonceStr":"","package":"","signType":"RSA","paySign":""}"
      const wxPayload = Object.assign({}, JSON.parse(payData));

      if (payDataType && payDataType === 'yeepay') {
        // #ifdef MP-WEIXIN
        // 打开半屏小程序
        uni.openEmbeddedMiniProgram({
          appId: wxPayload.appId,
          path: wxPayload.prePayTn,
          success(res) {
            // 打开成功
            handlePaymentSuccess(options, {
              isClick: true,
            });
          },
          fail(res) {
            console.log(res);
          },
        });
        // #endif

        // #ifdef APP-PLUS
        plus.share.getServices(
          (res) => {
            let wxx = null;
            wxx = res.find((item) => item.id === 'weixin');
            if (wxx) {
              const params = {
                id: wxPayload.miniProgramOrgId, // 微信小程序原生id
                path: wxPayload.prePayTn, // 打开小程序的页面路径，默认跳转首页
              };

              if (wxPayload?.payId) {
                params.id = config.miniProgramOrgId;
                params.path = `pages/common/cashier?payId=${wxPayload.payId}&price=${wxPayload.price}&requestUri=`;
              }

              wxx.launchMiniProgram({
                id: params.id, // 微信小程序原生id
                path: params.path, // 打开小程序的页面路径，默认跳转首页
                type: 0, // 0-正式版； 1-测试版； 2-体验版。 默认值为0。
              });
              handlePaymentSuccess(options, {
                isClick: true,
              });
            } else {
              uni.showToast({
                title: '请安装微信',
                icon: 'none',
              });
            }
          },
          (err) => {
            console.log(err);
          },
        );

        // #endif

        return;
      }

      wxPay(wxPayload)
        .then((res) => {
          handlePaymentSuccess(options, res);
        })
        .catch((err) => {
          handlePaymentFail(options, err);
        });
      break;
    }
    case 'ALI_JSAPI':
    case 'ALI_APP':
    case 'ALIPAY_MA': {
      // 支付小程序支付参数示例：
      // payData:{"alipayTradeNo":"2025021022001423161413291704"}
      const aliPayload = Object.assign({}, JSON.parse(payData));

      if (payDataType && payDataType === 'yeepay') {
        // #ifdef MP-ALIPAY
        aliPay(aliPayload.prePayTn)
          .then((res) => {
            handlePaymentSuccess(options, res);
          })
          .catch((err) => {
            handlePaymentFail(options, err);
          });
        // #endif

        // #ifdef APP-PLUS
        let alipayUrl = aliPayload.prePayTn;
        const query = uni.$u.getQueryParams(aliPayload.prePayTn);
        const isIOS = uni.getSystemInfoSync().platform === 'ios';

        alipayUrl = `${isIOS ? 'alipay' : 'alipays'}://platformapi/startapp?appId=${query.appId}`;

        // page=pages/index/index  跳转到支付宝小程序页面的页面路径
        alipayUrl = `${alipayUrl}&page=${query.page}&thirdPartSchema=${encodeURIComponent('snake://')}`;
        console.log(alipayUrl);
        // 唤起支付宝
        let error = null;
        plus.runtime.openURL(alipayUrl, (res) => {
          error = res;
          uni.showToast({
            icon: 'none',
            title: '请先安装支付宝后再进行支付',
          });
        });
        error != null
          ? handlePaymentFail(options, error)
          : handlePaymentSuccess(options, {
              isClick: true,
            });
        // #endif
        return;
      }

      aliPay(aliPayload.alipayTradeNo)
        .then((res) => {
          handlePaymentSuccess(options, res);
        })
        .catch((err) => {
          handlePaymentFail(options, err);
        });
      break;
    }
    default:
      handlePaymentFail(options, {
        errMsg: `未知的支付方式: ${type}`,
      });
      return null;
  }
};
