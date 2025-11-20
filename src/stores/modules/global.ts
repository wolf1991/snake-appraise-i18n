import { defineStore } from 'pinia';

interface GlobalState {}

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({}),
  getters: {},
  actions: {},
  persist: true,
});
