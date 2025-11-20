import citysJson from './citys.json';
// 省市区县数据
// https://blog.csdn.net/qq_33613696/article/details/131145979

export { citysJson };

/**
 * 获取所有省份及代码
 * @param {number} provinceIndex - 省份索引
 */
export function getProvinces() {
  const provinces = citysJson.map((item) => ({
    text: item.province,
    code: item.code,
  }));
  return provinces;
}

/**
 * 获取省对应的所有城市及代码
 */
export function getCitys(provinceIndex) {
  const citys = citysJson[provinceIndex].citys.map((item) => ({
    text: item.city,
    code: item.code,
  }));
  return citys;
}

/**
 * 获取省市对应的所有地区及代码
 */
export function getAreas(provinceIndex, cityIndex) {
  const areas = citysJson[provinceIndex].citys[cityIndex].areas.map((item) => ({
    text: item.area,
    code: item.code,
  }));
  return areas;
}
