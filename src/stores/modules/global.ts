import { defineStore } from 'pinia';
import type { Locale } from '@/locales';
import { DEFAULT_LOCALE, setLocale, getLocale } from '@/locales';

interface GlobalState {
  locale: Locale;
}

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    locale: DEFAULT_LOCALE,
  }),
  getters: {
    currentLocale: (state) => state.locale,
  },
  actions: {
    initLocale() {
      console.log(getLocale());
      this.locale = getLocale();
    },
    updateLocale(locale: Locale) {
      this.locale = locale;
      setLocale(locale);
    },
  },
  persist: {
    paths: ['locale'],
  },
});
