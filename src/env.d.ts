/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  /** 网站标题，应用名称 */
  readonly VITE_APP_TITLE: string;
  /** 服务端口号 */
  readonly VITE_SERVER_PORT: string;
  /** 正式接口地址 */
  readonly VITE_SERVER_BASEURL: string;
  /** 开发接口地址 */
  readonly VITE_SERVER_BASEURL_DEV: string;
  /** H5是否需要代理 */
  readonly VITE_APP_PROXY: 'true' | 'false';
  /** H5是否需要代理，需要的话有个前缀 */
  readonly VITE_APP_PROXY_PREFIX: string; // 一般是/api
  /** 是否清除console */
  readonly VITE_DELETE_CONSOLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
