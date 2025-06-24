<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

// #ifdef APP-PLUS
import { postPushBind } from '@/api/user';
import { appUpdate } from '@/utils/js/appUpdate';
import permissionListener from '@/utils/permission/permission-listener';
// #endif

import { useUserStore } from '@/stores/modules/user';
import { onBeforeMount } from 'vue';

const userStore = useUserStore();

onLaunch((options) => {
  console.log('App Launch');

  // 存储本地投放渠道
  const { query, referrerInfo } = options;

  if (query && query.sk_channel) {
    uni.setStorageSync('__SK_CHANNEL', query.sk_channel);
  }

  if (query['snake-inviter'] || query.si) {
    const inviter = query['snake-inviter'] || query.si;
    userStore.setInviter(inviter);
  }

  /**
   * 支付宝小程序带参数相互跳转
   * @link https://opensupport.alipay.com/support/helpcenter/142/201602493601?ant_source=zsearch
   * @param {Object} referrerInfo
   */
  if (referrerInfo) {
    const { extraData } = referrerInfo;
    if (extraData && extraData.sk_channel) {
      uni.setStorage({
        key: '__SK_CHANNEL',
        data: extraData.sk_channel,
      });
    }
  }

  // #ifdef APP-PLUS

  // 检查更新
  appUpdate();

  // 设置推送权限
  checkNotificationAuthorized();

  // https://www.html5plus.org/doc/zh_cn/runtime.html#plus.runtime.setBadgeNumber
  // 设置应用图标上显示的角标数字
  plus.runtime.setBadgeNumber(0);

  // 绑定唯一推送标识
  pushBind();

  // 监听消息推送
  uni.onPushMessage((res) => {
    console.log('收到推送消息：', res); // 监听推送消息

    // 监听通知栏消息的点击
    if (res.type === 'click') {
      const payload = res.data?.payload as { url: string };
      if (payload.url) {
        uni.$u.navTo(payload.url);
      }
    }
    // 监听在线推送消息，若云函数设置了 "force_notification":true，则不会触发此 receive。
    if (res.type === 'receive') {
      console.log('接收到的消息内容', res);
    }
  });

  // #endif

  // #ifdef MP
  mpUpdate();
  // #endif
});
onShow(() => {
  console.log('App Show');

  // #ifdef APP-PLUS

  // 如果个别页面需要单独定制 请在页面单独写
  const permissionEnums = {
    // 取android.permission.CAMERA后面那个
    CAMERA: {
      name: '相机', // 当前权限的名称
      explain: '便于您使用该功能拍照更换头像、意见反馈上传图片、与客服沟通、扫码识别等场景中发送拍摄图片。', // 权限说明
    },
    WRITE_EXTERNAL_STORAGE: {
      name: '相册', // 当前权限的名称
      explain: '便于您使用该功能上传您的照片/图片/视频及用于更换头像、意见反馈上传图片、与客服沟通中读取和写入相册和文件内容。', // 权限说明
    },
  };

  // 唤起权限会触发onHide，所以listenerFunc须在onShow生命周期调用
  permissionListener && permissionListener.listenerFunc(permissionEnums);

  // #endif
});

onHide(() => {
  console.log('App Hide');
  // #ifdef APP
  permissionListener && permissionListener.stopFunc();
  // #endif
});

onBeforeMount(() => {
  // #ifdef H5
  addScriptBeforeHead();
  // #endif
});

// #ifdef H5
function addScriptBeforeHead() {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.text = `
                var _czc = _czc || [];
                (function () {
                    var um = document.createElement("script");
                    um.src = "https://v1.cnzz.com/z.js?id=1278912380&async=1";
                    var s = document.getElementsByTagName("script")[0];
                    s.parentNode.insertBefore(um, s);
                })();
            `;

  const head = document.getElementsByTagName('head')[0];

  if (head) {
    head.parentNode.insertBefore(script, head);
  } else {
    // 如果没有<head>标签，则添加到<body>的开头
    document.body.insertBefore(script, document.body.firstChild);
  }
}

// #endif

// #ifdef MP
const mpUpdate = () => {
  if (uni.canIUse('getUpdateManager')) {
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    });
    updateManager.onUpdateReady((res) => {
      uni.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否马上重启小程序？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });
    updateManager.onUpdateFailed((res) => {
      // 新的版本下载失败
      uni.showModal({
        title: '检测到新版本',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开',
        showCancel: false,
        confirmText: '知道了',
      });
    });
  }
};
// #endif

// #ifdef APP-PLUS
// 检查app是否开启了通知权限 安卓苹果通用
const checkNotificationAuthorized = () => {
  const notificationAuthorized = uni.getAppAuthorizeSetting().notificationAuthorized;
  if (notificationAuthorized !== 'authorized') {
    uni.showModal({
      title: '通知权限',
      content: '您还没有开启通知权限，无法接收到消息通知，请前往设置！',
      confirmText: '去设置',
      success: (res) => {
        if (res.confirm) {
          uni.openAppAuthorizeSetting();
        }
      },
    });
  }
};

const pushBind = () => {
  if (!userStore.userInfo.uid) {
    return;
  }
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
      console.log(err);
    },
  });
};
// #endif
</script>
<style lang="scss">
/*每个页面公共css */
@import '@/uni_modules/uview-plus/index.scss';
page {
  background-color: #f6f6f6;
}
</style>
