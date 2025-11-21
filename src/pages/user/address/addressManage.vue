<template>
  <view class="pt-20rpx px-24rpx">
    <form class="snake-form">
      <view class="bg-white px-28rpx box-border">
        <view class="snake-form-item snake-border-b flex-items-center">
          <text class="snake-form-label snake-black">{{ $t('common.consignee') }}</text>
          <view class="snake-form-body">
            <input
              type="text"
              class="snake-form-input"
              name="name"
              v-model="addressData.name"
              :placeholder="$t('common.useRealName')"
              placeholder-class="placeholder" />
          </view>
        </view>
        <view class="snake-form-item snake-border-b">
          <text class="snake-form-label snake-black">{{ $t('common.phoneNumber') }}</text>
          <view class="snake-form-body">
            <input
              type="number"
              class="snake-form-input"
              name="phone"
              v-model="addressData.phone"
              :maxlength="11"
              :placeholder="$t('common.enterPhoneNumber')"
              placeholder-class="placeholder" />
          </view>
        </view>
        <view class="snake-form-item snake-border-b">
          <text class="snake-form-label snake-black">{{ $t('common.region') }}</text>
          <view class="snake-form-body flex-center" @tap="openPicker">
            <view
              type="text"
              class="snake-form-input snake-gray7 py-4rpx"
              name="area"
              :class="{ placeholder: addressData.area === '' }">
              {{ addressData.area || $t('common.clickToSelect') }}
            </view>
            <text class="next-icons icon-arrow-right text-32rpx snake-gray7"></text>
          </view>
        </view>
        <view class="snake-form-item !items-start">
          <text class="snake-form-label snake-black">{{ $t('common.detailAddress') }}</text>
          <view class="snake-form-body">
            <textarea
              type="text"
              class="address-manager-textarea"
              name="detail"
              v-model="addressData.detail"
              :placeholder="$t('common.enterDetailAddress')"
              placeholder-class="placeholder"></textarea>
          </view>
        </view>
      </view>
      <view class="bg-white mt-20rpx px-28rpx box-border">
        <view class="snake-form-item h-100rpx">
          <view style="flex-shrink: 0">
            <text class="text-28rpx snake-black">{{ $t('common.setAsDefaultAddress') }}</text>
            <text class="text-22rpx snake-gray ml-6rpx">({{ $t('common.defaultAddressHint') }})</text>
          </view>
          <view class="snake-form-body flex justify-end">
            <switch
              name="defaulted"
              :checked="addressData.defaulted"
              @change="switchChange"
              color="#06d290"
              style="transform: scale(0.8)" />
          </view>
        </view>
      </view>
      <view class="py-40rpx">
        <u-button
          type="primary"
          shape="circle"
          border
          :throttleTime="600"
          customStyle="height: 88rpx; font-size: 32rpx"
          @click="formSubmit">
          {{ $t('common.save') }}
        </u-button>
        <!-- <u-button
          v-if="addressData.id"
          type="primary"
          shape="circle"
          plain
          customStyle="height: 88rpx; font-size: 32rpx; margin-top: 28rpx"
          @click="deleteAddress">
          删除地址
        </u-button> -->
        <!-- #ifdef MP-WEIXIN -->
        <u-button
          v-if="!addressData.id"
          type="success"
          shape="circle"
          customStyle="height: 88rpx; font-size: 32rpx; margin-top: 28rpx"
          @click="importAddress">
          {{ $t('common.importWechatAddress') }}
        </u-button>
        <!-- #endif -->
      </view>
    </form>
    <snake-city-picker
      :show="showCityPicker"
      :defaultNames="defaultNames"
      closeOnClickOverlay
      @cancel="showCityPicker = false"
      @confirm="confirmCityPicker"></snake-city-picker>
  </view>
</template>
<script>
import { getAddressGet, postAddressSave } from '@/api/user';
import graceChecker from '@/utils/js/graceChecker';

export default {
  data() {
    return {
      addressId: '',
      type: 'default',
      manageType: 'new',
      showCityPicker: false,
      addressData: {
        name: '',
        phone: '',
        province: '',
        city: '',
        county: '',
        detail: '',
        area: '',
        areaCode: '',
        defaulted: false,
      },
      rule: [
        {
          name: 'name',
          checkType: 'string',
          checkRule: '1,10',
          errorMsg: uni.$t('common.consigneeLengthError'),
        },
        {
          name: 'phone',
          checkType: 'phoneno',
          checkRule: '',
          errorMsg: uni.$t('common.enterCorrectPhone'),
        },
        {
          name: 'area',
          checkType: 'string',
          checkRule: '1,100',
          errorMsg: uni.$t('common.selectRegion'),
        },
        {
          name: 'detail',
          checkType: 'string',
          checkRule: '5,100',
          errorMsg: uni.$t('common.detailAddressMinLength'),
        },
      ],
    };
  },
  computed: {
    defaultNames() {
      return [this.addressData.province, this.addressData.city, this.addressData.county];
    },
  },
  async onLoad(options) {
    const { type, addressId } = options || {};
    this.addressId = addressId;

    if (this.addressId) {
      await this.getAddressDetail();
    }

    if (type === 'edit') {
      this.manageType = 'update';

      if (!this.addressData.area) {
        this.addressData.area = `${this.addressData.province} ${this.addressData.city} ${this.addressData.county}`;
      }
    }
    uni.setNavigationBarTitle({ title: type === 'edit' ? uni.$t('pages.addressManage') : uni.$t('common.addAddress') });
  },
  methods: {
    switchChange(e) {
      this.addressData.defaulted = e.detail.value;
    },
    // 获取地址详情
    async getAddressDetail() {
      const response = await getAddressGet({
        id: this.addressId,
      });
      if (response.success) {
        this.addressData = { ...this.addressData, ...(response.data || {}) };
        this.addressData.defaulted = Boolean(this.addressData.isDefault);
      } else {
        uni.$u.toast(response.msg);
      }
    },
    // 打开地址选择
    openPicker() {
      this.showCityPicker = true;
    },
    confirmCityPicker(e) {
      this.addressData = Object.assign({}, this.addressData, {
        province: e.value[0].text,
        city: e.value[1].text,
        county: (e.value[2] && e.value[2].text) || '',
        areaCode: (e.value[2] && e.value[2].code) || '000000',
        area: `${e.value[0].text} ${e.value[1].text} ${(e.value[2] && e.value[2].text) || ''}`,
      });
    },
    // 删除
    deleteAddress() {
      uni.showModal({
        content: uni.$t('common.confirmDelete'),
        success: (res) => {
          if (res.confirm) {
            this.addressData.deleted = 1;
            this.formSubmit({ ops: 'del' });
          } else if (res.cancel) {
            console.log(res);
          }
        },
      });
    },
    // 表单提交
    async formSubmit(e = {}) {
      let checkRes = false;
      if (e.ops === 'del') {
        checkRes = true;
      } else {
        checkRes = graceChecker.check(this.addressData, this.rule);
      }

      if (checkRes) {
        const response = await postAddressSave(this.manageType, {
          ...this.addressData,
          isDefault: Number(this.addressData.defaulted),
        });
        if (response.success) {
          uni.$u.toast(e.ops === 'del' ? uni.$t('common.deleteAddressSuccess') : uni.$t('common.saveSuccess'));
          await uni.$u.sleep(500);
          uni.navigateBack();
        } else {
          uni.$u.toast(response.msg);
        }
      } else {
        uni.$u.toast(graceChecker.error);
      }
    },
    importAddress() {
      uni.chooseAddress({
        success: (res) => {
          this.addressData.name = res.userName;
          this.addressData.phone = res.telNumber;
          this.addressData.province = res.provinceName;
          this.addressData.city = res.cityName;
          this.addressData.county = res.countyName;
          this.addressData.detail = res.detailInfo;
          this.addressData.area = `${res.provinceName} ${res.cityName} ${res.countyName}`;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* 表单 */
.snake-form {
}

.snake-form-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.snake-form-label {
  height: unset;
  line-height: normal;
  margin: 30rpx 0;
  width: calc(120rpx + 15rpx);
}

.snake-form-body {
  width: 700rpx;
  margin-left: 20rpx;
  flex: 1;
  overflow: hidden;
}

.snake-form-input {
  width: 100%;
  font-size: 28rpx;
  text-align: left;
  color: #26273a;
}

.address-manager-textarea {
  box-sizing: border-box;
  width: 100%;
  height: 160rpx;
  margin: 30rpx 0;
  text-align: left;
  font-size: 28rpx;
}

::v-deep .placeholder {
  color: #808080 !important;
  font-size: 28rpx;
}
</style>
