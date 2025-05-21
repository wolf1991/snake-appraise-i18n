const { http } = uni.$u;

interface ICmsInfoRes {
  id: string;
  page: object;
  pageType: string;
  pageComponent: any[];
}

/**
 * 获取自定义CMS信息。
 *
 * @param {Object} params - 参数的对象
 * @param {Number} params.id - 页面ID（id与pageType至少提供一个）
 * @param {String} params.pageType - 页面类型 'wxma'、'alma'、'app'（id与pageType至少提供一个）
 */
export const getCmsInfo = (params: { id?: string; pageType?: string }) => {
  const path = params.pageType ? `/app/cms/${params.pageType}` : '/app/cms/comm';
  const queryParams = params.pageType ? {} : { data: params };
  return http.get<ICmsInfoRes>(path, queryParams);
};

export const getCmsInfoOld = (params) =>
  http.get('/mms/cms/info', {
    data: params,
  });
