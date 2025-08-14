import config from '@/config/config';
import { postLogin, postPushBind } from '@/api/user';
import { useUserStore } from '@/stores/modules/user';

interface IAuthResult {
  openid: string;
  access_token: string;
}

export const useLogin = () => {
  const userStore = useUserStore();

  /**
   * 使用一键登录功能进行用户登录
   *
   * @param isToast 是否显示登录结果的提示信息，默认为 true
   * @returns 返回一个 Promise，解析为登录结果对象，或拒绝为错误信息
   */
  const univerifyLogin = (isToast = true) => {
    return new Promise<IResData<IUserInfo>>((resolve, reject) => {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });
      uni.preLogin({
        provider: 'univerify',
        success: () => {
          // 预登录成功
          uni.hideLoading();

          // 显示一键登录选项
          uni.login({
            provider: 'univerify',
            univerifyStyle: {
              fullScreen: false,
              phoneNum: {
                color: '#26273A',
              },
              authButton: {
                normalColor: '#0f1113', // 授权按钮正常状态背景颜色 默认值：#3479f5
                highlightColor: '#0f1113', // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
                disabledColor: '#ACACB7', // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
              },
              privacyTerms: {
                defaultCheckBoxState: false, // 条款勾选框初始状态 默认值： true
                uncheckedImage: '', // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)
                checkedImage: '', // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
                textColor: '#26273A', // 文字颜色 默认值：#BBBBBB
                termsColor: '#2EBD7C', //  协议文字颜色 默认值： #5496E3
              },
            },
            success: async (loginRes) => {
              // 登录成功
              console.log(loginRes, loginRes.authResult); // {openid:'登录授权唯一标识', access_token:'接口返回的 token'}
              const { openid, access_token: accessToken } = loginRes.authResult as unknown as IAuthResult;
              try {
                const response = await loginHandle({
                  appId: config.appId,
                  openid,
                  accessToken,
                  encryptedData: '1',
                  // uniAppid: import.meta.env.VITE_UNI_APPID,
                });

                isToast && uni.$u.toast(response.success ? '登录成功' : response.msg || '登录失败');

                resolve(response);
              } catch (error) {
                reject(error);
              } finally {
                uni.closeAuthView();
              }
            },
            fail(loginfail) {
              // 登录失败
              // console.log('loginFail', loginFail);
              uni.closeAuthView();
              // 用户点击了其他登录方式
              if (loginfail.code === 30002) {
                uni.navigateTo({
                  url: '/pages/login/oauth',
                });
              }
              reject(loginfail);
            },
          });
        },
        fail: (err) => {
          // 预登录失败
          // console.log('预登录失败', err);
          reject(err);
          uni.navigateTo({
            url: '/pages/login/oauth',
          });
        },
      });
    });
  };

  /**
   * 登录处理函数
   *
   * @param params 登录参数，默认为空对象
   * @returns 返回包含用户信息的Promise对象
   */
  const loginHandle = async (params = {}) => {
    try {
      uni.showLoading({
        title: '登录中...',
        mask: true,
      });

      const response = await postLogin(params);

      if (response.success) {
        userStore.setUserInfo({
          ...response.data,
          token: response.token,
        });

        // #ifdef APP-PLUS
        pushBind();
        // #endif
      }

      return response;
    } finally {
      uni.hideLoading();
    }
  };

  /**
   * 绑定推送功能的函数
   *
   * 如果没有用户信息中的uid，则不进行任何操作。
   * 获取设备信息和应用基础信息，然后调用uni.getPushClientId方法获取客户端唯一的推送标识。
   * 如果获取成功，则调用postPushBind函数将相关信息发送到服务器进行绑定。
   * 如果获取失败，则在控制台打印错误信息。
   */
  const pushBind = () => {
    if (!userStore.userInfo.uid) return;

    const deviceInfo = uni.getDeviceInfo();
    const appBaseInfo = uni.getAppBaseInfo();

    // 获取客户端唯一的推送标识
    uni.getPushClientId({
      success: async (res) => {
        await postPushBind({
          appid: appBaseInfo.appId,
          deviceId: deviceInfo.deviceId,
          deviceType: deviceInfo.deviceBrand,
          userId: userStore.userInfo.uid,
          pushId: res.cid,
        });
      },
      fail(err) {
        console.log('getPushClientId', err);
      },
    });
  };

  return {
    univerifyLogin,
    pushBind,
    loginHandle,
  };
};
