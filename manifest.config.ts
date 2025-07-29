// manifest.config.ts
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest';
import path from 'node:path';
import { loadEnv } from 'vite';

// 获取环境变量的范例
const env = loadEnv(process.env.NODE_ENV!, path.resolve(process.cwd(), 'env'));
const { VITE_APP_TITLE, VITE_UNI_APPID, VITE_WX_APPID, VITE_ALI_APPID, VITE_APP_PUBLIC_BASE } = env;

export default defineManifestConfig({
  name: VITE_APP_TITLE,
  appid: VITE_UNI_APPID,
  description: '',
  versionName: '1.0.27',
  versionCode: '1027',
  transformPx: false,
  locale: 'zh-Hans',
  fallbackLocale: 'zh-Hans',
  /* 5+App特有相关 */
  'app-plus': {
    usingComponents: true,
    nvueStyleCompiler: 'uni-app',
    compilerVersion: 3,
    compatible: {
      ignoreVersion: true,
    },
    splashscreen: {
      alwaysShowBeforeRender: true,
      waiting: true,
      autoclose: true,
      delay: 0,
    },
    /* 模块配置 */
    modules: {
      Camera: {},
      Push: {},
      Payment: {},
      Share: {},
    },
    /* 应用发布信息 */
    distribute: {
      /* android打包配置 */
      android: {
        minSdkVersion: 29,
        targetSdkVersion: 36,
        abiFilters: ['armeabi-v7a', 'arm64-v8a'],
        permissions: [
          '<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>',
          '<uses-permission android:name="android.permission.VIBRATE"/>',
          '<uses-permission android:name="android.permission.READ_LOGS"/>',
          '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>',
          '<uses-feature android:name="android.hardware.camera.autofocus"/>',
          '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.CAMERA"/>',
          '<uses-permission android:name="android.permission.GET_ACCOUNTS"/>',
          '<uses-permission android:name="android.permission.READ_PHONE_STATE"/>',
          '<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>',
          '<uses-permission android:name="android.permission.WAKE_LOCK"/>',
          '<uses-permission android:name="android.permission.FLASHLIGHT"/>',
          '<uses-feature android:name="android.hardware.camera"/>',
          '<uses-permission android:name="android.permission.WRITE_SETTINGS"/>',
        ],
        permissionExternalStorage: {
          request: 'none',
          prompt: '应用保存运行状态等信息，需要获取读写手机存储（系统提示为访问设备上的照片、媒体内容和文件）权限，请允许。',
        },
        permissionPhoneState: {
          request: 'none',
          prompt: '为保证您正常、安全地使用，需要获取设备识别码（部分手机提示为获取手机号码）使用权限，请允许。',
        },
        schemes: 'hbuilder,snake',
      },
      /* ios打包配置 */
      ios: {
        urltypes: [
          {
            urlidentifier: 'com.app.snaker',
            urlschemes: ['hbuilder', 'snake'],
          },
        ],
        privacyDescription: {
          NSPhotoLibraryUsageDescription: '选择需要上传的图片，用于鉴别您的装备',
          NSCameraUsageDescription: '拍照并上传，用于鉴别您的装备',
          NSMicrophoneUsageDescription: '开启麦克风用于为用户提供客服语音聊天',
        },
      },
      /* SDK配置 */
      sdkConfigs: {
        push: {
          unipush: {
            version: '2',
            offline: false,
          },
        },
        payment: {
          alipay: {
            __platform__: ['ios', 'android'],
          },
        },
        share: {
          weixin: {
            appid: 'wx8247eea146157b64',
            UniversalLinks: 'https://m.puresnake.com/ulink/',
          },
        },
        oauth: {
          weixin: {
            appid: 'wx8247eea146157b64',
            UniversalLinks: 'https://m.puresnake.com/ulink/',
          },
        },
      },
      /* 图标配置 */
      icons: {
        android: {
          hdpi: 'src/static/app/icons/72x72.png',
          xhdpi: 'src/static/app/icons/96x96.png',
          xxhdpi: 'src/static/app/icons/144x144.png',
          xxxhdpi: 'src/static/app/icons/192x192.png',
        },
        ios: {
          appstore: 'src/static/app/icons/1024x1024.png',
          ipad: {
            app: 'src/static/app/icons/76x76.png',
            'app@2x': 'src/static/app/icons/152x152.png',
            notification: 'src/static/app/icons/20x20.png',
            'notification@2x': 'src/static/app/icons/40x40.png',
            'proapp@2x': 'src/static/app/icons/167x167.png',
            settings: 'src/static/app/icons/29x29.png',
            'settings@2x': 'src/static/app/icons/58x58.png',
            spotlight: 'src/static/app/icons/40x40.png',
            'spotlight@2x': 'src/static/app/icons/80x80.png',
          },
          iphone: {
            'app@2x': 'src/static/app/icons/120x120.png',
            'app@3x': 'src/static/app/icons/180x180.png',
            'notification@2x': 'src/static/app/icons/40x40.png',
            'notification@3x': 'src/static/app/icons/60x60.png',
            'settings@2x': 'src/static/app/icons/58x58.png',
            'settings@3x': 'src/static/app/icons/87x87.png',
            'spotlight@2x': 'src/static/app/icons/80x80.png',
            'spotlight@3x': 'src/static/app/icons/120x120.png',
          },
        },
      },
      splashscreen: {
        iosStyle: 'storyboard',
        ios: {
          storyboard: 'src/static/app/CustomStoryboard.zip',
        },
      },
    },
  },
  /* 快应用特有相关 */
  quickapp: {},
  /* 小程序特有相关 */
  'mp-weixin': {
    appid: VITE_WX_APPID,
    setting: {
      urlCheck: false,
    },
    usingComponents: true,
    optimization: {
      subPackages: true,
    },
    // __usePrivacyCheck__: true,
  },
  'mp-alipay': {
    appid: VITE_ALI_APPID,
    usingComponents: true,
    styleIsolation: 'shared',
  },
  'mp-baidu': {
    usingComponents: true,
  },
  'mp-toutiao': {
    usingComponents: true,
  },
  uniStatistics: {
    enable: false,
  },
  vueVersion: '3',
  h5: {
    router: {
      base: VITE_APP_PUBLIC_BASE,
      mode: 'history',
    },
  },
});
