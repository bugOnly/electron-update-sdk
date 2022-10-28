import { ipcRenderer } from 'electron';
import { IUpdateNoticeData, UpdateNoticeEvent, UPDATE_REQUEST_EVENTS } from '../common';

export default {
    name: 'updateService',
    content: {
        onMessage: (callback: (data:IUpdateNoticeData)=>void) => ipcRenderer.on(UpdateNoticeEvent, (ev, data) => {
            callback(data);
        }),
        sendMessage: ( event:UPDATE_REQUEST_EVENTS, data?: any) => {
            ipcRenderer.send(event,data);
        }
    }
}