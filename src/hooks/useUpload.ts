import { ref } from 'vue';
import { getFileOssSign } from '@/api/common';
import config from '@/config/config';

/**
 * useUpload 是一个定制化的请求钩子，用于处理上传图片。
 * @param formData 额外传递给后台的数据，如{name: '张三'}。
 * @param prefix 上传文件目录
 * @returns 返回一个对象{loading, error, data, run}，包含请求的加载状态、错误信息、响应数据和手动触发请求的函数。
 */
export default function useUpload<T = string>(formData: Record<string, any> = {}, prefix: string = 'appraise') {
  const loading = ref(false);
  const error = ref(false);
  const data = ref<T>();
  const run = () => {
    // #ifdef MP-WEIXIN
    // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替。
    // 微信小程序在2023年10月17日之后，使用本API需要配置隐私协议
    uni.chooseMedia({
      count: 1,
      sourceType: ['album', 'camera'],
      mediaType: ['image'],
      success: (res) => {
        loading.value = true;
        const tempFilePath = res.tempFiles[0].tempFilePath;
        uploadFile(
          {
            tempFilePath,
            formData,
            data,
            error,
            loading,
          },
          prefix,
        );
      },
      fail: (err) => {
        console.error('uni.chooseMedia err->', err);
        error.value = true;
      },
    });
    // #endif
    // #ifndef MP-WEIXIN
    uni.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: (res) => {
        loading.value = true;
        const tempFilePath = res.tempFilePaths[0];
        uploadFile(
          {
            tempFilePath,
            formData,
            data,
            error,
            loading,
          },
          prefix,
        );
      },
      fail: (err) => {
        console.error('uni.chooseImage err->', err);
        error.value = true;
      },
    });
    // #endif
  };

  return {
    loading,
    error,
    data,
    run,
  };
}

async function uploadFile({ tempFilePath, formData, data, error, loading }, prefix) {
  // 调取后端接口拿到参数
  const stsInfo = await getFileOssSign(prefix);
  if (!stsInfo.success) {
    loading.value = false;
    uni.$u.toast('获取上传签名失败, 请稍后重试');
    return;
  }
  const fileName = `${stsInfo.data.dir + uni.$u.timeFormat(new Date(), 'yyyymm')}/${uni.$u.guid(10)}.png`;
  uni.uploadFile({
    url: stsInfo.data.host,
    filePath: tempFilePath,
    name: 'file',
    formData: {
      ...formData,
      key: fileName,
      policy: stsInfo.data.policy,
      OSSAccessKeyId: stsInfo.data.accessid,
      success_action_status: '200', // 让服务端返回200,不然，默认会返回204
      signature: stsInfo.data.signature,
    },
    success: (uploadFileRes) => {
      // data.value = uploadFileRes.data;
      if (uploadFileRes.statusCode === 200) {
        data.value = `${config.ossCdnUrl}/${fileName}`;
      }
    },
    fail: (err) => {
      console.error('uni.uploadFile err->', err);
      error.value = true;
    },
    complete: () => {
      loading.value = false;
    },
  });
}
