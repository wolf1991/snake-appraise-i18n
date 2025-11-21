<template>
  <view class="mt-20rpx">
    <view class="image-list">
      <block v-for="(item, index) in imageList" :key="index">
        <view class="image-item" @click="openImgEditor(item, index)">
          <image class="images-item__img" :src="$u.thumbnailZip(item.image)" mode="aspectFill"></image>
          <view @click.stop="selsectImage(item, index)" v-if="!item.disabled">
            <text v-if="item.checked" class="next-icons icon-selected image-item__icon" style="color: #2ebd7c"></text>
            <text v-else class="next-icons icon-notselected image-item__icon"></text>
          </view>
        </view>
      </block>
    </view>

    <snake-image-editor
      v-if="imgEditorShow"
      :show="imgEditorShow"
      :index="imgEditorIndex"
      :cid="`imageEditor_${imgEditorIndex}`"
      :bgImage="image"
      @close="imgEditorShow = false"
      @change="imageEditorChange"></snake-image-editor>

    <view class="h-124rpx pb-safe"></view>
    <view class="snake-fixed-bottom" style="background-color: #fff; z-index: unset">
      <view class="py-12rpx px-24rpx">
        <u-button color="#000000" customStyle="border-radius: 16rpx;" @click="clickComplete">{{ $t('common.complete') }}</u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { getAppraiseOrderDetailApi } from '@/api/appraise';
export default {
  data() {
    return {
      orderId: '',
      imageList: [],
      image: '',
      imgEditorShow: false,
      imgEditorIndex: null,
    };
  },
  async onLoad(option) {
    this.orderId = option.orderId;
    const list = uni.getStorageSync('image_select_list') || [];
    if (list.length) {
      this.imageList = list;
    } else {
      this.orderId && (await this.getDetail());
    }
  },
  methods: {
    // 获取详情
    async getDetail() {
      uni.showLoading({
        mask: true,
        title: uni.$t('common.loading'),
      });
      const params = {
        orderId: this.orderId,
      };
      const response = await getAppraiseOrderDetailApi(params);
      uni.hideLoading();
      if (response.success) {
        this.imageList = response.data?.imageList || [];
        this.imageList.forEach((item, index) => {
          this.$set(item, 'checked', false);
        });
        this.catId = response.data?.catId || '';
      } else {
        uni.$u.toast(response.msg);
      }
    },
    // 选择图片
    selsectImage(item, index) {
      if (item.disabled) {
        return;
      }
      item.checked = !item.checked;
    },
    // 打开编辑弹窗
    openImgEditor(item, index) {
      this.image = item.image;
      this.imgEditorIndex = index;
      this.imgEditorShow = true;
    },
    // 图片编辑完成回调
    imageEditorChange(e) {
      const { index: imageIndex, image } = e;
      const id = this.imageList[imageIndex].id;
      // 找出已经上传的新图索引
      const index = this.imageList.findIndex((f) => f.isNewImage && f.id === id);

      if (index > -1) {
        this.imageList[index].image = image;
      } else {
        // 将原图设置为禁选和重置选中
        this.$set(this.imageList[imageIndex], 'disabled', true);
        this.$set(this.imageList[imageIndex], 'checked', false);
        // 添加新图
        this.imageList.unshift({
          image,
          id,
          checked: false,
          isNewImage: true,
        });
      }
    },
    // 点击完成
    clickComplete() {
      const hintImageList = this.imageList.filter((item) => item.checked);
      if (!hintImageList.length) {
        return this.$u.toast(uni.$t('appraise.check.selectAtLeastOne'));
      }
      uni.setStorageSync('image_select_list', this.imageList);
      this.$u.getHistoryPage(-2).hintImageList.value = hintImageList;
      uni.navigateBack({
        delta: 2,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.image-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 28rpx;

  .image-item {
    width: 218rpx;
    height: 218rpx;
    margin-right: 20rpx;
    margin-bottom: 20rpx;
    position: relative;

    &:nth-child(3n) {
      margin-right: 0;
    }

    &__icon {
      position: absolute;
      right: 16rpx;
      bottom: 16rpx;
      color: #e8e8e8;
      font-size: 42rpx;
    }

    image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
</style>
