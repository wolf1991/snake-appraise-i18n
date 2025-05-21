## 快速开始

执行 `npm i` 安装依赖

执行 `npm run dev` 运行 `H5`

## 更新 uni-app 官方版本

执行 `npm run uvm` 或 `npx @dcloudio/uvm@latest` 更新 uni-app 官方版本

执行 `npm run uvm-rm` 移除无用依赖

## 发布

- web平台：`npm run build:h5`，打包后的文件在 `dist/build/h5`，可以放到web服务器，如nginx运行。如果最终不是放在根目录，可以在 `manifest.json` 文件的 `h5.router.base` 属性进行修改。
- weixin平台：`npm run build:mp-weixin`, 打包后的文件在 `dist/build/mp-weixin`，然后通过微信开发者工具导入，并点击右上角的“上传”按钮进行上传。
- APP平台：`npm run build:app`, 然后打开 `HBuilderX`，导入刚刚生成的`dist/build/app` 文件夹，选择发行 - APP云打包。
