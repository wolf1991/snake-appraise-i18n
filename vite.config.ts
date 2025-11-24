import { defineConfig, loadEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import UniManifest from '@uni-helper/vite-plugin-uni-manifest';
import path from 'node:path';
// @see https://uni-helper.js.org/vite-plugin-uni-layouts
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts';
// @see https://unocss.dev/
import UnoCSS from 'unocss/vite';
import ViteRestart from 'vite-plugin-restart';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default ({ command, mode }) => {
  // console.log(mode === process.env.NODE_ENV) // true

  // mode: 区分生产环境还是开发环境
  console.log('command, mode -> ', command, mode);
  // pnpm dev:h5 时得到 => serve development
  // pnpm build:h5 时得到 => build production
  // pnpm dev:mp-weixin 时得到 => build development (注意区别，command为build)
  // pnpm build:mp-weixin 时得到 => build production
  // pnpm dev:app 时得到 => build development (注意区别，command为build)
  // pnpm build:app 时得到 => build production
  // dev 和 build 命令可以分别使用 .env.development 和 .env.production 的环境变量

  const { UNI_PLATFORM } = process.env;
  console.log('UNI_PLATFORM -> ', UNI_PLATFORM); // 得到 mp-weixin, h5, app 等
  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'));
  const {
    VITE_APP_PORT,
    VITE_SERVER_BASEURL,
    VITE_SERVER_BASEURL_DEV,
    VITE_DELETE_CONSOLE,
    VITE_SHOW_SOURCEMAP,
    VITE_APP_PROXY,
    VITE_APP_PROXY_PREFIX,
  } = env;
  console.log('环境变量 env -> ', env);

  return defineConfig({
    envDir: './env', // 自定义env目录
    // 定义全局变量
    define: {
      'process.env': env,
      __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
      __VITE_APP_PROXY__: JSON.stringify(VITE_APP_PROXY),
    },
    plugins: [
      UniLayouts(),
      UniManifest(),
      uni(),
      UnoCSS(),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ['vite.config.js'],
      }),
      // 打包分析插件，h5 + 生产环境才弹出
      UNI_PLATFORM === 'h5' &&
        mode === 'production' &&
        visualizer({
          filename: 'stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
    ],
    resolve: {
      alias: {
        '@': path.join(process.cwd(), './src'),
        '@img': path.join(process.cwd(), './src/static/images'),
      },
    },
    server: {
      host: '0.0.0.0',
      hmr: true,
      port: Number.parseInt(VITE_APP_PORT, 10),
      // 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
      proxy: JSON.parse(VITE_APP_PROXY)
        ? {
            [VITE_APP_PROXY_PREFIX]: {
              target: mode === 'development' ? VITE_SERVER_BASEURL_DEV : VITE_SERVER_BASEURL,
              changeOrigin: true,
              rewrite: (path) => path.replace(new RegExp(`^${VITE_APP_PROXY_PREFIX}`), ''),
            },
          }
        : undefined,
    },
    build: {
      // 方便非h5端调试
      sourcemap: VITE_SHOW_SOURCEMAP === 'true', // 默认是false
      target: 'es6',
      // 开发环境不用压缩
      minify: mode === 'development' ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: VITE_DELETE_CONSOLE === 'true',
          drop_debugger: true,
        },
      },
      // 启用代码分割优化
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // 设置chunk的文件名格式
          chunkFileNames: 'assets/js/[name]-[hash].js',
          // 设置入口文件的文件名格式
          entryFileNames: 'assets/js/[name]-[hash].js',
          // 设置静态资源文件的文件名格式
          assetFileNames: 'assets/[ext]/[name].[ext]',
          // 手动代码分割，优化加载性能
          manualChunks(id) {
            // 将 node_modules 中的依赖单独打包
            if (id.includes('node_modules')) {
              // uview-plus 单独打包
              if (id.includes('uview-plus')) {
                return 'uview-plus';
              }
              // vue 相关单独打包
              if (id.includes('vue') || id.includes('pinia')) {
                return 'vue-vendor';
              }
              // 其他第三方库
              return 'vendor';
            }
          },
        },
      },
    },
  });
};
