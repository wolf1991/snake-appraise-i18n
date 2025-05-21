<template>
  <view id="filtersId" class="snake-px-36" :style="{ backgroundColor: bgcolor }">
    <u-dropdown ref="dropdown" @click="dropdownClick" @close="close">
      <u-dropdown-item title="智能排序" :value="sort">
        <view class="slot-content">
          <scroll-view scroll-y>
            <view class="snake-py-16 snake-px-24">
              <view
                class="filter-line"
                :class="sortIndex === index ? 'active' : ''"
                v-for="(item, index) in filters.sortList"
                :key="index"
                @click="handleClick(0, index)">
                {{ item.label }}
              </view>
            </view>
          </scroll-view>
        </view>
      </u-dropdown-item>
      <u-dropdown-item title="所有成色" :value="grade">
        <view class="slot-content">
          <scroll-view scroll-y class="select-items-column">
            <view class="select-items-flex">
              <view
                class="filter-button select-item-grade"
                :class="gradeValue.includes(item.value) ? 'active' : ''"
                v-for="(item, index) in filters.gradeList"
                :key="index"
                @click.stop="clickmenu(1, item, gradeValue)">
                <view class="hide-overflow">{{ item.label }}</view>
                <view v-if="item.desc" class="describe" :class="gradeValue.includes(item.value) ? 'active' : ''">
                  {{ item.desc }}
                </view>
              </view>
            </view>
          </scroll-view>
          <view class="select-bottom-column">
            <view class="filter-button reset" @click="resetGrade">重置</view>
            <view class="filter-button confirm" @click="confirmMenu(1)">确定</view>
          </view>
        </view>
      </u-dropdown-item>
      <u-dropdown-item title="所有尺码" :value="size">
        <view class="slot-content">
          <scroll-view scroll-y class="select-items-column">
            <view class="select-items-flex">
              <view
                class="filter-button select-item-size"
                :class="sizeValue.includes(item.value) ? 'active' : ''"
                v-for="(item, index) in filters.sizeList"
                :key="index"
                @click.stop="clickmenu(2, item, sizeValue)">
                {{ item.label }}
              </view>
            </view>
          </scroll-view>
          <view class="select-bottom-column">
            <view class="filter-button reset" @click="resetSize">重置</view>
            <view class="filter-button confirm" @click="confirmMenu(2)">确定</view>
          </view>
        </view>
      </u-dropdown-item>
      <u-dropdown-item title="筛选" :disabled="true" @change="change"></u-dropdown-item>
    </u-dropdown>

    <!-- 筛选 -->
    <u-popup mode="right" :show="showDrawer" @close="closeDrawer">
      <view class="popup-container" :style="{ paddingTop: customNavHeight + 'px' }" @touchmove.stop.prevent>
        <u-index-list
          ref="uIndexListRef"
          :customNavHeight="customNavHeight"
          :sticky="false"
          :index-list="brandGroupIndexList"
          inactiveColor="#ACACB7"
          activeColor="#26273A">
          <template v-slot:header>
            <view class="snake-pt-14 snake-px-24">
              <block v-if="filters.priceList">
                <view class="snake-title">价格区间</view>
                <view class="snake-flex-vcenter snake-space-between">
                  <input
                    class="drawer-select-item snake-text-center snake-w-252 snake-h-58"
                    style="width: 252rpx; height: 58rpx"
                    v-model="priceValue.low"
                    placeholder="最低价"
                    placeholder-style="color: #A8AAB0;" />
                  <text class="snake-fs-30 snake-mb-20" style="color: #a8aab0">-</text>
                  <input
                    class="drawer-select-item snake-text-center snake-w-252 snake-h-58"
                    v-model="priceValue.high"
                    placeholder="最高价"
                    placeholder-style="color: #A8AAB0;" />
                </view>
                <view class="select-items">
                  <view
                    class="drawer-select-item snake-w-169 snake-h-58"
                    v-for="(item, index) in filters.priceList"
                    :key="index"
                    :class="priceValue.low === item.low && priceValue.high === item.high ? 'active' : ''"
                    @click="selectPrice(item)">
                    {{ item.low }}{{ item.high ? `~${item.high}` : '' }}
                  </view>
                </view>
              </block>
              <!-- 我的出价 -->
              <block v-if="filters.join">
                <view class="snake-title">我的出价</view>
                <view class="select-items">
                  <view
                    class="drawer-select-item snake-w-169 snake-h-58 snake-black"
                    :class="statusValue.includes(item.value) ? 'active' : ''"
                    v-for="(item, index) in statusList"
                    :key="index"
                    @click="clickStatus(item)">
                    {{ item.label }}
                  </view>
                </view>
              </block>
              <!-- 会员权益 -->
              <block v-if="filters.jokerPriceStr || filters.packTag || filters.downBuy">
                <view class="snake-title">会员权益</view>
                <view class="select-items">
                  <view
                    v-if="filters.jokerPriceStr"
                    class="drawer-select-item snake-w-169 snake-h-58"
                    :class="jokerFilter ? 'active' : ''"
                    @click="clickJokerFilter">
                    {{ filters.jokerPriceStr }}
                  </view>
                  <view
                    v-if="filters.packTag"
                    class="drawer-select-item snake-w-169 snake-h-58"
                    :class="packTagFilter ? 'active' : ''"
                    @click="clickPackTagFilter">
                    {{ filters.packTag }}
                  </view>
                  <view
                    v-if="filters.packTag"
                    class="drawer-select-item snake-w-169 snake-h-58"
                    :class="downBuyFilter ? 'active' : ''"
                    @click="clickDownBuyFilter">
                    {{ filters.downBuy }}
                  </view>
                </view>
              </block>
            </view>
            <view class="snake-title snake-mx-24" style="margin: 0 24rpx" v-if="!this.$u.test.isEmpty(filters.brandGroup)">
              品牌列表
            </view>
          </template>
          <u-index-item v-for="(item, index) in brandGroupList" :key="index">
            <u-index-anchor
              :text="brandGroupIndexList[index]"
              v-if="brandGroupIndexList[index]"
              color="#26273A"
              bg-color="#F6F6F6"
              height="20"></u-index-anchor>
            <view
              class="snake-fs-24 snake-flex-vcenter snake-space-between snake-p-24"
              v-for="(cell, cellIndex) in item"
              :key="cellIndex"
              @click.stop="selectBrand(cell)">
              <text>{{ cell }}</text>
              <text
                v-if="brandValue.includes(cell)"
                class="next-icons icon-checkMark snake-fs-30 snake-pr-96 snake-green snake-fw-500"></text>
            </view>
          </u-index-item>
          <template v-slot:footer>
            <view style="height: 50px"></view>
          </template>
        </u-index-list>
        <!-- 底部按钮 -->
        <view class="filter-footer-bottom">
          <text class="btn__reset" @tap="filterReset">重置</text>
          <text class="btn__determine" @tap="confirmFilter">确认</text>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
export default {
  name: 'filter-sorts',
  props: {
    filters: {
      type: Object,
      default() {
        return {
          brandGroup: {},
          sortList: [],
          gradeList: [],
          sizeList: [],
        };
      },
    },
    bgcolor: {
      type: String,
      default: '#fff',
    },
    init: {
      type: Object,
      default() {
        return { sort: 0 };
      },
    },
    customNavHeight: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      statusList: [
        {
          label: '已报价',
          value: 'join',
        },
        {
          label: '未报价',
          value: 'not_join',
        },
      ],
      showDrawer: false,
      sortIndex: 0,
      brandValue: [],
      sizeValue: [],
      gradeValue: [],
      // 价格筛选
      priceValue: {
        low: '',
        high: '',
      },
      // 出价状态筛选
      statusValue: [],
      // 求客价商品筛选
      jokerFilter: false,
      packTagFilter: false,
      downBuyFilter: false,
      // 系统信息
      systemInfo: {},
      scrollTop: 0,
      headerHeight: 0,
    };
  },
  computed: {
    // 排序
    sort() {
      const gradeStr = this.filters?.sortList && this.filters.sortList[this.sortIndex]?.label;
      return gradeStr || '智能排序';
    },
    // 成色
    grade() {
      const gradeLabels = [];
      this.filters.gradeList &&
        this.filters.gradeList.forEach((val) => {
          if (this.gradeValue.includes(val.value)) {
            gradeLabels.push(val.label);
          }
        });
      const gradeStr = gradeLabels.join(',');
      return gradeStr || '所有成色';
    },
    // 尺码
    size() {
      const sizeLabels = [];
      this.filters.sizeList &&
        this.filters.sizeList.forEach((val) => {
          if (this.sizeValue.includes(val.value)) {
            sizeLabels.push(val.label);
          }
        });
      const sizeStr = sizeLabels.join(',');
      return sizeStr || '所有尺码';
    },
    // 筛选参数
    filterParams() {
      const params = {};
      params.sort = this.filters.sortList[this.sortIndex]?.value;
      params.gradeFilter = this.gradeValue.join(',');
      params.sizeFilter = this.sizeValue.join(',');
      params.brandFilter = this.brandValue.join(',');
      params.joinFilter = this.statusValue.join(',');
      params.low = this.priceValue.low || '';
      params.high = this.priceValue.high || '';
      params.jokerFilter = this.jokerFilter;
      params.packTagFilter = this.packTagFilter;
      params.downBuyFilter = this.downBuyFilter;
      return params;
    },
    brandGroupIndexList() {
      const list = [];
      for (const key in this.filters.brandGroup) {
        if (key === 'hot') {
          list.unshift(key);
        } else {
          list.push(key);
        }
      }
      return list;
    },
    brandGroupList() {
      const data = Object.assign({}, this.filters?.brandGroup || {});
      const hotCategory = data?.hot ? [data.hot] : [];
      delete data.hot;
      const dataArray = Object.values(data);
      const resultArray = [...hotCategory, ...dataArray];
      return resultArray;
    },
  },
  watch: {
    init(newVal) {
      this.sortIndex = newVal.sort;
    },
  },
  mounted() {
    this.systemInfo = uni.getSystemInfoSync();
    this.sortIndex = this.init.sort;
  },
  methods: {
    // 下拉弹窗打开触发
    dropdownClick(index, show) {
      const query = uni.createSelectorQuery().in(this);
      query.selectViewport().scrollOffset();
      query.select('#filtersId').boundingClientRect();
      query.exec((res) => {
        const navbarHeight = 44;
        const tabsHeight = 34;
        let scrollTop = res[0].scrollTop + res[1].top - navbarHeight - tabsHeight;

        // #ifndef H5
        scrollTop = scrollTop - this.systemInfo.statusBarHeight;
        // #endif

        if (scrollTop > 0) {
          uni.pageScrollTo({
            scrollTop,
            duration: 0,
            success: () => {
              this.$nextTick(() => {
                this.$refs.dropdown.children[index].getContentHeight();
              });
              this.$emit('change', { index, show });
            },
          });
        }
      });
    },
    // 下拉弹窗关闭触发
    close() {
      this.$emit('confirm', this.filterParams);
    },
    // 排序
    handleClick(index, index2) {
      this.sortIndex = index2;
      this.$refs.dropdown.close(index);
    },
    // (成色, 尺码)选择
    clickmenu(index, item, array = []) {
      if (array.includes(item.value)) {
        array.splice(array.indexOf(item.value), 1);
      } else {
        array.push(item.value);
      }
    },
    // (成色, 尺码) 确定
    confirmMenu(index) {
      this.$refs.dropdown.close(index);
    },
    // 打开更多筛选
    change() {
      uni.hideTabBar({ animation: false });
      this.showDrawer = true;
      uni.$u.sleep().then(() => {
        this.$refs.uIndexListRef.setIndexListLetterInfo();
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 0,
        });
        this.$emit('change', { index: 4, show: this.showDrawer });
      });
    },
    // 关闭更多筛选弹窗
    closeDrawer() {
      uni.showTabBar({ animation: true });
      this.showDrawer = false;
      this.$emit('change', {
        index: 4,
        show: this.showDrawer,
      });
    },
    // 重置所有内容
    initialAll() {
      this.brandValue = [];
      this.sizeValue = [];
      this.gradeValue = [];
      this.priceValue = {};
      this.statusValue = [];
      this.jokerFilter = false;
      this.packTagFilter = false;
      this.downBuyFilter = false;
    },
    // 成色选择重置
    resetGrade() {
      this.gradeValue = [];
      this.confirmMenu(2);
    },
    // 尺码选择重置
    resetSize() {
      this.sizeValue = [];
      this.confirmMenu(3);
    },
    // 会员价选择
    clickJokerFilter() {
      this.jokerFilter = !this.jokerFilter;
    },
    // 打包选择
    clickPackTagFilter() {
      this.packTagFilter = !this.packTagFilter;
    },
    // 还价选择
    clickDownBuyFilter() {
      this.downBuyFilter = !this.downBuyFilter;
    },
    // 我的出价 状态选择
    clickStatus(item) {
      if (this.statusValue.includes(item.value)) {
        this.statusValue.splice(this.statusValue.indexOf(item.value), 1);
      } else {
        this.statusValue = [];
        this.statusValue.push(item.value);
      }
    },
    // 价格选择
    selectPrice(item) {
      if (this.priceValue.low === item.low && this.priceValue.high === item.high) {
        this.priceValue = {};
      } else {
        this.priceValue = { ...item };
      }
    },
    // 品牌选择
    selectBrand(item) {
      if (this.brandValue.includes(item)) {
        const i = this.brandValue.indexOf(item);
        this.brandValue.splice(i, 1);
      } else {
        this.brandValue.push(item);
      }
    },
    // 更多筛选 重置
    filterReset() {
      this.priceValue = {
        low: '',
        high: '',
      };
      this.statusValue = [];
      this.jokerFilter = false;
      this.packTagFilter = false;
      this.downBuyFilter = false;
      this.brandValue = [];
      this.confirmFilter();
    },
    // 更多筛选 确认
    async confirmFilter() {
      uni.showTabBar({ animation: true });
      this.showDrawer = false;
      this.$emit('confirm', this.filterParams);
      await this.$emit('click-menu', this.show1 || this.show2 || this.show3 || this.showDrawer);
    },
  },
};
</script>

<style lang="scss" scoped>
.slot-content {
  width: 100%;
  height: 100%;
}

.select-items-column {
  margin: 30rpx 0 0;
  max-height: 435rpx;
}

.select-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  box-sizing: border-box;
}

.select-items-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 25rpx;
}

.select-items::after {
  content: '';
  flex-basis: 220rpx;
  /* 或者flex: 1 */
}

.select-bottom-column {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  margin: 20rpx 24rpx 20rpx;
}

.filter-line {
  line-height: 56rpx;
  font-size: 26rpx;
}

.filter-line.active {
  color: #06d290;
}

.filter-button {
  box-sizing: border-box;
  border-radius: 4rpx;
  line-height: 58rpx;
  text-align: center;
}

.select-item-grade {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 343rpx;
  height: 92rpx;
  background: #eff1f4;
  font-size: 26rpx;
  color: #1f1f27;
  margin-bottom: 20rpx;
  // padding: 0 20rpx;
  text-align: center;

  &.active {
    background: #2ebd7c33;
    color: #52bc7a;
    border: 1px solid #52bc7a;
  }
}

.select-item-size {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220rpx;
  height: 70rpx;
  background: #eff1f4;
  font-size: 26rpx;
  color: #1f1f27;
  margin-bottom: 20rpx;
  line-height: 26rpx;
  padding: 0 20rpx;
  text-align: center;

  &.active {
    background: #2ebd7c33;
    color: #52bc7a;
    border: 1px solid #52bc7a;
  }
}

.describe {
  color: #929296;
  font-size: 22rpx;
  line-height: 30rpx;

  &.active {
    color: #52bc7a;
  }
}

.drawer-select-item {
  width: 169rpx;
  height: 58rpx;
  line-height: 58rpx;
  background: #f1f2f4;
  color: #0f1113;
  margin-bottom: 20rpx;
  font-size: 24rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: 4rpx;
  text-align: center;
  box-sizing: border-box;
  display: inline-block;

  &.active {
    background: #2ebd7c33;
    color: #52bc7a;
    border: 1px solid #52bc7a;
  }
}

.reset {
  width: 221rpx;
  height: 70rpx;
  color: #2ebd7c;
  border: 2rpx solid #2ebd7c;
  font-size: 28rpx;
  line-height: 70rpx;
}

.confirm {
  width: 460rpx;
  height: 70rpx;
  background: #2ebd7c;
  color: #ffffff;
  font-size: 28rpx;
  line-height: 70rpx;
}

/* 标题及更多 */
.snake-title {
  padding: 10rpx 0;
  line-height: 2em;
  display: flex;
  flex-wrap: nowrap;
  font-size: 28rpx;
  justify-content: space-between;
  font-weight: bold;
  align-items: center;
}

.hide-overflow {
  font-size: 26rpx;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 28rpx;
}

.popup-container {
  width: 600rpx;
  height: 100%;
}

.filter-footer-bottom {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 600rpx;
  height: 98rpx;
  z-index: 21;
  text-align: center;
  padding-bottom: 12rpx;
  font-size: 24rpx;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  .btn__reset {
    width: 204rpx;
    height: 70rpx;
    line-height: 70rpx;
    border: 2rpx solid #dcdde0;
    color: #888891;
    border-radius: 4rpx;
  }

  .btn__determine {
    width: 312rpx;
    height: 74rpx;
    line-height: 74rpx;
    margin-left: 20rpx;
    color: #ffffff;
    background: #06d290;
    border-radius: 4rpx;
  }
}
</style>
