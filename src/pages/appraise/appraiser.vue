<template>
  <view>
    <u-sticky bg-color="#fff">
      <u-tabs
        :list="tabList"
        :current="tabCurrent"
        lineColor="#0F1113"
        :scrollable="false"
        keyName="label"
        :activeStyle="{ fontWeight: 600, fontSize: '32rpx', color: '#0F1113' }"
        :inactiveStyle="{ fontSize: '28rpx' }"
        @change="tabsChange"></u-tabs>

      <view class="px-24rpx py-10rpx flex-items-center">
        <u-search
          v-model="keyText"
          placeholder="请输入订单号/商品名称/货号/品牌"
          :showAction="false"
          customStyle="margin-right: 20rpx"
          @search="refreshList"></u-search>
        <!-- #ifndef MP-ALIPAY -->
        <u-select
          v-model:current="fromOrigin"
          label="筛选"
          :options="filterList"
          labelName="label"
          keyName="value"
          @select="refreshList">
          <template #optionItem="{ item }">
            <view class="text-center text-26rpx text-#888891" :class="[{ '!text-#26273a font-bold': fromOrigin === item.value }]">
              {{ item.label }}
            </view>
          </template>
        </u-select>
        <!-- #endif -->

        <!-- #ifdef MP-ALIPAY -->
        <!-- 支付宝插槽显示有问题 -->
        <selectFilter
          v-model:current="fromOrigin"
          label="筛选"
          :options="filterList"
          labelName="label"
          keyName="value"
          @select="refreshList">
          <template #optionItem="{ item }">
            <view class="text-center text-26rpx text-#888891" :class="[{ '!text-#26273a font-bold': fromOrigin === item.value }]">
              {{ item.label }}
            </view>
          </template>
        </selectFilter>
        <!-- #endif -->
      </view>
      <view class="flex-center h-60rpx bg-#f1f1f1 text-24rpx" @click="refreshList">点击刷新</view>
      <u-tabs
        v-if="tabCurrent === 1"
        :list="statusList"
        :current="statusCurrent"
        lineColor="#0F1113"
        keyName="label"
        :activeStyle="{ fontSize: '24rpx', color: '#0F1113' }"
        :inactiveStyle="{ fontSize: '24rpx', color: '#707184' }"
        customClass="bg-white"
        @change="statusChange"></u-tabs>
    </u-sticky>
    <!-- #ifdef MP-ALIPAY -->
    <view class="h-88rpx" v-if="tabCurrent === 1"></view>
    <!-- #endif -->

    <template v-for="(item, index) in orderList" :key="item.id">
      <orderHallItem
        :item="item"
        v-if="tabCurrent === 0"
        @click="$u.navTo(`/pages/appraise/appraiserDetail?orderId=${item.id}&type=orderHall`)"
        @clickOperate="operatehandle(item, index)" />
      <myOrderItem
        :item="item"
        v-if="tabCurrent === 1"
        @click="$u.navTo(`/pages/appraise/appraiserDetail?orderId=${item.id}&listIndex=${index}`)" />
    </template>
    <u-empty
      icon="https://cdn.puresnake.com/caas/d7fc1bd2ec6d485f9716f93b4dfe1f60.png"
      margin-top="160rpx"
      text="暂无数据~"
      v-if="orderList.length === 0"></u-empty>
    <u-loadmore :status="loadingStatus" customStyle="padding-bottom: 20rpx" v-if="orderList.length"></u-loadmore>

    <view class="pos-fixed right-48rpx bottom-360rpx" @click="$u.navTo('/pages/examPaper/examPaperList')" v-if="tabCurrent === 1">
      <view class="flex-col flex-center w-120rpx h-120rpx rounded-50% text-#fff bg-black">
        <text>刷题</text>
        <text>任务</text>
      </view>
    </view>
    <view
      class="pos-fixed right-48rpx bottom-200rpx"
      @click="$u.navTo('/pages/appraise/onlineEditing')"
      v-if="tabCurrent === 1 && isOptBtn">
      <view class="flex-col flex-center w-120rpx h-120rpx rounded-50% text-#fff bg-#06d290">
        <text>状态</text>
        <text>编辑</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import {
  getAppraiseAppraiserDoItApi,
  getAppraiseAppraiserMyselfApi,
  getAppraiseAppraiserOrderHallApi,
  getAppraiseUserDetailApi,
} from '@/api/appraise';
import type { LoadMoreProps } from '@/uni_modules/uview-plus/types/comps/loadMore';

import orderHallItem from './components/orderItems/orderHallItem.vue';
import myOrderItem from './components/orderItems/myOrderItem.vue';
import selectFilter from './components/select.vue';

const $u = uni.$u;

const page = ref(1);
const orderList = ref([]);
const loadingStatus = ref<LoadMoreProps['status']>('loadmore');

const isOptBtn = ref(false);

const keyText = ref('');
const tabCurrent = ref(0);
const tabList = ref([
  {
    label: '抢单大厅',
  },
  {
    label: '我的鉴别',
  },
]);

const fromOrigin = ref('');
const filterList = ref([
  {
    label: '全部',
    value: '',
  },
  {
    label: '2nd',
    value: '2nd',
  },
  {
    label: '潮盟',
    value: '潮盟',
  },
  {
    label: '回收',
    value: '回收',
  },
  {
    label: '云鉴',
    value: 'tb_yj',
  },
  {
    label: '入仓鉴定',
    value: 'rcjd',
  },
]);

const { statusCurrent, statusList, statusChange, getMyOrderList } = useMyOrder();

onLoad(() => {
  refreshList();
});

onPullDownRefresh(async () => {
  refreshList();
  await uni.$u.sleep(500);
  uni.stopPullDownRefresh();
});

onReachBottom(() => {
  if (tabCurrent.value === 0 && loadingStatus.value === 'loading') {
    getOrderHallList();
  }
  if (tabCurrent.value === 1 && loadingStatus.value === 'loading') {
    getMyOrderList();
  }
});

const tabsChange = (e) => {
  tabCurrent.value = e.index;
  fromOrigin.value = '';
  if (tabCurrent.value === 1) {
    getUserDetail();
  }
  refreshList();
};

// 刷新
const refreshList = () => {
  if (tabCurrent.value === 0) {
    getOrderHallList('refresh');
  } else {
    getMyOrderList('refresh');
  }
};

const getUserDetail = async () => {
  const response = await getAppraiseUserDetailApi();
  if (response.success) {
    isOptBtn.value = response.data?.optBtn || false;
  } else {
    uni.$u.toast(response.msg);
  }
};

const getOrderHallList = async (type = '') => {
  if (type === 'refresh') {
    page.value = 1;
    orderList.value = [];
  }

  const response = await getAppraiseAppraiserOrderHallApi({
    page: page.value,
    size: 20,
    key: keyText.value,
    fromOrigin: fromOrigin.value,
  });
  if (response.success) {
    const newList = response.data?.items || [];
    orderList.value = orderList.value.concat(newList);
    // 分页
    if (newList.length < 20) {
      loadingStatus.value = 'nomore';
    } else {
      loadingStatus.value = 'loading';
      page.value++;
    }
  } else {
    uni.$u.toast(response.msg);
  }
};

const operatehandle = async (item, index) => {
  const response = await getAppraiseAppraiserDoItApi({
    id: item.id,
  });
  if (response.success) {
    uni.$u.toast('抢单成功!');
    orderList.value.splice(index, 1);
  } else {
    uni.$u.toast(response.msg);
  }
};

function useMyOrder() {
  const statusCurrent = ref(0);
  const statusList = [
    {
      label: '等待鉴别',
      value: 'unappraised',
    },
    {
      label: '鉴别为真',
      value: 'finish',
    },
    {
      label: '鉴别为假',
      value: 'fake',
    },
    {
      label: '等待补图',
      value: 'need_img',
    },
    {
      label: '无法鉴别',
      value: 'fail',
    },
    {
      label: '全部',
      value: 'all',
    },
  ];

  const statusChange = (e) => {
    statusCurrent.value = e.index;
    getMyOrderList('refresh');
  };

  const getMyOrderList = async (type = '') => {
    if (type === 'refresh') {
      page.value = 1;
      orderList.value = [];
    }

    const response = await getAppraiseAppraiserMyselfApi({
      page: page.value,
      size: 20,
      key: keyText.value,
      fromOrigin: fromOrigin.value,
      status: statusList[statusCurrent.value].value,
    });
    if (response.success) {
      const newList = response.data?.items || [];
      orderList.value = orderList.value.concat(newList);
      // 分页
      if (newList.length < 20) {
        loadingStatus.value = 'nomore';
      } else {
        loadingStatus.value = 'loading';
        page.value++;
      }
    } else {
      uni.$u.toast(response.msg);
    }
  };

  return {
    statusCurrent,
    statusList,
    statusChange,
    getMyOrderList,
  };
}

defineExpose({
  getMyOrderList,
  loadingStatus,
  orderList,
});
</script>

<style lang="scss" scoped></style>
