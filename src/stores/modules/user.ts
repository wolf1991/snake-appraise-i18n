import { defineStore } from 'pinia';

interface IUserState {
  userInfo: IUserInfo;
  inviter: string | number;
}

export const useUserStore = defineStore('user', {
  state: (): IUserState => ({
    userInfo: {},
    inviter: '', // 邀请人
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
    setInviter(val: IUserState['inviter']) {
      this.inviter = val;
    },
  },
  persist: true, // 启用持久化
});
