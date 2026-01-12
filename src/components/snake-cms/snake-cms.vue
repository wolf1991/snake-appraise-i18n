<template>
  <view v-if="componentsList.length" class="componentscom" :style="{ backgroundColor: pageInfo.bgColor }">
    <block v-for="(item, index) in componentsList" :key="index">
      <!-- 搜索 -->
      <commoditysearch v-if="item.component === 'commoditysearch'" :datas="item.setStyle" />
      <!-- 分割线 -->
      <auxiliarysegmentation v-if="item.component === 'auxiliarysegmentation'" :datas="item.setStyle" />
      <!-- 富文本 -->
      <richtext v-if="item.component === 'richtext'" :datas="item.setStyle" />
      <!-- 导航 -->
      <graphicnavigation v-if="item.component === 'graphicnavigation'" ref="graphicnavigationRef" :datas="item.setStyle" />
      <!-- 图片展示 -->
      <imgaes v-if="item.component === 'images'" :datas="item.setStyle" />
      <!-- 轮播 | 一行一个  -->
      <pictureads v-if="item.component === 'pictureads'" :datas="item.setStyle" />
      <!-- 魔方 -->
      <magiccube v-if="item.component === 'magiccube'" ref="magiccube" :datas="item.setStyle" />
      <!-- 公告 -->
      <u-notice-bar
        v-if="item.component === 'notice'"
        :datas="item.setStyle"
        :text="getText(item)"
        :bg-color="item.setStyle.backColor"
        :direction="item.setStyle.direction"
        :color="item.setStyle.textColor"
        :custom-style="{
          height: (item.setStyle.height || 72) + 'rpx',
          lineHeight: (item.setStyle.height || 72) + 'rpx',
          padding: `0 ${item.setStyle.pageMargin}rpx`,
        }"
        @click="handleNotice(item, index)" />
      <!-- 浮动层 -->
      <suspension v-show="item.component === 'suspension' && !isFilterSorts" :datas="item.setStyle" :scroll-top="scrollTop" />
      <!-- 优惠券 -->
      <coupon v-if="item.component === 'coupon'" :datas="item.setStyle" />
      <pagePopup v-if="item.component === 'pagePopup'" :datas="item.setStyle" />
      <view v-if="item.component === 'goodslist'" :style="{ backgroundColor: item.setStyle.backgroundColor }">
        <activity-session
          v-if="item.setStyle.activitySessionShow && item.setStyle.listType === 'auction'"
          :list="activityList"
          :current="activityCurrent"
          @change="activityCurrentChange" />
        <u-sticky
          v-if="item.setStyle.tabShow || item.setStyle.filterShow"
          :custom-nav-height="customNavHeight"
          :disabled="!item.setStyle.stickyDisabled"
          :bg-color="item.setStyle.backgroundColor">
          <view :style="`background-color: ${item.setStyle.backgroundColor};`">
            <u-tabs
              v-if="item.setStyle.tabShow && item.setStyle.tabslist.length"
              keyName="label"
              :list="item.setStyle.tabslist"
              :current="tabsCurrent"
              :activeStyle="{ color: '#000', fontWeight: 600, fontSize: '32rpx' }"
              :inactiveStyle="{ color: '#606266', fontSize: '26rpx' }"
              :lineWidth="25"
              :lineHeight="4"
              lineColor="#06D290"
              :bg-color="item.setStyle.backgroundColor"
              item-style="height: 38px;"
              @change="tabsHandle"></u-tabs>
            <filter-sorts
              v-if="item.setStyle.filterShow"
              ref="filterSortsRef"
              :filters="filters"
              :priceFilterShow="item.setStyle.filterParams.priceFilterShow"
              :bgColor="item.setStyle.backgroundColor"
              :showTabs="item.setStyle.tabShow && !!item.setStyle.tabslist.length"
              customStyle="padding: 0 20rpx;"
              :custom-nav-height="customNavHeight"
              :init="filtersSort"
              @change="confirmFilter" />
          </view>
        </u-sticky>
        <!-- 新商品列表 -->
        <goods-list
          :goods-list="goodsList"
          :attendanceShow="item.setStyle.attendanceShow"
          :bg-color="item.setStyle.backgroundColor"
          :page-margin="item.setStyle.pageMargin"
          :commodity-type="item.setStyle.commodityType"
          :image-margin="item.setStyle.imageMargin"
          :list-type="item.setStyle.listType"
          @item-click="handlerItemClick"
          @handlerOffer="handlerOffer" />
        <u-loadmore
          v-if="goodsList.length"
          :status="goodsStatus"
          :bgColor="item.setStyle.backgroundColor"
          :loadmoreText="$t('common.loadmoreText')"
          :loadingText="$t('common.loadingText')"
          :nomoreText="$t('common.nomoreText')" />
        <u-empty
          v-else
          :src="item.setStyle.emptySrc"
          :text="item.setStyle.emptyText"
          :text-color="item.setStyle.emptyColor"
          :custom-style="{ padding: '60px 0 300px', backgroundColor: item.setStyle.backgroundColor }" />
      </view>
      <!-- 自定义模块组件 -->
      <custommodule v-if="item.component === 'custommodule'" :datas="item.setStyle">
        <slot :name="item.setStyle.slotName" />
      </custommodule>
      <jumpApplet v-if="item.component === 'jumpApplet'" :datas="item.setStyle" />
      <follow v-if="item.component === 'follow'" :datas="item.setStyle" />
    </block>
    <!-- 回到顶部 -->
    <float v-if="goodsList.length && !isFilterSorts" :top="scrollTop" bottom="300rpx" background="transparent">
      <image
        v-show="scrollTop > 500"
        src="https://cdn.puresnake.com/joker/static/icon-totop.png"
        style="width: 80rpx; height: 80rpx"
        @click="handleToTop" />
    </float>
  </view>
</template>

<script>
import commoditysearch from './components/commoditysearch/index.vue';
import graphicnavigation from './components/graphicnavigation/index.vue';
import magiccube from './components/magiccube/index.vue';
import richtext from './components/richtext/richtext.vue';
import coupon from './components/coupon/index.vue';
import pagePopup from './components/page-popup/index.vue';
import goodsList from './components/goodsList/index.vue';
import auxiliarysegmentation from './components/auxiliarysegmentation/index.vue';
import pictureads from './components/pictureads/index.vue';
import custommodule from './components/custommodule/index.vue';
import suspension from './components/suspension/index.vue';
import follow from './components/follow/index.vue';
import jumpApplet from './components/jumpApplet/index.vue';
import imgaes from './components/imgaes/index.vue';
import activitySession from './components/activity-session/index.vue';
import filterSorts from './components/filter-sorts/index.vue';
import float from './components/float/index.vue';
export default {
  name: 'snake-cms',
  // 注册组件
  components: {
    commoditysearch,
    graphicnavigation,
    magiccube,
    richtext,
    goodsList,
    auxiliarysegmentation,
    pictureads,
    suspension,
    custommodule,
    follow,
    jumpApplet,
    imgaes,
    activitySession,
    filterSorts,
    coupon,
    pagePopup,
    float,
  },
  props: {
    pageInfo: {
      type: Object,
      default: () => ({}),
    },
    // 组件数据
    pageComponents: {
      type: Array,
      default: () => [],
    },
    // 页面滚动
    scrollTop: {
      type: [Number, String],
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    customNavHeight: {
      type: [Number, String],
      // #ifdef H5
      default: 44,
      // #endif
      // #ifndef H5
      // eslint-disable-next-line no-dupe-keys
      default: 0,
      // #endif
    },
  },
  data() {
    return {
      componentsList: [],
      page: 1,
      goodsList: [],
      goodsList2: [],
      goodsStatus: 'loadmore', // 加载状态
      goodsParams: {}, // 商品参数
      filters: {
        sortList: [],
        brandList: [],
        gradeList: [],
        sizeList: [],
      },
      // 活动列表
      activityList: [],
      activityCurrent: '001',
      // tabs
      tabsCurrent: 0,
      isFilterSorts: false,
      auctionSetParams: {},
      isRefresh: false,
    };
  },
  computed: {
    filtersSort() {
      const init = {};
      this.componentsList.forEach((item) => {
        if (item.component === 'goodslist') {
          this.filters.sortList.forEach((el, index) => {
            if (el.value === item.setStyle.filterParams.sort) {
              init.sort = index;
            }
          });
        }
      });
      return init;
    },
    // 热词列表
    textList() {
      let textList = [];
      this.componentsList.forEach((item) => {
        if (item.component === 'notice' && item.setStyle.textList?.length) {
          textList = item.setStyle.textList.map((el) => el.text);
        }
      });
      return textList;
    },
  },
  watch: {
    pageComponents: {
      immediate: true,
      handler(newVal) {
        this.componentsList = newVal;
        if (newVal.length) {
          this.init();
        }
      },
    },
  },
  methods: {
    getText(item) {
      if (item.setStyle.direction === 'row') {
        return item.setStyle.noticeText;
      } else if (Array.isArray(this.textList)) {
        return item.setStyle.noticeText;
      } else {
        return this.textList;
      }
    },
    async init() {
      await uni.$u.sleep();
      await this.getActivityList();
      await this.getFilter();
      await this.getGoodsList('refresh');
    },
    // 活动场次切换
    activityCurrentChange(item) {
      if (this.activityCurrent === item.id) return;
      this.activityCurrent = item.id;
      this.goodsParams.activityId = item.id === '001' ? '' : item.id;
      this.auctionSetParams = item;
      this.refreshGoodsList();
    },
    // tab切换
    tabsHandle(item) {
      this.tabsCurrent = item.index;
      this.goodsParams.categoryId = item.value || '';
      this.goodsParams.filterParam = {};
      this.$refs.filterSortsRef[0].initialAll();
      if (item.customList && item.customList.length !== 0) {
        const params = {};
        item.customList.forEach((item2) => {
          params[item2.customLabel] = item2.customValue;
        });
        this.goodsParams.filterParam = Object.assign(this.goodsParams.filterParam, params);
      }
      this.refreshGoodsList();
    },
    // 点击确定筛选
    async confirmFilter(params) {
      this.isRefresh = true;
      this.goodsParams.filterParam = params;
      await this.getGoodsList('refresh');
      await uni.$u.sleep(30);
      this.isRefresh = false;
    },
    // 获取活动场次列表
    async getActivityList() {
      for (const item of this.componentsList) {
        if (item.component === 'goodslist' && item.setStyle.activitySessionShow && item.setStyle.listType === 'auction') {
          const params = {
            type: 'auction',
            status: 'ing',
            subType: item.setStyle?.subType || '', // 场次类型
          };
          try {
            const response = await uni.$u.http.get('/mms/activity/list', {
              data: params,
            });
            if (response.success) {
              const newList = response.data.items || [];
              if (newList.length) {
                this.activityList = [
                  {
                    id: '001',
                    squareImage: 'https://cdn.puresnake.com/joker/static/all.png',
                    endTime: newList[0].endTime,
                    name: newList[0].name,
                    subtitle: newList[0].subtitle,
                    shareImage: newList[0].shareImage,
                    posterImage: newList[0].posterImage,
                  },
                  ...newList,
                ];
                this.auctionSetParams = this.activityList[0];
                if (this.pageInfo?.activityId) {
                  const itemData = this.activityList.find((el) => this.pageInfo.activityId === el.id);
                  const activityId = itemData.id === '001' ? '' : itemData.id;
                  this.auctionSetParams = itemData || this.activityList[0];
                  this.activityCurrent = activityId;
                  this.goodsParams.activityId = activityId;
                }
              } else {
                this.activityList = [];
              }
            }
          } catch (error) {
            uni.$u.toast(error.msg);
          }
          break;
        }
      }
    },
    // 获取筛选
    async getFilter() {
      for (const item of this.componentsList) {
        if (item.component === 'goodslist' && (item.setStyle.filterShow || item.setStyle.filterShow === 'custom')) {
          const params = {};
          // 初始参数 start
          if (item.setStyle.goodsListType === 'activity' || this.goodsParams?.activityId) {
            params.activityId = item.setStyle?.filterParams?.activityId || this.goodsParams?.activityId || '';
          }
          // end
          if (item.setStyle.listType === 'auction') {
            params.activityType = 'auction';
            params.subType = item.setStyle?.subType || ''; // 场次类型
          }
          // 类目id
          if (this.goodsParams.categoryId) {
            params.categoryId = this.goodsParams.categoryId;
          }
          try {
            const response = await uni.$u.http.get(item.setStyle.filterInterfaceUrl, { data: params });
            if (response.success) {
              this.filters = response.data || {};
              if (item.setStyle.tabShow !== 'custom') {
                const newCategoryList = response.data?.categoryList || [];
                if (newCategoryList.length) {
                  newCategoryList[0].label = '全部';
                }
                item.setStyle.tabslist = newCategoryList;
              }
            } else {
              uni.$u.toast(response.msg);
            }
          } catch (error) {
            uni.$u.toast(error.msg);
          }
          break;
        }
      }
    },
    // 加载更多
    loadMore() {
      if (this.goodsStatus === 'loading' && !this.isRefresh) {
        this.getGoodsList();
      }
    },
    // 重新请求列表
    async refreshGoodsList(param = {}) {
      this.isRefresh = true;
      this.goodsParams = Object.assign(this.goodsParams, param);
      await this.getFilter();
      await this.getGoodsList('refresh');
      await uni.$u.sleep(30);
      this.isRefresh = false;
    },
    // 获取商品列表
    getGoodsList(type = '') {
      this.componentsList.forEach(async (item) => {
        if (item.component === 'goodslist') {
          // 刷新
          if (type === 'refresh') {
            this.page = 1;
            this.goodsList = [];
          }
          // 列表参数
          let params = {
            page: this.page,
            size: item.setStyle?.filterParams?.pageSize || 20,
          };

          // 活动id
          if (item.setStyle.goodsListType === 'activity' && item.setStyle?.filterParams?.activityId) {
            params.activityId = item.setStyle.filterParams.activityId;
          }
          // 活动条件
          if (item.setStyle.goodsListType === 'activityStatus' || item.setStyle.goodsListType === 'activityCondition') {
            params.activityStatus = item.setStyle.filterParams.activityStatus;
            params.activityType = item.setStyle.filterParams.activityType;
            params.activityUserRule = item.setStyle.filterParams?.activityUserRule || '';
          }
          // 商品条件
          if (item.setStyle?.filterParams?.low || item.setStyle?.filterParams?.high) {
            params.low = item.setStyle?.filterParams?.low || '';
            params.high = item.setStyle?.filterParams?.high || '';
          }
          params.sellingDay = item.setStyle?.filterParams?.sellingDay || '';
          params.cateId = item.setStyle?.filterParams?.categoryId || '';

          params.sort = item.setStyle.filterParams.sort;
          params.showOutOfStock = item.setStyle.filterParams?.showOutOfStock || 0;

          if (item.setStyle.listType === 'auction') {
            params.activityType = 'auction'; // 商品类型
            params.activitySubType = item.setStyle?.subType || ''; // 场次类型
          }

          // 搜索key
          if (item.setStyle.key) {
            params.key = item.setStyle.key;
          }
          // 类目id
          if (this.goodsParams.categoryId) {
            params.cateId = this.goodsParams.categoryId;
          }
          // 场次id
          if (this.goodsParams?.activityId) {
            params.activityId = this.goodsParams?.activityId || '';
          }
          let barnds = [...(item.setStyle.filterParams?.brandNames || [])];
          // 筛选参数
          if (!this.$u.test.empty(this.goodsParams.filterParam || {})) {
            params = Object.assign({}, params, this.goodsParams.filterParam);
            if (this.goodsParams?.filterParam?.brandFilter) {
              barnds = barnds.concat(this.goodsParams?.filterParam?.brandFilter.split(','));
            }
          }
          params.brandFilter = barnds.join(',');

          uni.showLoading({
            title: '加载中...',
            mask: true,
          });
          const response = await uni.$u.http.get(item.setStyle.goodsInterfaceUrl, { data: params });
          uni.hideLoading();
          if (response.success) {
            const newList = response.data.items || [];
            this.goodsList = this.goodsList.concat(newList);
            // 分页判断
            if (newList.length < params.size) {
              this.goodsStatus = 'nomore';
            } else {
              this.goodsStatus = 'loading';
              this.page++;
            }
          } else {
            this.$u.toast(response.msg);
          }
        }
      });
    },
    // 跳转商品详情页
    handlerItemClick(item, index) {
      const pageObj = {
        pageId: this.pageInfo.pageId,
        pageName: encodeURIComponent(this.pageInfo.name),
      };
      if (uni.getStorageSync('old_cmsId')) {
        uni.setStorageSync('new_cmsId', pageObj);
      } else {
        uni.setStorageSync('old_cmsId', pageObj);
      }
      uni.$u.navTo(`/pages/buy/detail?goodsId=${item.id}&goodsIndex=${index}&cmsId=${this.pageInfo.pageId}`);
    },
    // 公告跳转
    handleNotice(item, index) {
      if (item.setStyle.direction === 'row') {
        uni.$u.navTo(item.setStyle.url);
      } else {
        uni.$u.navTo(item.setStyle.textList[index].url);
      }
    },
    // 点击报价或者修改报价
    handlerOffer(item, index) {
      this.handlerItemClick(item, index);
    },
    refresh_quotePay(price, index) {
      if (this.goodsList[index]?.activityInfo) {
        this.$set(this.goodsList[index].activityInfo, 'myPrice', price);
      }
    },
    // 回到顶部
    handleToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.componentscom {
  width: 100%;
}

::v-deep .u-tabs__wrapper__nav__line {
  border-radius: 2rpx !important;
  bottom: 0px !important;
}
</style>
