<template>
  <u-picker
    ref="uPicker"
    :show="show"
    :columns="columns"
    :defaultIndex="defaultIndexValue"
    :closeOnClickOverlay="closeOnClickOverlay"
    @confirm="confirm"
    @cancel="cancel"
    @change="changeHandler"
    @close="cancel"></u-picker>
</template>

<script>
/**
 * snake-city-picker
 * @description 地址选择器
 * @property {Boolean}			show				是否显示picker弹窗（默认 false ）
 * @property {Array}			columns				对象数组，设置每一列的数据
 * @property {Boolean}			closeOnClickOverlay	是否允许点击遮罩关闭选择器（默认 false ）
 * @property {Array}			defaultIndex		各列的默认索引
 * @event {Function} cancel		点击取消按钮触发
 * @event {Function} confirm	点击确定按钮，返回当前选择的值
 */
import { getProvinces, getCitys, getAreas, citysJson } from './city-data/city-util';
export default {
  name: 'snake-city-picker',
  props: {
    // 是否展示picker弹窗
    show: {
      type: Boolean,
      default: false,
    },
    // 各列的默认索引
    defaultIndexs: {
      type: Array,
      default: () => [0, 0, 0],
    },
    // 各列的名称
    defaultNames: {
      type: Array,
      default: () => [],
    },
    // 各列的code
    defaultCodes: {
      type: Array,
      default: () => [],
    },
    // 传入['广东'] 只能选择广东
    provinceList: {
      type: Array,
      default: () => [],
    },
    // 是否允许点击遮罩关闭选择器
    closeOnClickOverlay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      origiData: citysJson, // 获取到的原始数据
      defaultIndexValue: [0, 0, 0],
    };
  },
  computed: {
    provinces() {
      let provinces = getProvinces();
      if (this.provinceList.length) {
        provinces = provinces.filter((item) => this.provinceList.includes(item.text));
      }
      return provinces;
    },
    citys() {
      return getCitys(this.defaultIndexValue[0]);
    },
    areas() {
      return getAreas(this.defaultIndexValue[0], this.defaultIndexValue[1]);
    },
    columns() {
      return [this.provinces, this.citys, this.areas];
    },
  },
  watch: {
    defaultIndex(n) {
      if (n.length) {
        this.defaultIndexValue = this.defaultIndexs;
      }
    },
    defaultNames: {
      immediate: true,
      handler() {
        this.defaultNames.length && this.queryIndex('text');
      },
    },
    defaultCodes: {
      immediate: true,
      handler() {
        this.defaultCodes.length && this.queryIndex('code');
      },
    },
  },
  methods: {
    // 点击取消按钮
    cancel(e) {
      this.$emit('cancel', e);
    },
    // 点击确认 回调参数为包含columnIndex、value、values
    confirm(e) {
      this.$emit('confirm', e);
      this.cancel();
    },
    changeHandler(e) {
      const {
        columnIndex,
        value,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        picker = this.$refs.uPicker,
      } = e;

      // 当第一列值发生变化时，变化第二列(后一列)对应的选项
      if (columnIndex === 0) {
        // picker为选择器this实例，变化第二列对应的选项
        this.origiData.forEach((item) => {
          if (value[0].text === item.province) {
            const city = [];
            let flag = item.citys && item.citys[0]?.city;
            item.citys?.forEach((val) => {
              city.push({
                text: val.city,
                code: val.code,
              });
              if (city[0].text === flag) {
                // 设置默认开关（选择省份后设置默认城市）
                flag = '';
                const area = [];
                val.areas.forEach((vol) => {
                  area.push({
                    text: vol.area,
                    code: vol.code,
                  });
                });
                picker.setColumnValues(2, area);
              }
            });
            picker.setColumnValues(1, city);
          }
        });
      }
      // 当第二列变化时，第三列对应变化
      if (columnIndex === 1) {
        this.origiData.forEach((item) => {
          if (value[0].text === item.province) {
            const city = [];
            item.citys.forEach((val) => {
              city.push({
                text: val.city,
                code: val.code,
              });
              if (value[1].text === val.city) {
                const area = [];
                val.areas?.forEach((vol) => {
                  area.push({
                    text: vol.area,
                    code: vol.code,
                  });
                });
                picker.setColumnValues(2, area);
              }
            });
          }
        });
      }
    },
    /**
     * 根据传入的类型查询并设置默认索引值
     *
     * @param {string} type - 查询类型，'text' 表示按文本查询
     */
    queryIndex(type) {
      const isText = type === 'text';
      const [provinceValue, cityValue, areaValue] = isText ? this.defaultNames : this.defaultCodes;

      // 查找特定值并返回其索引 如果未找到返回0
      const getValue = (arr, value, useText = true) => {
        const index = arr.findIndex((e) => (useText ? e.text : e.code) === value);
        return index === -1 ? 0 : index;
      };
      const provinceIndex = getValue(this.provinces, provinceValue, isText);
      this.$set(this, 'defaultIndexValue', [provinceIndex, 0, 0]);
      const cityIndex = getValue(this.citys, cityValue, isText);
      this.$set(this, 'defaultIndexValue', [provinceIndex, cityIndex, 0]);
      const areaIndex = getValue(this.areas, areaValue, isText);
      this.$set(this, 'defaultIndexValue', [provinceIndex, cityIndex, areaIndex]);
    },
  },
};
</script>

<style></style>
