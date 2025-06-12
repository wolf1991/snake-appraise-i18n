import { pages, subPackages } from '@/pages.json';

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 这里设计得通用一点，可以传递key作为判断依据，默认是 needLogin, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的pages，如果传递了 key, 则表示通过 key 过滤
 */
export const getAllPages = (key = 'needLogin') => {
  // 这里处理主包
  const mainPages = [
    ...pages
      .filter((page) => !key || page[key])
      .map((page) => ({
        ...page,
        path: `/${page.path}`,
      })),
  ];
  // 这里处理分包
  const subPages = [];
  subPackages.forEach((subPageObj) => {
    // console.log(subPageObj)
    const { root } = subPageObj;

    subPageObj.pages
      .filter((page) => !key || page[key])
      .forEach((page) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        });
      });
  });
  const result = [...mainPages, ...subPages];
  // console.log(`getAllPages by ${key} result: `, result)
  return result;
};

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const getNeedLoginPages = () => getAllPages('needLogin').map((page) => page.path);

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const needLoginPages = getAllPages('needLogin').map((page) => page.path);

/**
 * 确保URL字符串中的编码字符被正确解码
 *
 * @param {string} url 要解码的URL字符串
 * @returns {string} 解码后的URL字符串
 */
export const ensureDecodeURIComponent = (url: string): string => {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url));
  }
  return url;
};

/**
 * 从URL中获取查询参数并返回对象
 *
 * @param url 包含查询参数的URL字符串
 * @returns 返回包含查询参数的对象，如果URL中没有查询参数，则返回空对象
 */
export const getQueryParams = (url: string) => {
  const queryStr = url.includes('?') ? url.split('?').slice(1).join('?') : '';

  if (!queryStr) {
    return {};
  }
  const query = {};
  queryStr.split('&').forEach((item) => {
    // 只分割第一个等号，保留值中的等号
    const index = item.indexOf('=');
    if (index === -1) return; // 跳过无值的参数

    const key = item.slice(0, index);
    const value = item.slice(index + 1);

    let decodedValue = value ? ensureDecodeURIComponent(value) : '';
    try {
      decodedValue = JSON.parse(decodedValue);
    } catch (e) {
      // 保持原值
    }
    query[key] = decodedValue;
  });
  return query;
};

/**
 * 将像素值转换为其他单位值
 *
 * @param value 数值，默认为0
 * @param unit 单位，默认为'rpx'
 * @returns 转换后的数值加上单位
 */
export const pxTorpx = (value = 0, unit = 'rpx') => {
  const deviceWidth = uni.getSystemInfoSync().windowWidth; // 获取设备屏幕宽度
  const val = (unit === 'px' ? deviceWidth / 750 : 750 / deviceWidth) * Number(value);
  return uni.$u.addUnit(val, unit);
};

/**
 * 日期格式化
 * @param {Date} value - 日期对象
 * @param {String} format - 默认'yyyy-mm-dd hh-MM-ss'
 */
export const formatTime = (value: Date, format: string = 'yyyy-mm-dd hh:MM:ss') => uni.$u.timeFormat(value, format);

/**
 * oss 图片缩放,按宽高处理
 * @param {String} value 图片src地址
 * @param {number|String} w 图片resize大小
 * @return {String} 图片resize后的src地址
 */
export const imageResize = (value: string, w: number = 375): string => {
  if (!value) return value;
  if (value.includes('https://')) {
    return `${value}?x-oss-process=image/resize,w_${w}`;
  }
  return value;
};

/**
 * 缩略图
 *
 * @param {string} value - 原始图片的URL
 * @returns {string} - 处理后的URL
 */
export const thumbnailZip = (value: string): string => {
  if (!value) return value;
  if (value.includes('https://')) {
    return `${value}?x-oss-process=image/resize,m_pad,w_750,h_750/quality,Q_100`;
  }
  return value;
};

/**
 * 跳转页面
 *
 * @param {string} url - 要跳转的页面路径
 * @param {string} [linkType='navigateTo'] - 跳转类型，可选值为 'navigateTo', 'redirectTo', 'reLaunch', 'switchTab'
 */
export const navTo = (url: string, linkType: string = 'navigateTo') => {
  if (!url) {
    // console.log('url为空，无法跳转', url);
    return;
  }

  try {
    if (url.startsWith('http')) {
      uni[linkType]({
        url: `/pages/common/webview?url=${encodeURIComponent(url)}`,
      });
      return;
    }

    // #ifdef MP
    // 小程序打开其他小程序链接处理
    // /miniprogram?appId=wx1ec429bacbbdae09&extra={"channel": "xx"}&path=pages/index/index?name=xxx
    if (url.includes('/miniprogram')) {
      const formatQuery = uni.$u.getQueryParams(url) as unknown as {
        appId: string;
        path?: string;
        extra?: object;
        envVersion?: 'release' | 'trial' | 'develop';
      };
      // 打开其他小程序
      uni.navigateToMiniProgram({
        appId: formatQuery.appId,
        path: formatQuery?.path || '',
        extraData: formatQuery?.extra || {},
        envVersion: formatQuery?.envVersion || 'release',
        success(res) {
          // 打开成功
        },
      });
    }
    // #endif

    // 客服链接处理
    // /serviceChat?url=https://work.weixin.qq.com/kfid/kfcdadb72c34bbc768c&corpId=ww07ef4bf0818cc8cb
    if (url.includes('/serviceChat')) {
      const formatQuery = uni.$u.getQueryParams(url) as unknown as { url: string; corpId: string };
      const queryUrl = formatQuery.url;
      const corpId = formatQuery.corpId;

      // #ifdef MP-WEIXIN
      // 打开微信客服
      uni.openCustomerServiceChat({
        extInfo: {
          url: queryUrl,
        },
        corpId,
        success(res) {
          // 打开成功
        },
      });
      // #endif

      // #ifdef APP-PLUS || H5
      uni[linkType]({
        url: `/pages/common/webview?url=${queryUrl}`,
      });
      // #endif

      return;
    }

    // navigateTo:保留当前页面，跳转到应用内的某个页面
    // redirectTo:关闭当前页面，跳转到应用内的某个页面
    // reLaunch:关闭所有页面，打开到应用内的某个页面
    // switchTab:跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面

    const isTabbar = url.includes('tabbar');

    // 执行类似uni.navigateTo的方法
    uni[isTabbar ? 'switchTab' : linkType]({
      url,
    });
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

export const toWebviewPage = (url: string) => {
  const webviewUrl = `https://m.puresnake.com/2nd${url}`;
  uni.navigateTo({
    url: `/pages/common/webview?url=${encodeURIComponent(webviewUrl)}`,
  });
};

/**
 * 显示消息提示框
 *
 * @param {string} title - 要显示的提示文本
 * @param {number} [duration=2000] - 提示框显示的持续时间，单位为毫秒，默认为2000毫秒
 */
export function toast(title: string, duration: number = 2000) {
  if (!title) return false;
  const len = String(title).length;
  if (!len) {
    return;
  }
  if (len <= 20) {
    // 不带图标，最多展示两行
    uni.showToast({
      title: String(title),
      icon: 'none',
      duration,
    });
  } else {
    // 文案巨长时使用的toast，改用系统弹窗
    uni.showModal({
      title: '提示',
      content: String(title),
      showCancel: false,
      confirmText: '知道了',
    });
  }
}

/**
 * 将文本复制到剪贴板
 *
 * @param {string} [copyText=''] - 要复制的文本，默认为空字符串
 * @param {Function} [callback] - 复制成功后的回调函数
 */
export const copy = (copyText: string = '', callback: () => void) => {
  uni.setClipboardData({
    data: String(copyText),
    success() {
      if (typeof callback === 'undefined') {
        toast('已复制到剪切板');
      } else {
        callback();
      }
    },
  });
};

/**
 * 预览图片
 *
 * @param {string|string[]} image - 要预览的图片的URL或URL数组
 * @param {number} [index=0] - 当前显示图片的索引，默认为0
 */
export const previewImage = (image, index = 0) => {
  const imageList = Array.isArray(image) ? image : [image];
  uni.previewImage({
    urls: imageList,
    current: index,
  });
};

/**
 * 对数字进行三位分割
 * @param {*} value  需要进行分割的数字
 * @returns  返回分割后的数字串
 */
// 小数部分只显示两位小数
export function numFormat(value) {
  if (!value) return '0';
  const intPart = Number(value).toFixed(0); // 获取整数部分
  const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); // 将整数部分逢三一断
  let floatPart = '.00'; // 预定义小数部分
  const value2Array = value.toString().split('.');
  // =2表示数据有小数位
  if (value2Array.length === 2) {
    floatPart = value2Array[1].toString(); // 拿到小数部分
    if (floatPart.length === 1) {
      // 补0
      return intPartFormat + '.' + floatPart + '0';
    } else {
      return intPartFormat + '.' + floatPart;
    }
  } else {
    return intPartFormat;
  }
}

/**
 * 获取页面历史栈指定层实例
 * @param back {number} [0] - 0或者负数，表示获取历史栈的哪一层，0表示获取当前页面实例，-1 表示获取上一个页面实例。默认0。
 */
function getHistoryPage(back = 0) {
  const pages = getCurrentPages();
  const beforePage = pages[pages.length - 1 + back];
  return beforePage?.$vm?.$?.exposed || getHistoryPage2(back);
}

/**
 * 获取页面历史栈指定层实例
 * @param back {number} [0] - 0或者负数，表示获取历史栈的哪一层，0表示获取当前页面实例，-1 表示获取上一个页面实例。默认0。
 */
function getHistoryPage2(back = 0) {
  const pages = getCurrentPages();
  const len = pages.length;
  return pages[len - 1 + back] && pages[len - 1 + back].$vm;
}

// 查询节点信息
// 目前此方法在支付宝小程序中无法获取组件跟接点的尺寸，为支付宝的bug(2020-07-21)
// 解决办法为在组件根部再套一个没有任何作用的view元素
export function getRect(selector, all) {
  return new Promise((resolve) => {
    let query = uni.createSelectorQuery().in(this);
    // #ifdef MP-ALIPAY
    query = uni.createSelectorQuery();
    // #endif
    query[all ? 'selectAll' : 'select'](selector)
      .boundingClientRect((rect) => {
        if (all && Array.isArray(rect) && rect.length) {
          resolve(rect);
        }
        if (!all && rect) {
          resolve(rect);
        }
      })
      .exec();
  });
}

export default {
  ensureDecodeURIComponent,
  getQueryParams,
  pxTorpx,
  formatTime,
  imageResize,
  thumbnailZip,
  navTo,
  toWebviewPage,
  toast,
  copy,
  numFormat,
  getHistoryPage,
  getRect,
};
