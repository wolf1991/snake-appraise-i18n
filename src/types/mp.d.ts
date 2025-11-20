declare module WechatMiniprogram {
  interface Wx {
    /**
     * 重启小程序
     *
     * @param path 打开的页面路径，path 中 ? 后面的部分会成为 query
     *
     * 文档：https://developers.weixin.qq.com/miniprogram/dev/api/navigate/wx.restartMiniProgram.html
     */
    restartMiniProgram: (options?: any) => void;
  }
}

declare namespace my {
  /**
   * 重启小程序
   * @param path 重启小程序后打开的页面路径 该参数不传，重启小程序后打开小程序默认首页；path 中 ? 后面的内容，可在被重启后的Page.onLoad(query) 中获取
   *
   * 文档：https://opendocs.alipay.com/mini/0dguml#my.restartMiniProgram(Object%20object)
   */
  export function restartMiniProgram(object?: {
    /**
     * 重启小程序后打开的页面路径
     * 该参数不传，重启小程序后打开小程序默认首页；
     * path 中 ? 后面的内容，可在被重启后的Page.onLoad(query) 中获取
     */
    path?: string;
    /**
     * 接口调用成功的回调函数
     */
    success?(data: object): void;
    /**
     * 接口调用失败的回调函数
     */
    fail?(err: object): void;
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    complete?(arg: object): void;
  }): Promise<void>;
}
