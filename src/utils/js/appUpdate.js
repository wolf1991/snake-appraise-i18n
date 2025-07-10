// #ifdef APP-PLUS
import config from '@/config/config';

let requestUrl = uni.getStorageSync('BASE_URL');
const defaultUrl = config.baseUrl;
requestUrl = requestUrl || defaultUrl;

console.log(requestUrl);

let skipVersion = uni.getStorageSync('skipUpdate');
const { platform } = uni.getSystemInfoSync();
// 主颜色
const $mainColor = '06D290';
// 弹窗图标url
const $iconUrl = 'https://cdn.puresnake.com/joker/static/newVersion.png';

// 获取当前应用的版本号
export const getCurrentNo = (callback) => {
  // 获取本地应用资源版本号
  plus.runtime.getProperty(plus.runtime.appid, (inf) => {
    callback &&
      callback({
        versionCode: inf.versionCode,
        versionName: inf.version,
      });
  });
};
export const getServerNo = (version, setupPage = false, callback) => {
  const httpData = {
    version: version.versionCode,
    // 版本名称
    versionName: version.versionName,
    // setupPage参数说明（判断用户是不是从设置页面点击的更新，如果是设置页面点击的更新，有不要用静默更新了，不然用户点击没反应很奇怪的）
    setupPage,
    appName: 'snake',
  };
  if (platform === 'android') {
    httpData.type = 1101;
  } else {
    httpData.type = 1102;
  }

  /*
   * 接口入参说明
   * version: 应用当前版本号（已自动获取）
   * versionName: 应用当前版本名称（已自动获取）
   * type：平台（1101是安卓，1102是IOS）
   */

  uni.request({
    url: `${requestUrl}/common/version/update`,
    method: 'GET',
    data: httpData,
    success: (response) => {
      if (response.data.success) {
        const res = response.data.data;
        if (res && res.downloadUrl && res.updateType) {
          callback && callback(res);
        }
      }
    },
    fail: (res) => {
      console.log(res);
    },
  });

  /*
   * res的数据说明
   * | 参数名称        | 一定返回     | 类型        | 描述
   * | -------------|--------- | --------- | ------------- |
   * | versionCode     | y        | int       | 版本号        |
   * | versionName     | y        | String    | 版本名称      |
   * | versionInfo     | y        | String    | 版本信息      |
   * | updateType      | y        | String    | forcibly = 强制更新, solicit = 弹窗确认更新, silent = 静默更新 |
   * | downloadUrl     | y        | String    | 版本下载链接（IOS安装包更新请放跳转store应用商店链接,安卓apk和wgt文件放文件下载链接）  |
   */

  /** **************以上是示例*******************/
};

// 文件下载的弹窗绘图
function downloadPopupDrawing(data) {
  // 以下为计算菜单的nview绘制布局，为固定算法，使用者无关关心
  const screenWidth = plus.screen.resolutionWidth;
  const screenHeight = plus.screen.resolutionHeight;
  // 弹窗容器宽度
  const popupViewWidth = screenWidth * 0.7;
  // 弹窗容器的Padding
  const viewContentPadding = 20;
  // 弹窗容器的宽度
  const viewContentWidth = popupViewWidth - viewContentPadding * 2;
  // 弹窗容器高度
  let popupViewHeight = viewContentPadding * 3 + 60;
  const progressTip = data.progressTip || '准备下载...';
  const contentText = data.contentText || '正在为您更新，请耐心等待';
  let elementList = [
    {
      tag: 'rect', // 背景色
      color: '#FFFFFF',
      rectStyles: {
        radius: '2px',
      },
    },
    {
      tag: 'font',
      id: 'title',
      text: '升级APP',
      textStyles: {
        size: '16px',
        color: '#333',
        weight: 'bold',
        verticalAlign: 'middle',
        whiteSpace: 'normal',
      },
      position: {
        top: `${viewContentPadding}px`,
        height: '30px',
      },
    },
    {
      tag: 'font',
      id: 'content',
      text: contentText,
      textStyles: {
        size: '14px',
        color: '#333',
        verticalAlign: 'middle',
        whiteSpace: 'normal',
      },
      position: {
        top: `${viewContentPadding * 2 + 30}px`,
        height: '20px',
      },
    },
  ];
  // 是否有进度条
  if (data.progress) {
    popupViewHeight += viewContentPadding + 40;
    elementList = elementList.concat([
      {
        tag: 'font',
        id: 'progressValue',
        text: progressTip,
        textStyles: {
          size: '14px',
          color: $mainColor,
          whiteSpace: 'normal',
        },
        position: {
          top: `${viewContentPadding * 4 + 20}px`,
          height: '30px',
        },
      },
      {
        tag: 'rect', // 绘制进度条背景
        id: 'progressBg',
        rectStyles: {
          radius: '4px',
          borderColor: '#f1f1f1',
          borderWidth: '1px',
        },
        position: {
          top: `${viewContentPadding * 4 + 60}px`,
          left: `${viewContentPadding}px`,
          width: `${viewContentWidth}px`,
          height: '8px',
        },
      },
    ]);
  }
  if (data.buttonNum === 2) {
    popupViewHeight += viewContentPadding + 30;
    elementList = elementList.concat([
      {
        tag: 'rect', // 绘制底边按钮
        rectStyles: {
          radius: '3px',
          borderColor: '#f1f1f1',
          borderWidth: '1px',
        },
        position: {
          bottom: `${viewContentPadding}px`,
          left: `${viewContentPadding}px`,
          width: `${(viewContentWidth - viewContentPadding) / 2}px`,
          height: '30px',
        },
      },
      {
        tag: 'rect', // 绘制底边按钮
        rectStyles: {
          radius: '3px',
          color: $mainColor,
        },
        position: {
          bottom: `${viewContentPadding}px`,
          left: `${(viewContentWidth - viewContentPadding) / 2 + viewContentPadding * 2}px`,
          width: `${(viewContentWidth - viewContentPadding) / 2}px`,
          height: '30px',
        },
      },
      {
        tag: 'font',
        id: 'cancelText',
        text: '取消下载',
        textStyles: {
          size: '14px',
          color: '#666',
          lineSpacing: '0%',
          whiteSpace: 'normal',
        },
        position: {
          bottom: `${viewContentPadding}px`,
          left: `${viewContentPadding}px`,
          width: `${(viewContentWidth - viewContentPadding) / 2}px`,
          height: '30px',
        },
      },
      {
        tag: 'font',
        id: 'confirmText',
        text: '后台下载',
        textStyles: {
          size: '14px',
          color: '#FFF',
          lineSpacing: '0%',
          whiteSpace: 'normal',
        },
        position: {
          bottom: `${viewContentPadding}px`,
          left: `${(viewContentWidth - viewContentPadding) / 2 + viewContentPadding * 2}px`,
          width: `${(viewContentWidth - viewContentPadding) / 2}px`,
          height: '30px',
        },
      },
    ]);
  }
  if (data.buttonNum === 1) {
    popupViewHeight += viewContentPadding + 40;
    elementList = elementList.concat([
      {
        tag: 'rect', // 绘制底边按钮
        rectStyles: {
          radius: '2px',
          color: $mainColor,
        },
        position: {
          bottom: `${viewContentPadding}px`,
          left: `${viewContentPadding}px`,
          width: `${viewContentWidth}px`,
          height: '40px',
        },
      },
      {
        tag: 'font',
        id: 'confirmText',
        text: '关闭',
        textStyles: {
          size: '14px',
          color: '#FFF',
          lineSpacing: '0%',
        },
        position: {
          bottom: `${viewContentPadding}px`,
          left: `${viewContentPadding}px`,
          width: `${viewContentWidth}px`,
          height: '40px',
        },
      },
    ]);
  }
  return {
    popupViewHeight,
    popupViewWidth,
    screenHeight,
    viewContentWidth,
    viewContentPadding,
    elementList,
  };
}
// 文件下载的弹窗
function downloadPopup(data) {
  // 弹窗遮罩层
  const maskLayer = new plus.nativeObj.View('maskLayer', {
    // 先创建遮罩层
    top: '0px',
    left: '0px',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  });
  let popupViewData = downloadPopupDrawing(data);
  // 弹窗内容
  const popupView = new plus.nativeObj.View('popupView', {
    // 创建底部图标菜单
    tag: 'rect',
    top: `${(popupViewData.screenHeight - popupViewData.popupViewHeight) / 2}px`,
    left: '15%',
    height: `${popupViewData.popupViewHeight}px`,
    width: '70%',
  });
  let progressValue = 0;
  let progressTip = 0;
  let contentText = 0;
  let buttonNum = 2;
  if (data.buttonNum >= 0) {
    ({ buttonNum } = data);
  }
  popupView.draw(popupViewData.elementList);
  const callbackData = {
    change(res) {
      let progressElement = [];
      if (res.progressValue) {
        ({ progressValue } = res);
        // 绘制进度条
        progressElement.push({
          tag: 'rect', // 绘制进度条背景
          id: 'progressValueBg',
          rectStyles: {
            radius: '4px',
            color: $mainColor,
          },
          position: {
            top: `${popupViewData.viewContentPadding * 4 + 60}px`,
            left: `${popupViewData.viewContentPadding}px`,
            width: `${popupViewData.viewContentWidth * (res.progressValue / 100)}px`,
            height: '8px',
          },
        });
      }
      if (res.progressTip) {
        ({ progressTip } = res);
        progressElement.push({
          tag: 'font',
          id: 'progressValue',
          text: res.progressTip,
          textStyles: {
            size: '14px',
            color: $mainColor,
            whiteSpace: 'normal',
          },
          position: {
            top: `${popupViewData.viewContentPadding * 4 + 20}px`,
            height: '30px',
          },
        });
      }
      if (res.contentText) {
        ({ contentText } = res);
        progressElement.push({
          tag: 'font',
          id: 'content',
          text: res.contentText,
          textStyles: {
            size: '16px',
            color: '#333',
            whiteSpace: 'normal',
          },
          position: {
            top: `${popupViewData.viewContentPadding * 2 + 30}px`,
            height: '30px',
          },
        });
      }
      if (res.buttonNum >= 0 && buttonNum !== res.buttonNum) {
        ({ buttonNum } = res);
        popupView.reset();
        popupViewData = downloadPopupDrawing(
          Object.assign(
            {
              progressValue,
              progressTip,
              contentText,
            },
            res,
          ),
        );
        const newElement = [];
        popupViewData.elementList.map((item) => {
          let have = false;
          progressElement.forEach((childItem) => {
            if (item.id === childItem.id) {
              have = true;
            }
          });
          if (!have) {
            newElement.push(item);
          }
          return have;
        });
        progressElement = newElement.concat(progressElement);
        popupView.setStyle({
          tag: 'rect',
          top: `${(popupViewData.screenHeight - popupViewData.popupViewHeight) / 2}px`,
          left: '15%',
          height: `${popupViewData.popupViewHeight}px`,
          width: '70%',
        });
        popupView.draw(progressElement);
      } else {
        popupView.draw(progressElement);
      }
    },
    cancel() {
      maskLayer.hide();
      popupView.hide();
    },
  };
  popupView.addEventListener('click', (e) => {
    const maxTop = popupViewData.popupViewHeight - popupViewData.viewContentPadding;
    const maxLeft = popupViewData.popupViewWidth - popupViewData.viewContentPadding;
    if (e.clientY > maxTop - 40 && e.clientY < maxTop) {
      if (buttonNum === 1) {
        // 单按钮
        if (e.clientX > popupViewData.viewContentPadding && e.clientX < maxLeft) {
          maskLayer.hide();
          popupView.hide();
          callbackData.reboot();
        }
      } else if (buttonNum === 2) {
        // 双按钮
        const buttonWidth = (popupViewData.viewContentWidth - popupViewData.viewContentPadding) / 2;
        if (
          e.clientX > popupViewData.viewContentPadding &&
          e.clientX < maxLeft - buttonWidth - popupViewData.viewContentPadding
        ) {
          maskLayer.hide();
          popupView.hide();
          callbackData.cancelDownload();
        } else if (e.clientX > maxLeft - buttonWidth && e.clientX < maxLeft) {
          maskLayer.hide();
          popupView.hide();
        }
      }
    }
  });
  // 显示弹窗
  maskLayer.show();
  popupView.show();
  // 改变进度条
  return callbackData;
}

// 从服务器下载应用资源包（wgt文件）
function getDownload(data) {
  let dtask = null;
  if (data.updateType === 'forcibly' || data.updateType === 'solicit') {
    const popupData = {
      progress: true,
      buttonNum: 2,
    };
    if (data.updateType === 'forcibly') {
      popupData.buttonNum = 0;
    }
    let lastProgressValue = 0;
    const popupObj = downloadPopup(popupData);
    dtask = plus.downloader.createDownload(
      data.downloadUrl,
      {
        filename: '_doc/update/',
      },
      (download, status) => {
        if (status === 200) {
          popupObj.change({
            progressValue: 100,
            progressTip: '正在安装文件...',
            progress: true,
            buttonNum: 0,
          });
          plus.runtime.install(
            download.filename,
            {},
            () => {
              popupObj.change({
                contentText: '应用资源更新完成！',
                buttonNum: 1,
                progress: false,
              });
            },
            (e) => {
              popupObj.cancel();
              plus.nativeUI.alert(`安装文件失败[${e.code}]：${e.message}`);
            },
          );
        } else {
          popupObj.change({
            contentText: '文件下载失败...',
            buttonNum: 1,
            progress: false,
          });
        }
      },
    );
    dtask.start();
    dtask.addEventListener('statechanged', (task) => {
      switch (task.state) {
        case 1: // 开始
          popupObj.change({
            progressValue: 0,
            progressTip: '准备下载...',
            progress: true,
          });
          break;
        case 2: // 已连接到服务器
          popupObj.change({
            progressValue: 0,
            progressTip: '开始下载...',
            progress: true,
          });
          break;
        case 3: {
          const progress = parseInt((task.downloadedSize / task.totalSize) * 100, 10);
          if (progress - lastProgressValue >= 2) {
            lastProgressValue = progress;
            popupObj.change({
              progressValue: progress,
              progressTip: `已下载${progress}%`,
              progress: true,
            });
          }
          break;
        }
        default:
          break;
      }
    });
    // 取消下载
    popupObj.cancelDownload = function () {
      dtask && dtask.abort();
      uni.showToast({
        title: '已取消下载',
        icon: 'none',
      });
    };
    // 重启APP
    popupObj.reboot = function () {
      plus.runtime.restart();
    };
  } else if (data.updateType === 'silent') {
    dtask = plus.downloader.createDownload(
      data.downloadUrl,
      {
        filename: '_doc/update/',
      },
      (download, status) => {
        if (status === 200) {
          plus.runtime.install(
            download.filename,
            {},
            () => {
              console.log('应用资源更新完成');
            },
            (e) => {
              plus.nativeUI.alert(`安装文件失败[${e.code}]：${e.message}`);
            },
          );
        } else {
          plus.nativeUI.alert('文件下载失败...');
        }
      },
    );
    dtask.start();
  }
}
// 文字换行
function drawtext(text, maxWidth) {
  const textArr = text.split('');
  const len = textArr.length;
  // 上个节点
  let previousNode = 0;
  // 记录节点宽度
  let nodeWidth = 0;
  // 文本换行数组
  const rowText = [];
  // 如果是字母，侧保存长度
  let letterWidth = 0;
  // 汉字宽度
  const chineseWidth = 14;
  // otherFont宽度
  const otherWidth = 7;
  for (let i = 0; i < len; i++) {
    if (/[\u4e00-\u9fa5]|[\uFE30-\uFFA0]/g.test(textArr[i])) {
      if (letterWidth > 0) {
        if (nodeWidth + chineseWidth + letterWidth * otherWidth > maxWidth) {
          rowText.push({
            type: 'text',
            content: text.substring(previousNode, i),
          });
          previousNode = i;
          nodeWidth = chineseWidth;
          letterWidth = 0;
        } else {
          nodeWidth += chineseWidth + letterWidth * otherWidth;
          letterWidth = 0;
        }
      } else if (nodeWidth + chineseWidth > maxWidth) {
        rowText.push({
          type: 'text',
          content: text.substring(previousNode, i),
        });
        previousNode = i;
        nodeWidth = chineseWidth;
      } else {
        nodeWidth += chineseWidth;
      }
    } else if (/\n/g.test(textArr[i])) {
      rowText.push({
        type: 'break',
        content: text.substring(previousNode, i),
      });
      previousNode = i + 1;
      nodeWidth = 0;
      letterWidth = 0;
    } else if (textArr[i] === '\\' && textArr[i + 1] === 'n') {
      rowText.push({
        type: 'break',
        content: text.substring(previousNode, i),
      });
      previousNode = i + 2;
      nodeWidth = 0;
      letterWidth = 0;
    } else if (/[a-zA-Z0-9]/g.test(textArr[i])) {
      letterWidth += 1;
      if (nodeWidth + letterWidth * otherWidth > maxWidth) {
        rowText.push({
          type: 'text',
          content: text.substring(previousNode, i + 1 - letterWidth),
        });
        previousNode = i + 1 - letterWidth;
        nodeWidth = letterWidth * otherWidth;
        letterWidth = 0;
      }
    } else if (nodeWidth + otherWidth > maxWidth) {
      rowText.push({
        type: 'text',
        content: text.substring(previousNode, i),
      });
      previousNode = i;
      nodeWidth = otherWidth;
    } else {
      nodeWidth += otherWidth;
    }
  }
  if (previousNode < len) {
    rowText.push({
      type: 'text',
      content: text.substring(previousNode, len),
    });
  }
  return rowText;
}
// 是否更新弹窗
function updatePopup(data, callback) {
  // 弹窗遮罩层
  const maskLayer = new plus.nativeObj.View('maskLayer', {
    // 先创建遮罩层
    top: '0px',
    left: '0px',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  });

  // 以下为计算菜单的nview绘制布局，为固定算法，使用者无关关心
  const screenWidth = plus.screen.resolutionWidth;
  const screenHeight = plus.screen.resolutionHeight;
  // 弹窗容器宽度
  const popupViewWidth = screenWidth * 0.7;
  // 弹窗容器的Padding
  const viewContentPadding = 20;
  // 弹窗容器的宽度
  const viewContentWidth = parseInt(popupViewWidth - viewContentPadding * 2, 10);
  // 描述的列表
  const descriptionList = drawtext(data.versionInfo, viewContentWidth);
  // 弹窗容器高度
  let popupViewHeight = 110 + 20 + 20 + 90 + 10;

  const popupViewContentList = [
    {
      src: $iconUrl,
      id: 'logo',
      tag: 'img',
      position: {
        top: '0px',
        left: '0px',
        width: `${popupViewWidth}px`,
        height: 'auto',
      },
      rectStyles: {
        borderColor: '#333',
        borderWidth: '1px',
        backgroundColor: '#444',
      },
    },
    {
      tag: 'font',
      id: 'title',
      text: `${data.versionName}更新内容：`,
      textStyles: {
        size: '18px',
        color: '#333',
        weight: 'bold',
        whiteSpace: 'normal',
        align: 'left',
      },
      position: {
        top: '110px',
        left: `${viewContentPadding}px`,
        width: `${viewContentWidth}px`,
        height: '30px',
      },
    },
  ];
  const textHeight = 18;
  let contentTop = 150;
  descriptionList.forEach((item, index) => {
    if (index > 0) {
      popupViewHeight += textHeight;
      contentTop += textHeight;
    }
    popupViewContentList.push({
      tag: 'font',
      id: `content${index}${1}`,
      text: item.content,
      textStyles: {
        size: '14px',
        color: '#666',
        lineSpacing: '50%',
        align: 'left',
      },
      position: {
        top: `${contentTop}px`,
        left: `${viewContentPadding}px`,
        width: `${viewContentWidth}px`,
        height: `${textHeight}px`,
      },
    });
    if (item.type === 'break') {
      contentTop += 10;
      popupViewHeight += 10;
    }
  });

  if (data.updateType === 'forcibly') {
    popupViewContentList.push({
      tag: 'rect', // 绘制底边按钮
      rectStyles: {
        radius: '2px',
        color: $mainColor,
      },
      position: {
        bottom: `${viewContentPadding}px`,
        left: `${viewContentPadding}px`,
        width: `${viewContentWidth}px`,
        height: '34px',
      },
    });

    popupViewContentList.push({
      tag: 'font',
      id: 'confirmText',
      text: '立即更新',
      textStyles: {
        size: '14px',
        color: '#FFF',
        lineSpacing: '0%',
        weight: 'bold',
      },
      position: {
        bottom: `${viewContentPadding}px`,
        left: `${viewContentPadding}px`,
        width: `${viewContentWidth}px`,
        height: '34px',
      },
    });
  } else {
    // 绘制底边按钮
    popupViewContentList.push({
      tag: 'rect',
      id: 'cancelBox',
      rectStyles: {
        radius: '2px',
        borderColor: '#f1f1f1',
        borderWidth: '1px',
      },
      position: {
        bottom: `${viewContentPadding}px`,
        left: `${viewContentPadding}px`,
        width: `${(viewContentWidth - viewContentPadding) / 2}px`,
        height: '34px',
      },
    });
    popupViewContentList.push({
      tag: 'font',
      id: 'cancelText',
      text: '暂不升级',
      textStyles: {
        size: '14px',
        color: '#666',
        lineSpacing: '0%',
        whiteSpace: 'normal',
      },
      position: {
        bottom: `${viewContentPadding}px`,
        left: `${viewContentPadding}px`,
        width: `${(viewContentWidth - viewContentPadding) / 2}px`,
        height: '34px',
      },
    });
    popupViewContentList.push({
      tag: 'rect',
      id: 'confirmBox',
      rectStyles: {
        radius: '2px',
        color: $mainColor,
      },
      position: {
        bottom: `${viewContentPadding}px`,
        left: `${(viewContentWidth - viewContentPadding) / 2 + viewContentPadding * 2}px`,
        width: `${(viewContentWidth - viewContentPadding) / 2}px`,
        height: '34px',
      },
    });
    popupViewContentList.push({
      tag: 'font',
      id: 'confirmText',
      text: '立即升级',
      textStyles: {
        size: '14px',
        color: '#FFF',
        lineSpacing: '0%',
        whiteSpace: 'normal',
      },
      position: {
        bottom: `${viewContentPadding}px`,
        left: `${(viewContentWidth - viewContentPadding) / 2 + viewContentPadding * 2}px`,
        width: `${(viewContentWidth - viewContentPadding) / 2}px`,
        height: '34px',
      },
    });
  }
  // 弹窗内容
  const popupView = new plus.nativeObj.View('popupView', {
    // 创建底部图标菜单
    tag: 'rect',
    top: `${(screenHeight - popupViewHeight) / 2}px`,
    left: '15%',
    height: `${popupViewHeight}px`,
    width: '70%',
  });
  // 绘制白色背景
  popupView.drawRect(
    {
      color: '#FFFFFF',
    },
    {
      top: '40px',
      height: `${popupViewHeight - 40}px`,
    },
  );

  popupView.draw(popupViewContentList);
  popupView.addEventListener('click', (e) => {
    const maxTop = popupViewHeight - viewContentPadding;
    const maxLeft = popupViewWidth - viewContentPadding;
    const buttonWidth = (viewContentWidth - viewContentPadding) / 2;
    if (e.clientY > maxTop - 30 && e.clientY < maxTop) {
      if (data.updateType === 'forcibly') {
        if (e.clientX > viewContentPadding && e.clientX < maxLeft) {
          // 立即升级
          // 强制更新不隐藏弹窗
          // maskLayer.hide()
          // popupView.hide()
          callback && callback();
        }
      } else if (e.clientX > viewContentPadding && e.clientX < maxLeft - buttonWidth - viewContentPadding) {
        skipVersion = `${skipVersion},${data.versionCode}`;
        uni.setStorage({
          key: 'skipUpdate',
          data: skipVersion,
        });
        maskLayer.hide();
        popupView.hide();
      } else if (e.clientX > maxLeft - buttonWidth && e.clientX < maxLeft) {
        // 立即升级
        maskLayer.hide();
        popupView.hide();
        callback && callback();
      }
    }
  });
  if (data.updateType === 'solicit') {
    // 点击遮罩层
    maskLayer.addEventListener('click', () => {
      // 处理遮罩层点击
      maskLayer.hide();
      popupView.hide();
    });
  }
  // 显示弹窗
  maskLayer.show();
  popupView.show();
}

export const appUpdate = (isPrompt = false) => {
  getCurrentNo((versionInfo) => {
    getServerNo(versionInfo, isPrompt, (res) => {
      console.log(versionInfo, isPrompt, res);
      if (res.updateType === 'none' && isPrompt) {
        uni.showToast({
          title: res.downloadUrl || '暂无新版本',
          icon: 'none',
        });
        return;
      }
      if (res.updateType === 'silent') {
        if (/\.wgt$/i.test(res.downloadUrl)) {
          getDownload(res);
        } else if (/\.html$/i.test(res.downloadUrl)) {
          plus.runtime.openURL(res.downloadUrl);
        } else if (platform === 'android') {
          getDownload(res);
        } else if (/^itms-apps:/i.test(res.downloadUrl)) {
          plus.runtime.launchApplication(
            {
              action: res.downloadUrl,
            },
            (e) => {
              console.log(`Open system default browser failed: ${e.message}`);
            },
          );
        } else {
          plus.runtime.openURL(res.downloadUrl);
        }
      } else if (res.updateType === 'forcibly' || res.updateType === 'solicit') {
        if (res.updateType === 'solicit' && skipVersion.split(',').indexOf(`${res.versionCode}`) >= 0 && isPrompt === false) {
          return;
        }
        updatePopup(res, () => {
          if (/\.wgt$/i.test(res.downloadUrl)) {
            getDownload(res);
          } else if (/\.html$/i.test(res.downloadUrl)) {
            plus.runtime.openURL(res.downloadUrl);
          } else if (platform === 'android') {
            getDownload(res);
          } else if (/^itms-apps:/i.test(res.downloadUrl)) {
            plus.runtime.launchApplication(
              {
                action: res.downloadUrl,
              },
              (e) => {
                console.log(`Open system default browser failed: ${e.message}`);
              },
            );
          } else {
            plus.runtime.openURL(res.downloadUrl);
          }
        });
      }
    });
  });
};

// #endif
