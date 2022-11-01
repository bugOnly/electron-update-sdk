# @dfe/electron-update-sdk

基于 electron-updater 封装的更新服务组件。

## 安装
```bash
#yarn 
yarn add @dfe/electron-update-sdk
#npm
npm i @dfe/electron-update-sdk
```

## 使用
### Electron 主进程
Electron 需要同时在主进程和预加载脚本中引入 SDK。

主进程引入：
```typescript
import updateService from '@dfe/electron-update-sdk/libs/main';

const mainWindow = createWindow('main', {
  width: 1000,
  height: 800,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js')
  }
});
// 接入 updateService
updateService.setup(mainWindow, {
  // 获取更新信息的URL
  feedUrl: 'https://xxx.com/xxx'
});
```

预加载脚本引入：
```typescript
import { contextBridge } from 'electron';
import updateServicePreload from '@dfe/electron-update-sdk/libs/preload';

contextBridge.exposeInMainWorld(updateServicePreload.name, updateServicePreload.content);
```

### 渲染进程
```typescript
import { UpdateServiceRenderer } from '@dfe/electron-update-sdk/libs/renderer';

const updateRenderer = new UpdateServiceRenderer({
  // 是否使用 SDK 默认的UI提示，默认为 true，建议自定义
  renderUi: false,
  // 是否自动检查更新，设置为true时 new 之后会自动检查
  autoCheck: false
});
// 检查更新
updateRenderer.checkUpdate();
```

#### 功能API

**updateRenderer.checkUpdate()**

主动检查更新

**updateRenderer.confirmDownload()**

确认下载更新包，一般是在自定义UI中使用。

**updateRenderer.confirmUpdate()**

确认安装更新包，一般是在自定义UI中使用。

#### 事件回调 API

可通过生命周期各阶段的事件回调执行自定义逻辑或者自定义UI提示（前提设置`renderUi`为`false`）。

**updateRenderer.onCheckingUpdate(callback)**

自定义回调：检测更新中

**updateRenderer.onUpdateFail(callback)**

自定义回调：更新失败

**updateRenderer.onNoUpdate(callback)**

自定义回调：没有更新版本

**updateRenderer.onNeedUpdate(callback)**

自定义回调：有新版本
> 此时可调用`updateRenderer.confirmDownload()`下载更新包。

**updateRenderer.onDownloading(callback)**

自定义回调：更新包下载中

**updateRenderer.onDownloadSuccess(callback)**

自定义回调：更新包下载完成
> 此时可调用`updateRenderer.confirmUpdate()`安装更行包