declare module 'uma' {
  interface InitParams {
    /**
     * @description
     * APP_KEY distributed by the Umeng<https://www.umeng.com/>
     */
    appKey: string;
    /**
     * @description
     * Whether or not to use openid for statistics, if this is false, the user statistics will be used by "Umeng" + random ID
     */
    useOpenid?: boolean | undefined;
    /**
     * @description If you need to get openid from the Umeng backend, please go to the Umeng backend to set the miniprogram's appId and secret
     */
    autoGetOpenid?: boolean | undefined;
    /**
     * @description debug mode
     */
    debug?: boolean | undefined;
  }

  type EventParams = string | { [key: string]: string };

  global {
    interface Uni {
      $uma: {
        init: (config: InitParams) => void;
        trackEvent: (eventName: string, eventParams?: EventParams) => void;
        setOpenid: () => void;
        setUserid: () => void;
        setUnionid: () => void;
        pause: () => void;
        resume: () => void;
      };
    }
  }
}
