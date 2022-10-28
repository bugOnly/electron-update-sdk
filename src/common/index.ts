// 升级通知事件名称
export const UpdateNoticeEvent = 'UpdateNotice';
// 升级通知 code 
export enum UPDATE_NOTICE_CODE {
    UPDATE_FAIL = -1,
    CHECKING = 0,
    HAS_NEW_VERSION = 1,
    NO_NEW_VERSION = 2,
    DOWNLOADING = 3,
    DOWNLOAD_SUCCESS = 4
}
// 渲染进程向主进程发送升级相关的事件
export enum UPDATE_REQUEST_EVENTS {
    // 确认下载
    CONFIRM_DOWNLOAD = 'CONFIRM_DOWNLOAD',
    // 确认安装升级
    CONFIRM_UPDATE = 'CONFIRM_UPDATE',
    // 检查更新
    CHECK_UPDATE = 'CHECK_UPDATE'
}
// 升级通知报文结构
export interface IUpdateNoticeData {
    code: number;
    message?: any;
}