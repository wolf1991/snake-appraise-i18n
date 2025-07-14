/**
 * 路由拦截，通常也是登录拦截
 * 可以设置路由白名单，或者黑名单，看业务需要选哪一个
 * 我这里应为大部分都可以随便进入，所以使用黑名单
 */
import { useUserStore } from '@/stores';
import { getNeedLoginPages, needLoginPages as _needLoginPages } from '@/utils';

// TODO Check
const loginRoute = '/pages/login/oauth';

const isLogined = () => {
  const userStore = useUserStore();
  return userStore.isLogined;
};

const isDev = import.meta.env.DEV;

// 黑名单登录拦截器 - （适用于大部分页面不需要登录，少部分页面需要登录）
const navigateToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  invoke(args: { url: string }) {
    // console.log('args', args);

    if (!args.url.includes('http')) {
      if (args.url.includes('pages/identify/range2')) {
        args.url = args.url.replace('pages/identify/range2', 'pages/appraise/selectBrand');
      }
      if (args.url.includes('pages/identify/range')) {
        args.url = args.url.replace('pages/identify/range', 'pages/appraise/selectBrand');
      }
      if (args.url.includes('pages/identify/order')) {
        args.url = args.url.replace('pages/identify/order', 'pages/order/orderList');
      }
      if (args.url.includes('pages/identify/detail')) {
        args.url = args.url.replace('pages/identify/detail', 'pages/order/orderDetail');
      }
      if (args.url.includes('pages/identify/codepurchase')) {
        args.url = args.url.replace('pages/identify/codepurchase', 'pages/appraise/codePurchase');
      }
      if (args.url.includes('pages/identify/codeorder')) {
        args.url = args.url.replace('pages/identify/codeorder', 'pages/order/codeOrderList');
      }
      if (args.url.includes('pages/identifier/identifierorder')) {
        args.url = args.url.replace('pages/identifier/identifierorder', 'pages/appraise/appraiser');
      }
    }

    const { url } = args;
    // console.log(url); // /pages/route-interceptor/index?name=feige&age=30

    const path = url.split('?')[0];
    let needLoginPages = [];
    // 为了防止开发时出现BUG，这里每次都获取一下。生产环境可以移到函数外，性能更好
    if (isDev) {
      needLoginPages = getNeedLoginPages();
    } else {
      needLoginPages = _needLoginPages;
    }
    const isNeedLogin = needLoginPages.includes(path);
    if (!isNeedLogin) {
      return true;
    }
    const hasLogin = isLogined();
    if (hasLogin) {
      return true;
    }
    const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`;
    uni.navigateTo({ url: redirectRoute });
    return false;
  },
};

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor);
    uni.addInterceptor('reLaunch', navigateToInterceptor);
    uni.addInterceptor('redirectTo', navigateToInterceptor);
    uni.addInterceptor('switchTab', navigateToInterceptor);
    // https://uniapp.dcloud.net.cn/api/interceptor.html#removeinterceptor
    // 注意：拦截uni.switchTab本身没有问题。但是在微信小程序端点击tabbar的底层逻辑并不是触发uni.switchTab。
    // 所以误认为拦截无效，此类场景的解决方案是在tabbar页面的页面生命周期onShow中处理。
  },
};
