import config from '@/config/config';
import { getFileOssSign, IFileOssSign } from '@/api/common';

class Uploader {
  async uploadOss(filePath: string, prefix = 'appraise') {
    const url = await this.webUpload(filePath, prefix);
    return url;
  }

  // 服务端签名，前端直传
  async webUpload(imageSrc: string, prefix: string) {
    return new Promise<{ url: string }>((resolve, reject) => {
      getFileOssSign(prefix)
        .then((response) => {
          if (response.success) {
            const stsInfo = response?.data || ({} as IFileOssSign);
            const fileName = `${stsInfo.dir}/${uni.$u.guid(10)}.png`;
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
                console.log('uploadFileRes', uploadFileRes);
                if (uploadFileRes.statusCode === 200) {
                  resolve({
                    url: `${config.ossCdnUrl}/${fileName}`,
                  });
                  return;
                }
                resolve({
                  url: '',
                });

                if (uploadFileRes.data.includes('Your proposed upload exceeds the maximum allowed size')) {
                  uni.$u.toast('上传失败，图片不能超过5M');
                  return;
                }

                uni.$u.toast('上传失败，请重新上传');
              },
            });
          } else {
            uni.$u.toast(response?.msg || '获取上传签名失败');
            reject(response);
          }
        })
        .catch(() => {
          reject(new Error('上传失败，请重新上传'));
        });
    });
  }
}

export default new Uploader();
