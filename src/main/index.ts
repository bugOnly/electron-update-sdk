import { autoUpdater } from 'electron-updater';
import { ipcMain, BrowserWindow } from 'electron';
import { IUpdateNoticeData, UpdateNoticeEvent, UPDATE_NOTICE_CODE, UPDATE_REQUEST_EVENTS } from '../common';

interface ILogger extends Console {}; 

export interface IElectronUpdatOptions {
  feedUrl: string;
  logger?: ILogger
}

/**
 * 主进程发送通知到渲染进程
 * @param mainWindow 
 * @param data 
 */
function sendMessageToRenderer<T>(mainWindow: BrowserWindow, event:string, data?:T) {
  mainWindow.webContents.send(event, data);
}

// 更新应用的方法
function setup(win: BrowserWindow, opts: IElectronUpdatOptions) {
  const logger = opts?.logger || console;
  // 禁止自动下载
  autoUpdater.autoDownload = false;
  //设置版本更新地址
  autoUpdater.setFeedURL(opts.feedUrl);
  // 当更新发生错误的时候触发。
  autoUpdater.on('error', (err) => {
    sendMessageToRenderer<IUpdateNoticeData>(win, UpdateNoticeEvent, {
      code: UPDATE_NOTICE_CODE.UPDATE_FAIL,
      message: err
    });
  });
  // 当开始检查更新的时候触发
  autoUpdater.on('checking-for-update', () => {
    logger.debug('autoUpdater on checking-for-update');
    sendMessageToRenderer<IUpdateNoticeData>(win, UpdateNoticeEvent, {
      code: UPDATE_NOTICE_CODE.CHECKING
    });
  });
  // 发现可更新数据时
  autoUpdater.on('update-available', () => {
    logger.debug('autoUpdater on update-available');
    sendMessageToRenderer<IUpdateNoticeData>(win, UpdateNoticeEvent, {
      code: UPDATE_NOTICE_CODE.HAS_NEW_VERSION
    });
  });
  // 没有可更新数据时
  autoUpdater.on('update-not-available', () => {
    logger.debug('autoUpdater on update-not-available');
    sendMessageToRenderer<IUpdateNoticeData>(win, UpdateNoticeEvent, {
      code: UPDATE_NOTICE_CODE.NO_NEW_VERSION
    });
  });
  // 下载监听
  autoUpdater.on('download-progress', (progressInfo) => {
    sendMessageToRenderer<IUpdateNoticeData>(win, UpdateNoticeEvent, {
      code: UPDATE_NOTICE_CODE.DOWNLOADING,
      message: progressInfo
    });
  });
  // 下载完成
  autoUpdater.on('update-downloaded', () => {
    sendMessageToRenderer<IUpdateNoticeData>(win, UpdateNoticeEvent, {
      code: UPDATE_NOTICE_CODE.DOWNLOAD_SUCCESS
    });
  });
  // 监听渲染进程事件：执行更新检查
  ipcMain.on(UPDATE_REQUEST_EVENTS.CHECK_UPDATE, () => {
    logger.debug('渲染进程事件', UPDATE_REQUEST_EVENTS.CHECK_UPDATE);
    autoUpdater.checkForUpdates().catch(err => {
      logger.info('网络连接问题', err);
    });
  });
  // 监听渲染进程事件：退出并安装
  ipcMain.on(UPDATE_REQUEST_EVENTS.CONFIRM_UPDATE, () => {
    logger.debug('渲染进程事件', UPDATE_REQUEST_EVENTS.CONFIRM_UPDATE);
    autoUpdater.quitAndInstall();
  });

  // 监听渲染进程事件：手动下载更新文件
  ipcMain.on(UPDATE_REQUEST_EVENTS.CONFIRM_DOWNLOAD, () => {
    logger.debug('渲染进程事件', UPDATE_REQUEST_EVENTS.CONFIRM_DOWNLOAD);
    autoUpdater.downloadUpdate();
  });
}

export default {
  setup
};
