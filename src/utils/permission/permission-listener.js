/**
 * uni.createRequestPermissionListener()
 * 文档地址：https://uniapp.dcloud.net.cn/api/system/create-request-permission-listener.html
 * 注意：HBuilderX (4.0+) android 平台支持；HBuilderX 4.01 Vue2项目需要使用自定义基座测试监听权限申请的功能，标准基座暂不支持测试。
 */
// #ifndef APP
export default null;
// #endif
// #ifdef APP
const {
	osName
} = uni.getSystemInfoSync();
let permissionListener = null;
// 是安卓平台，同时有uni.createRequestPermissionListener这个api
if (osName === "android" && uni.createRequestPermissionListener) {
	permissionListener = uni.createRequestPermissionListener();
}
let canRunListener = true; // 是否可以执行所有监听方法
let canStopListener = true; // 是否可以执行取消所有监听方法，避免唤起权限会触发App.vue的onHide生命周期
let permissionEnums = null; // 权限枚举，包含名称和说明

/**
 * 权限说明文字
 * @param {String} = permissionName  例如：ACCESS_COARSE_LOCATION
 */
const texts = (permissionName) => {
	let title = "";
	let content = "";
	let permissionInfo = permissionEnums[permissionName] || null;
	if (permissionInfo) {
		const {
			name,
			explain
		} = permissionInfo;
		title = `${name}权限使用说明`;
		content = `将获取${name}权限，用于${explain}`;
	} else {
		title = "";
		content = "";
	}
	return {
		title,
		content
	}
};

/**
 * 绘画顶部权限说明
 * 文档地址：https://www.html5plus.org/doc/zh_cn/nativeobj.html
 * @function drawView title标题，content描述使用说明
 * @function hideView 隐藏顶部权限说明
 */
let view = null;
const drawView = ({
	title,
	content
}) => {
	console.log("drawView方法的参数值：", title, content);
	if (view || !title || !content) return; // 没有标题和内容则return出去
	const {
		windowTop,
		windowWidth,
		statusBarHeight
	} = uni.getSystemInfoSync();
	const topHeight = windowTop + statusBarHeight;
	const distance = {
		box: 10, // 盒子距离视图两边的距离
		text: 20 // 文字距离视图两边的距离
	}
	// 标题的相关样式
	const titleStyle = {
		size: 16,
		height: 16,
		top: `${topHeight + 22}`,
		color: "#000",
	}
	// 内容的相关样式
	const contentStyle = {
		size: 14,
		height: 0,
		top: `${parseInt(titleStyle.top) + titleStyle.height + 6}`,
		color: "#656563",
	}
	const contentLength = content.length; // 权限说明内容文字长度
	const contentWidth = windowWidth - distance.text * 2; // 内容的宽度
	const contentRowCount = Math.floor(contentWidth / contentStyle.size); // 一行占几个文字
	const contentRows = Math.ceil(contentLength / contentRowCount); // 当前内容占几行
	if (contentRows == 1) {
		// 一行文字特殊处理
		contentStyle.height = contentStyle.size + 6
	} else {
		// 多行文字
		contentStyle.height = contentRows * (contentStyle.size + 4); // 内容的高度
	}
	/**
	 * @description 计算盒子的高度
	 * 获取content到盒子顶部距离：parseInt(contentStyle.top) - topHeight - distance.box
	 * content的高度：contentStyle.height
	 * 获取content到盒子底部的距离：(distance.text - distance.box)
	 */
	const boxHeight = (parseInt(contentStyle.top) - topHeight - distance.box) + contentStyle.height + (distance
		.text - distance.box);
	view = new plus.nativeObj.View('per-modal', {
		top: '0',
		left: '0',
		width: '100%',
		backgroundColor: 'rgba(0,0,0,0.2)'
	})
	view.drawRect({
		color: '#fff',
		radius: '5px',
	}, {
		top: `${topHeight + distance.box}px`,
		left: `${distance.box}px`,
		right: `${distance.box}px`,
		height: `${boxHeight}px`
	})
	view.drawText(title, {
		top: `${titleStyle.top}px`,
		left: `${distance.text}px`,
		left: `${distance.text}px`,
		height: `${titleStyle.height}px`
	}, {
		size: `${titleStyle.size}px`,
		align: "left",
		color: titleStyle.color,
		weight: "bold"
	})
	view.drawText(content, {
		top: `${contentStyle.top}px`,
		left: `${distance.text}px`,
		right: `${distance.text}px`,
		height: `${contentStyle.height}px`,
	}, {
		size: `${contentStyle.size}px`,
		lineSpacing: "2px",
		align: "left",
		color: contentStyle.color,
		verticalAlign: "top",
		whiteSpace: "normal"
	})
	let timer = setTimeout(() => {
		view && view.show();
		clearTimeout(timer);
		timer = null;
	}, 200)
}
// 关闭顶部权限说明
const hideView = () => {
	if (view) {
		view.hide();
		view = null;
	}
}

/**
 * @description 监听权限方法
 * @example
	const permissionParams = {
		"ACCESS_COARSE_LOCATION": {		// 取android.permission.ACCESS_COARSE_LOCATION后面那个
			name: "定位",	// 当前权限是什么名称
			explain: "展示附近店铺、填写收货地址等相关功能"		// 权限说明
		},
	}
 */
const listenerFunc = (permissionParams) => {
	if (!permissionParams) return;
	permissionEnums = permissionParams;
	stopFunc(); // 取消所有监听方法
	if (canRunListener && permissionListener) {
		let permissionName = ""; // 权限名称
		let hasConfirm = false; // 是否有权限弹窗（触发permissionListener.onConfirm这个回调）
		canRunListener = false;
		canStopListener = false;
		// 监听申请系统权限
		permissionListener.onRequest((e) => {
			console.log("permissionListener.onRequest回调：", e);
			if (Array.isArray(e) && e.length > 0) {
				const stringToArray = e[0].split(".");
				permissionName = stringToArray[stringToArray.length - 1];
				console.log("权限名称：", permissionName);
			}
		});
		// 监听弹出系统权限授权框
		permissionListener.onConfirm((e) => {
			console.log("permissionListener.onConfirm回调：", e);
			hasConfirm = true;
			if (permissionName) {
				drawView(texts(permissionName));
			}
		});
		// 监听权限申请完成
		permissionListener.onComplete((e) => {
			console.log("permissionListener.onComplete回调：", e);
			// e.length === 0：权限列表无值，则不继续做相对逻辑
			if (e.length === 0) return;
			let name = ""; // 权限名称
			let explain = ""; // 权限说明
			if (permissionName && permissionEnums[permissionName]) {
				name = permissionEnums[permissionName].name;
				explain = permissionEnums[permissionName].explain;
			}
			const Manifest = plus.android.importClass("android.Manifest");
			const MainActivity = plus.android.runtimeMainActivity();
			const permissionStatus = MainActivity.checkSelfPermission(Manifest.permission[permissionName]);
			console.log("当前权限状态：", permissionStatus);
			/**
			 * @description 永久拒绝该权限，则引导用户前往设置页
			 * permissionStatus != 0：权限状态是拒绝
			 * !hasConfirm：没有permissionListener.onConfirm这个回调
			 */
			if (permissionStatus != 0 && !hasConfirm && name && explain) {
				uni.showModal({
					title: "温馨提示",
					content: `开启${name}权限后，才能${explain}`,
					showCancel: true,
					confirmText: "去设置",
					success: (res) => {
						if (res.confirm) {
							uni.openAppAuthorizeSetting();
						}
					}
				})
				return;
			}
			canStopListener = true;
			hideView();
		});
	}
}

// 取消所有监听方法
const stopFunc = () => {
	if (canStopListener && permissionListener) {
		console.log("执行permissionListener.stop()方法");
		canRunListener = true;
		hideView();
		permissionListener.stop();
	}
}

let exportObj = null;
if (permissionListener) {
	exportObj = {
		listenerFunc,
		stopFunc
	};
} else {
	exportObj = null;
}

export default exportObj;
// #endif