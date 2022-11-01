import { ipcRenderer } from 'electron';
import { IUpdateNoticeData, IUpdateServiceAPI, UpdateNoticeEvent, UPDATE_REQUEST_EVENTS } from '../common';

const apis: IUpdateServiceAPI = {
  onMessage: (callback: (data:IUpdateNoticeData)=>void) => ipcRenderer.on(UpdateNoticeEvent, (ev, data) => {
    console.log('updateService onMessage', ev, data);
    callback(data);
  }),
  sendMessage: (event:UPDATE_REQUEST_EVENTS, data?: any) => {
    console.log('updateService sendMessage', event);
    ipcRenderer.send(event, data||'');
  }
};

export default {
  name: 'updateService',
  content: apis
};
