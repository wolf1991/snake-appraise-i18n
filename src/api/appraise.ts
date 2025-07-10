export interface IAppraiseMenuList {
  label: string;
  value: string;
  hrefUrl?: string;
  icon: string;
}

export interface IBrandDetail {
  modelList: any[];
  cmsId: number;
  price: number;
}

/**
 * 获取menu list
 */
export const getMenuListApi = () => uni?.$u?.http.get<IAppraiseMenuList[]>('/appraise/menu/list');

/**
 * 获取鉴别师列表
 */
export const getAppraiseUserListApi = (params) =>
  uni?.$u?.http.get<IResPage>('/appraise/userList', {
    data: params,
  });

/**
 * 获取鉴别品牌
 */
export const getCategoryBrandListApi = (params) =>
  uni?.$u?.http.get('/appraise/category/brandList', {
    data: params,
  });

/**
 * 获取品牌
 * @param key 搜索
 */
export const getBrandListApi = (params) =>
  uni?.$u?.http.get<IResPage>('/appraise/brand/list', {
    data: params,
  });

/**
 * 获取用户是不是鉴别师
 */
export const getAppraiserCheckApi = (params = {}) =>
  uni?.$u?.http.get('/appraise/appraiser/check', {
    data: params,
  });

/**
 * 获取鉴别品类列表
 */
export const getAppraiseCategoryListApi = (params = {}) =>
  uni?.$u?.http.get<any[]>('/appraise/category/list', {
    data: params,
  });

/**
 * 创建鉴别订单
 * @param {Object} params 参数
 * @param {number} params.brandId       品牌id
 * @param {number} params.categoryId    类目id
 * @param {Array} params.imageList      鉴定图片列表
 * @param {string} params.appraiseCode  鉴定扣码，使用鉴定扣码下单时该项必传
 * @param {string} [params.status]      鉴定师选择鉴定状态
 * @param {string} [params.suggestion]  本次鉴定建议
 */
export const getCreateDoAppraiseApi = (params) => uni?.$u?.http.post('/appraise/create/doAppraise', params);

/**
 * 获取鉴别图片模板
 */
export const getCategoryBrandDetailApi = (params) =>
  uni?.$u?.http.get<IBrandDetail>('/appraise/category/brandDetail', {
    data: params,
  });

/**
 * 下鉴别订单
 */
export const postAppraiseOrderApi = (params) => uni?.$u?.http.post('/appraise/order', params);

/**
 * 获取我的鉴别列表
 */
export const getAppraiseOrderListApi = (params) =>
  uni?.$u?.http.get('/appraise/orderList', {
    data: params,
  });

/**
 * 获取抖音鉴别详情
 */
export const getAppraiseDyOrderDetailApi = (params) =>
  uni?.$u?.http.get('/appraise/order/detail', {
    data: params,
  });

/**
 * 订单详情
 */
export const getAppraiseOrderDetailApi = (params) =>
  uni?.$u?.http.get('/appraise/order', {
    data: params,
  });

/**
 * 补图
 */
export const postMoreImageApi = (params) => uni?.$u?.http.post('/appraise/moreImage', params);

// APP跳转支付宝小程序生成订单
export const postAppraisePayDoPayApi = (params) => uni?.$u?.http.post('/appraise/pay/doPay', params);

// ====

/**
 * 抢单大厅
 */
export const getAppraiseAppraiserOrderHallApi = (params) =>
  uni?.$u?.http.get<IResPage>('/appraise/appraiser/ordersHall', {
    data: params,
  });

/**
 * 鉴别师抢单
 */
export const getAppraiseAppraiserDoItApi = (params) =>
  uni?.$u?.http.get('/appraise/appraiser/doIt', {
    data: params,
  });

/**
 * 鉴别师自身鉴别单列表
 */
export const getAppraiseAppraiserMyselfApi = (params) =>
  uni?.$u?.http.get<IResPage>('/appraise/appraiser/myself', {
    data: params,
  });

/**
 * 获取我的鉴别详情
 */
export const getAppraiseUserDetailApi = (params = {}) =>
  uni?.$u?.http.get<{ optBtn: boolean }>('/appraise/userDetail', {
    data: params,
  });

/**
 * 鉴别师上线/下线
 */
export const getAppraiseOnlineChangeApi = (params) =>
  uni?.$u?.http.post(`/appraise/appraiser/online/change?onLine=${params.onLine}`);

/**
 * 鉴别师退回抢单
 */
export const getAppraiseAppraiserGiveUpApi = (params) =>
  uni?.$u?.http.get('/appraise/appraiser/giveUp', {
    data: params,
  });

// 获取补图的原因
export const getAppraiseRmdReasonListApi = (params) =>
  uni?.$u?.http.get('/appraise/rmd/reason/list', {
    data: params,
  });

// 鉴定图片已更新
export const getAppraiseCheckModifyApi = (params) =>
  uni?.$u?.http.get('/appraise/check/modify', {
    data: params,
  });

/**
 * 鉴别师鉴别
 */
export const postAppraiserDoAppraiseApi = (params) => uni?.$u?.http.post('/appraise/appraiser/doAppraise', params);

// ===========================鉴别扣==================

/**
 * 鉴别扣类型
 */
export const getAppraiseCodeTabApi = (params) =>
  uni?.$u?.http.get('/appraise/code/tab', {
    data: params,
  });

/**
 * 购买鉴别扣
 */
export const postAppraiseCodePurchaseApi = (params) => uni?.$u?.http.post('/appraise/code/purchase', params);

/**
 * 鉴别扣购买记录
 */
export const getAppraiseCodeOrderListApi = (params) =>
  uni?.$u?.http.get<IResPage>('/appraise/code/order/list', {
    data: params,
  });

// =============================鉴定刷题任务=============================

/**
 * 鉴定师刷题列表
 */
export const getAppraiseExamPaperListApi = (params) =>
  uni?.$u?.http.get('/appraise/examPaper/list', {
    data: params,
  });

/**
 * 试卷题目列表
 * @param examPaperId 试卷id
 * @param type answer：答题 viewAll：查看所有 viewIncorrect：查看正确 viewCorrect：查看错误
 */
export const getAppraiseExamQuestionDetailApi = (params) =>
  uni?.$u?.http.get('/appraise/examQuestion/detail', {
    data: params,
  });

/**
 * 鉴定师开始答题
 */
export const postAppraiseSaveExamStartApi = (params) =>
  uni?.$u?.http.post(`/appraise/examPaper/start?examPaperId=${params.examPaperId}`);

/**
 * 答题：每答一次提交一个 传id和userAnswer答案
 */
export const postAppraiseSaveExamAnswerApi = (params) => uni?.$u?.http.post('/appraise/examPaper/answer', params);

/**
 * 试卷提交
 */
export const postAppraiseExamPaperEndApi = (params) =>
  uni?.$u?.http.post(`/appraise/examPaper/end?examPaperId=${params.examPaperId}`);
