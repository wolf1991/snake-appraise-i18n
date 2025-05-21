export interface IFileOssSign {
  dir: string;
  host: string;
  accessid: string;
  policy: string;
  signature: string;
}

/**
 * 获取oss签名
 * @param  prefix 目录
 */
export const getFileOssSign = (prefix: string) => uni.$u.http.post<IFileOssSign>(`/app/file/${prefix}?type=sign`);
