<template>
  <view class="filter-sorts" id="filtersId" :style="[{ backgroundColor: bgcolor }, customStyle]">
    <view class="flex-1 flex items-center text-center" v-if="filters?.sortList?.length">
      <snake-drop-menu ref="dropMenuRef" custom-style="flex: 3; min-width: 0">
        <snake-drop-menu-item
          v-model="sortValue"
          :options="filters?.sortList"
          @change="confirmMenu"
          :before-toggle="handleBeforeToggle"></snake-drop-menu-item>
        <snake-drop-menu-item :title="grade" :before-toggle="handleBeforeToggle">
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
              <view class="filter-button confirm" @click="confirmMenu()">确定</view>
            </view>
          </view>
        </snake-drop-menu-item>
        <snake-drop-menu-item :title="size" :before-toggle="handleBeforeToggle">
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
              <view class="filter-button confirm" @click="confirmMenu()">确定</view>
            </view>
          </view>
        </snake-drop-menu-item>
      </snake-drop-menu>

      <view class="flex-1 flex items-center justify-center text-28rpx" @click="openFilter">
        <text class="mr-10rpx">筛选</text>
        <u-icon name="arrow-down" size="12" customStyle="line-height: unset !important;" />
      </view>
    </view>
    <!-- 筛选 -->
    <filterPopup
      ref="filterPopupRef"
      :show="showDrawer"
      :filter="filters"
      :customNavHeight="customNavHeight"
      @colse="closeDrawer"
      @confirm="filterConfirm"></filterPopup>
  </view>
</template>
<script>
import filterPopup from './components/filter-popup.vue';
export default {
  name: 'filter-sorts',
  components: {
    filterPopup,
  },
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
    priceFilterShow: {
      type: Boolean,
      default: true,
    },
    showTabs: {
      type: Boolean,
      default: true,
    },
    customStyle: {
      type: String,
      default: '',
    },
    customNavHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      sortValue: 'auto',
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
      // 系统信息
      systemInfo: {},
    };
  },
  computed: {
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
      params.sort = this.sortValue;
      params.gradeFilter = this.gradeValue.join(',');
      params.sizeFilter = this.sizeValue.join(',');
      return params;
    },
  },
  watch: {
    init: {
      handler(newVal) {
        this.sortIndex = newVal.sort || 0;
        this.sortValue = this.filters.sortList?.[this.sortIndex]?.value || 'auto';
      },
      deep: true,
    },
  },
  mounted() {
    this.systemInfo = uni.getSystemInfoSync();
  },
  methods: {
    closeDrawer() {
      uni.showTabBar({ animation: false });
      this.showDrawer = false;
    },
    filterConfirm(e) {
      this.$emit('change', {
        ...this.filterParams,
        ...e,
      });
      this.closeDrawer();
    },
    // 打开筛选
    openFilter() {
      this.$refs.dropMenuRef.colseAll();
      this.showDrawer = true;
      uni.hideTabBar({ animation: false });
    },
    handleBeforeToggle({ status, resolve }) {
      const query = uni.createSelectorQuery().in(this);
      query.selectViewport().scrollOffset();
      query.select('#filtersId').boundingClientRect();
      query.exec((res) => {
        const navbarHeight = 44;
        const tabsHeight = this.showTabs ? 38 : 0;
        let scrollTop = res[0].scrollTop + res[1].top - navbarHeight - tabsHeight;
        // #ifndef H5
        scrollTop = scrollTop - this.systemInfo.statusBarHeight;
        // #endif
        if (scrollTop > 0) {
          uni.pageScrollTo({
            scrollTop,
            duration: 0,
            success: () => {
              this.$refs.dropMenuRef.updateDropMenuRect();
              resolve(true);
            },
          });
        } else {
          this.$refs.dropMenuRef.updateDropMenuRect();
          resolve(true);
        }
      });
    },
    // (成色, 尺码)选择
    clickmenu(index, item, array = []) {
      if (array.includes(item.value)) {
        array.splice(array.indexOf(item.value), 1);
      } else {
        array.push(item.value);
      }
    },
    // 确认选择
    confirmMenu() {
      // 关闭成色, 尺码弹窗
      this.$refs.dropMenuRef.colseAll();
      this.$emit('change', this.filterParams);
    },
    // 重置所有内容
    initialAll() {
      this.brandValue = [];
      this.sizeValue = [];
      this.gradeValue = [];
    },
    // 成色选择重置
    resetGrade() {
      this.gradeValue = [];
      this.confirmMenu();
    },
    // 尺码选择重置
    resetSize() {
      this.sizeValue = [];
      this.confirmMenu();
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
  max-height: calc(435rpx - 110rpx);
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
</style>
