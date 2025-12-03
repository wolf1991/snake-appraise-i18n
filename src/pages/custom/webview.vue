<template>
  <web-view :webview-styles="webviewStyles" :src="webviewUrl"></web-view>
</template>

<script>
export default {
  data() {
    return {
      wv: null,
      webviewUrl: '',
      webviewStyles: { progress: { color: '#FF3333' } },
    };
  },
  onLoad(options) {
    usePageTitle('pages.webview');
    // console.log('options', options);
    const { title = '', url = '' } = options;
    this.webviewUrl = decodeURIComponent(decodeURIComponent(decodeURIComponent(url)));
    const query = uni.$u.getQueryParams(this.webviewUrl);

    if (title || query.title) {
      uni.setNavigationBarTitle({ title: title || query.title });
    }
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
