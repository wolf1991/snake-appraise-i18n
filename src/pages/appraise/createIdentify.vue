<template>
  <view>
    <view class="bg-white py-20rpx px-24rpx">
      <view class="flex-items-center h-90rpx">
        <view class="text-28rpx form_required">商品编号</view>
        <view class="flex-1 ml-24rpx">
          <u-input v-model="formData.appraiseCode" placeholder="请输入商品编号">
            <template #suffix><u-icon name="scan" size="46rpx" @click="scanHandle"></u-icon></template>
          </u-input>
        </view>
      </view>

      <view class="flex-items-center h-90rpx">
        <view class="text-28rpx form_required">商品品牌</view>
        <view class="flex-1 flex justify-end text-26rpx ml-24rpx" @click="brandPickerShow = true">
          <text class="text-info">{{ brandName || '请输入商品品牌' }}</text>
          <u-icon name="arrow-right" size="30rpx"></u-icon>
        </view>
      </view>

      <view class="flex-items-center h-90rpx">
        <view class="text-28rpx form_required">商品类目</view>
        <view class="flex-1 flex justify-end text-26rpx ml-24rpx" @click="catePickerShow = true">
          <text class="text-info">{{ cateName || '请输入商品类目' }}</text>
          <u-icon name="arrow-right" size="30rpx"></u-icon>
        </view>
      </view>

      <view class="flex items-start mt-20rpx">
        <view class="text-28rpx form_required">鉴定图片</view>
        <view class="flex-1 ml-24rpx">
          <u-upload
            :fileList="formData.imageList"
            :accept="accept"
            multiple
            @afterRead="afterRead"
            :maxCount="9"
            @delete="deleteImg"></u-upload>
        </view>
      </view>

      <view class="flex flex-col mt-20rpx" v-if="isAppraiser">
        <view class="text-28rpx">鉴定结果</view>
        <view class="mt-20rpx">
          <u-radio-group v-model="formData.status" @change="radioChange">
            <u-radio
              v-for="(item, index) in statusList"
              :key="index"
              :label="item.name"
              :name="item.value"
              v-if="showRadio"></u-radio>
          </u-radio-group>
        </view>
      </view>
    </view>

    <snake-select-picker
      :show="brandPickerShow"
      v-model="formData.brandId"
      v-model:searchValue="brandKey"
      filterable
      labelKey="name"
      valueKey="brandId"
      :columns="brandList"
      @scrolltolower="scrolltolower"
      @search="getBrandList('refresh')"
      @close="brandPickerShow = false"
      @confirm="brandPickerConfirm"></snake-select-picker>

    <snake-select-picker
      :show="catePickerShow"
      v-model="formData.categoryId"
      labelKey="cateName"
      valueKey="catId"
      :columns="categoryList"
      @close="catePickerShow = false"
      @confirm="catePickerConfirm"></snake-select-picker>

    <view class="snake-fixed-bottom">
      <view class="py-12rpx px-24rpx">
        <u-button type="primary" @click="submit">提交鉴定</u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getAppraiseCategoryListApi, getAppraiserCheckApi, getBrandListApi, getCreateDoAppraiseApi } from '@/api/appraise';

import uploader from '@/utils/uploader/uploader';
import graceChecker from '@/utils/js/graceChecker';

const brandPickerShow = ref(false);
const catePickerShow = ref(false);
const isAppraiser = ref(false);
const showRadio = ref(true);
const accept = ref('image');
const status = ref('');

const brandName = ref('');
const cateName = ref('');
const brandKey = ref('');

const page = ref(1);
const loadingStatus = ref('loadmore');

const brandList = ref([]);
const categoryList = ref([]);
const statusList = ref([
  {
    name: '鉴定为真',
    value: 'finish',
  },
  {
    name: '鉴别为假',
    value: 'fake',
  },
  {
    name: '无法鉴别',
    value: 'fail',
  },
]);

const formData = ref({
  appraiseCode: '',
  brandId: '',
  categoryId: '',
  imageList: [],
  status: '',
  // suggestion: '',
});

const rule = [
  {
    name: 'appraiseCode',
    checkType: 'string',
    checkRule: '1,',
    errorMsg: '请输入商品编号',
  },
  {
    name: 'brandId',
    checkType: 'string',
    checkRule: '1,',
    errorMsg: '请选择商品品牌',
  },
  {
    name: 'categoryId',
    checkType: 'string',
    checkRule: '1,',
    errorMsg: '请选择商品类目',
  },
  {
    name: 'imageList',
    checkType: 'notnull',
    errorMsg: '请上传图片',
  },
];

const getBrandList = async (type = '') => {
  if (type === 'refresh') {
    page.value = 1;
    brandList.value = [];
  }

  const response = await getBrandListApi({
    key: brandKey.value,
    page: page.value,
    size: 20,
  });

  if (response.success) {
    const newList = response.data?.items || [];
    brandList.value = brandList.value.concat(newList);

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

const getCategoryList = async () => {
  const response = await getAppraiseCategoryListApi();
  if (response.success) {
    categoryList.value = response?.data || [];
  } else {
    uni.$u.toast(response.msg);
  }
};

const getAppraiserCheck = async () => {
  const response = await getAppraiserCheckApi();
  if (response.success) {
    isAppraiser.value = response.data as boolean;
  } else {
    uni.$u.toast(response.msg);
  }
};

const radioChange = (e) => {
  if (e === status.value) {
    status.value = '';
    formData.value.status = '';
    showRadio.value = false;
    setTimeout(() => {
      showRadio.value = true;
    }, 100);
    return;
  }
  status.value = e;
  console.log('radioChange', e);
  console.log('formData.valu', formData.value.status);
};

const scrolltolower = () => {
  if (loadingStatus.value === 'loading') {
    getBrandList();
  }
};

const afterRead = async (event) => {
  // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
  let lists = [];
  lists = lists.concat(event.file);
  let fileListLen = formData.value.imageList.length;
  lists.forEach((item) => {
    formData.value.imageList.push({
      ...item,
      status: 'uploading',
      message: '上传中',
    });
  });

  for (let i = 0; i < lists.length; i++) {
    const result = await uploader.uploadOss(lists[i].url);

    console.log('result', result);
    const item = formData.value.imageList[fileListLen];
    formData.value.imageList.splice(
      fileListLen,
      1,
      Object.assign(item, {
        status: 'success',
        message: '',
        url: result.url,
      }),
    );
    fileListLen++;
  }
};

const deleteImg = (event) => {
  formData.value.imageList.splice(event.index, 1);
};

const scanHandle = () => {
  uni.scanCode({
    success: (res) => {
      formData.value.appraiseCode = res.result;
    },
  });
};

const brandPickerConfirm = (e) => {
  brandName.value = e.selectedItems[0].name;
  brandPickerShow.value = false;
};
const catePickerConfirm = (e) => {
  cateName.value = e.selectedItems[0].cateName;
  catePickerShow.value = false;
};

const submit = async () => {
  const checkRes = graceChecker.check(formData.value, rule);
  if (checkRes) {
    const formdata = {
      ...formData.value,
      imageList: formData.value.imageList.map((item) => item.url),
    };

    uni.showLoading({
      title: '提交中...',
      mask: true,
    });

    const response = await getCreateDoAppraiseApi(formdata);
    if (response.success) {
      uni.setStorageSync('createIdentify_data', {
        brandId: formData.value.brandId,
        brandName: brandName.value,
        categoryId: formData.value.categoryId,
        cateName: cateName.value,
      });

      formData.value.imageList = [];
      formData.value.appraiseCode = '';
      formData.value.status = '';
      uni.hideLoading();

      uni.showModal({
        title: '提示',
        content: (response.data as string) || '提交成功',
        showCancel: false,
      });
    } else {
      uni.hideLoading();
      uni.$u.toast(response.msg, 4000);
    }
  } else {
    uni.$u.toast(graceChecker.error);
  }
};

onLoad(async () => {
  const data = uni.getStorageSync('createIdentify_data');

  formData.value.brandId = data?.brandId || '';
  formData.value.categoryId = data?.categoryId || '';
  brandName.value = data?.brandName || '';
  cateName.value = data?.cateName || '';

  // #ifdef MP-WEIXIN
  accept.value = 'media';
  // #endif

  await getAppraiserCheck();
  await getBrandList();
  await getCategoryList();
});
</script>

<style lang="scss" scoped>
/* 表单 * 号 */
.form_required::before {
  content: '*';
  color: red;
}
</style>
