import config from '@/config/config';
import { getFileOssSign, IFileOssSign } from '@/api/common';

class Uploader {
  async uploadOss(filePath: string, prefix = 'appraise') {
    // H5上传
    const url = await this.webUpload(filePath, prefix);
    return url;
  }

  // 服务端签名，前端直传
  async webUpload(imageSrc: string, prefix: string) {
    return new Promise<{ url: string }>((resolve, reject) => {
      getFileOssSign(prefix)
        .then((response) => {
          if (response.success) {
            const stsInfo = response.data;
            const fileName = `${stsInfo.dir + uni.$u.timeFormat(new Date(), 'yyyymm')}/${uni.$u.guid(10)}.png`;
            uni.uploadFile({
              url: stsInfo.host,
              filePath: imageSrc,
              fileType: 'image',
              name: 'file',
              formData: {
                key: fileName,
                policy: stsInfo.policy,
                OSSAccessKeyId: stsInfo.accessid,
                success_action_status: '200',
                // 让服务端返回200,不然，默认会返回204
                signature: stsInfo.signature,
              },
              success: (uploadFileRes) => {
                if (uploadFileRes.statusCode === 200) {
                  resolve({
                    url: `${config.ossCdnUrl}/${fileName}`,
                  });
                  return;
                }
                resolve({
                  url: '',
                });
                uni.$u.toast('上传失败，请重新上传');
              },
            });
          } else {
            uni.$u.toast(response.msg || '获取上传签名失败');
            reject(response);
          }
        })
        .catch(reject);
    });
  }
}

export default new Uploader();
