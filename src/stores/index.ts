import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate'; // 数据持久化

// 创建 pinia 实例
const pinia = createPinia();
// 使用持久化存储插件
pinia.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  }),
);

export default pinia;

// 模块统一导出
export * from './modules/user';
export * from './modules/global';
