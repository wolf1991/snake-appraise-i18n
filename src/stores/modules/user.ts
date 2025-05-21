import { defineStore } from 'pinia';

interface IUserState {
  userInfo: IUserInfo;
}

export const useUserStore = defineStore('user', {
  state: (): IUserState => ({
    userInfo: {},
  }),
  getters: {
    isLogined: (state) => !!state.userInfo.token,
  },
  actions: {
    setUserInfo(val: IUserInfo) {
      this.userInfo = val;
    },
    clearUserInfo() {
      this.userInfo = {};
    },
  },
  persist: true, // 启用持久化
});
