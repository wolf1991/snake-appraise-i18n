declare module 'uview-plus' {
  interface IProps {
    image: {
      bgColor?: string;
    };
  }

  interface IHttp {
    request: <T = unknown>(url: string, data?: any) => Promise<T>;
    get: <T>(url: string, data?: any) => Promise<IResData<T>>;
    post: <T>(url: string, data?: any) => Promise<IResData<T>>;
    setConfig: (config: Partial<GlobalConfig.config>) => void;
    interceptors: {
      request: {
        use: (config: any, config: any) => void;
      };
      response: {
        use: (config: any, config: any) => void;
      };
    };
  }

  interface $u {
    props: IProps;
    http: IHttp;
    /**
     * @description 进行延时，以达到可以简写代码的目的 比如: await uni.$u.sleep(20)将会阻塞20ms
     * @param {number} value 堵塞时间 单位ms 毫秒
     * @returns {Promise} 返回promise
     */
    sleep: (ms: number) => Promise<void>;
    /**
     * @description 运行期判断平台
     * @returns {string} 返回所在平台(小写)
     * @link 运行期判断平台 https://uniapp.dcloud.io/frame?id=判断平台
     */
    os: () => string;
    /**
     * @param {Number} len uuid的长度
     * @param {Boolean} firstU 将返回的首字母置为"u"
     * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
     */
    guid: (len: number, firstU?: boolean, radix?: number | null) => string;
    /**
     * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
     * @param {string|number} value 需要添加单位的值
     * @param {string} unit 添加的单位名 比如px
     */
    addUnit: (value: string | number, unit?: string) => string;
    /**
     * 显示消息提示框
     * @param {String} title 提示的内容，长度与 icon 取值有关。
     * @param {Number} duration 提示的延迟时间，单位毫秒，默认：2000
     */
    toast: (title: string, duration?: number) => void;
    /**
     * @description 格式化时间
     * @param {String|Number} dateTime 需要格式化的时间戳
     * @param {String} fmt 格式化规则 yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合 默认yyyy-mm-dd
     * @returns {string} 返回格式化后的字符串
     */
    timeFormat: (date?: Date, format?: string) => string;
    /**
     * @description 对象转url参数
     * @param {object} data,对象
     * @param {Boolean} isPrefix,是否自动加上"?"
     * @param {string} arrayFormat 规则 indices|brackets|repeat|comma
     */
    queryParams: (data: any, isPrefix?: boolean, arrayFormat?: string) => void;

    // 自定义的
    /**
     * @description 格式化时间
     * @param {String|Number} dateTime 需要格式化的时间戳
     * @param {String} fmt 格式化规则 yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合 默认yyyy-mm-dd
     * @returns {string} 返回格式化后的字符串
     */
    formatTime: (date?: Date, format?: string) => string;
    /**
     * oss 图片缩放,按宽高处理
     * @param {String} value 图片src地址
     * @param {number} w 图片resize大小
     * @return {String} 图片resize后的src地址
     */
    imageResize: (value: any, w: number) => string;
    /**
     * 缩略图
     *
     * @param {string} value - 原始图片的URL
     * @returns {string} - 处理后的URL
     */
    thumbnailZip: (value: any) => string;
    /**
     * 从URL中获取查询参数并返回对象
     *
     * @param url 包含查询参数的URL字符串
     * @returns 返回包含查询参数的对象，如果URL中没有查询参数，则返回空对象
     */
    getQueryParams: (url: string) => any;
    /**
     * 跳转页面
     *
     * @param {string} url - 要跳转的页面路径
     * @param {string} [linkType='navigateTo'] - 跳转类型，可选值为 'navigateTo', 'redirectTo', 'reLaunch', 'switchTab'
     */
    navTo: (url: string) => void;
    /**
     * 将文本复制到剪贴板
     *
     * @param {string} [copyText=''] - 要复制的文本，默认为空字符串
     * @param {Function} [callback] - 复制成功后的回调函数
     */
    copy: (copyText: string, callback?: () => void) => void;

    numFormat: (value: number) => string;
    /**
     * 获取页面历史栈指定层实例
     * @param back {number} [0] - 0或者负数，表示获取历史栈的哪一层，0表示获取当前页面实例，-1 表示获取上一个页面实例。默认0。
     */
    getHistoryPage: (back: number) => any;
  }

  global {
    interface Uni {
      $u: $u;
    }
  }
}
