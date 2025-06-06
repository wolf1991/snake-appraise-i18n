// 全局要用的类型放到这里

declare global {
  // 响应数据结构
  interface IResData<T> {
    success: boolean;
    status: number;
    msg: string;
    data: T;
    // token 只在登录接口时有值，其他接口没有
    token?: string;
  }

  // 分页响应参数
  interface IResPage<T = unknown> {
    items: T[];
    page: number;
    perPage: number;
    total: number;
  }

  // 用户信息
  type IUserInfo = {
    userId?: string | number;
    mobile?: string;
    username?: string;
    nickname?: string;
    logo?: string;
    /** 微信的 openid，非微信没有这个字段 */
    openid?: string;
    token?: string;
    refreshToken?: string;
    expire?: number;
    [key: string]: any;
  };
}

export {}; // 防止模块污染
