import { EventEmitter, UPDATESERVICE_RENDERER_EVENTS } from '../common';

interface ICreateComponentsOpts {
  onClickMask: (ev: MouseEvent)=>void;
  eventBus: EventEmitter;
}
export function createComponents(opts:ICreateComponentsOpts){
  const $body = document.body;
  // 遮罩背景
  const $mask = document.createElement('div');
  $mask.style.position = 'fixed';
  $mask.style.top = '0';
  $mask.style.left = '0';
  $mask.style.width = '100%';
  $mask.style.height = '100%';
  $mask.style.zIndex = '9999';
  $mask.style.backgroundColor = '#000000';
  $mask.style.opacity = '0.4';
  $mask.style.display = 'none';
  $mask.onclick = opts.onClickMask;

  // 弹窗
  const $dialog = document.createElement('div');
  $dialog.style.position = 'absolute';
  $dialog.style.top = '50%';
  $dialog.style.left = '50%';
  $dialog.style.transform = 'translate(-50%,-50%)';
  $dialog.style.width = 'auto';
  $dialog.style.height = 'auto';
  $dialog.style.zIndex = '10000';
  $dialog.style.textAlign = 'center';
  $dialog.style.border = 'solid 1px #00000';
  $dialog.style.borderRadius = '4px';
  $dialog.style.backgroundColor = '#ffffff';
  $dialog.style.maxHeight = '60%';
  $dialog.style.maxWidth = '50%';
  $dialog.style.wordBreak = 'break-all';
  $dialog.style.overflow = 'auto';
  $dialog.style.padding = '10px';
  $dialog.style.display = 'none';
      
  return {
    $body,
    $mask,
    $dialog,
    $dialog_checking: createCheckingDialog(),
    $dialog_noUpdate: createNoUpdateDialog(),
    $dialog_downloading: createDownloadingDialog(),
    $dialog_downloadSuccess: createDownloadSuccessDialog(opts.eventBus),
    $dialog_neewUpdate: createNeedUpdateDialog(opts.eventBus),
    $dialog_fail: createFailDialog()
  };
}

// 检查更新弹窗
function createCheckingDialog(){
  const $dialog = document.createElement('div');
  $dialog.style.width = '200px';
  $dialog.style.height = '100px';
  $dialog.style.lineHeight = '100px';
  $dialog.innerHTML = '检查更新中...';

  return $dialog;
}

// 没有新版本提示弹窗
function createNoUpdateDialog(){
  const $dialog = document.createElement('div');
  $dialog.style.width = '200px';
  $dialog.style.height = '100px';
  $dialog.style.lineHeight = '100px';
  $dialog.innerHTML = '当前客户端已经是最新版本';

  return $dialog;
}

// 有新版本提示弹窗
function createNeedUpdateDialog(eventBus: EventEmitter){
  const $dialog = document.createElement('div');
  // 确认按钮
  const $btn_confirm = document.createElement('div');
  $btn_confirm.style.width = '80px';
  $btn_confirm.style.height = '30px';
  $btn_confirm.style.lineHeight = '30px';
  $btn_confirm.style.fontSize = '14px';
  $btn_confirm.style.fontWeight = 'bold';
  $btn_confirm.style.backgroundColor = '#1890ff';
  $btn_confirm.style.border = 'solid 1px #1890ff';
  $btn_confirm.style.borderRadius = '3px';
  $btn_confirm.style.cursor = 'pointer';
  $btn_confirm.style.color = '#ffffff';
  $btn_confirm.style.display = 'inline-block';
  $btn_confirm.style.verticalAlign = 'middle';
  $btn_confirm.style.marginRight = '10px';
  $btn_confirm.innerHTML = '确认更新';
  $btn_confirm.onclick = () => eventBus.emit(UPDATESERVICE_RENDERER_EVENTS.CONFIRM_UPDATE);
  // 取消按钮
  const $btn_cancel = document.createElement('div');
  $btn_cancel.style.width = '80px';
  $btn_cancel.style.height = '30px';
  $btn_cancel.style.lineHeight = '30px';
  $btn_cancel.style.fontSize = '14px';
  $btn_cancel.style.fontWeight = 'bold';
  $btn_cancel.style.backgroundColor = '#ffffff';
  $btn_cancel.style.border = 'solid 1px #d9d9d9';
  $btn_cancel.style.borderRadius = '3px';
  $btn_cancel.style.cursor = 'pointer';
  $btn_cancel.style.display = 'inline-block';
  $btn_cancel.style.verticalAlign = 'middle';
  $btn_cancel.innerHTML = '取消更新';
  $btn_cancel.onclick = () => eventBus.emit(UPDATESERVICE_RENDERER_EVENTS.CANCEL_UPDATE);

  const $btn_box = document.createElement('div');
  $btn_box.style.textAlign = 'center';
  $btn_box.style.marginTop = '10px';
  $btn_box.appendChild($btn_confirm);
  $btn_box.appendChild($btn_cancel);

  const $text_box = document.createElement('div');
  $text_box.style.textAlign = 'center';
  $text_box.innerHTML = '有新版本，是否下载安装？';

  $dialog.appendChild($text_box);
  $dialog.appendChild($btn_box);

  return $dialog;
}

// 下载中弹窗
function createDownloadingDialog(){
  const $dialog = document.createElement('div');
  $dialog.style.width = '200px';
  $dialog.style.height = '100px';
  $dialog.style.lineHeight = '100px';
  $dialog.innerHTML = '更新包下载中...';

  return $dialog;
}

// 下载完成弹窗
function createDownloadSuccessDialog(eventBus: EventEmitter){
  const $dialog = document.createElement('div');
  // 确认按钮
  const $btn_confirm = document.createElement('div');
  $btn_confirm.style.width = '80px';
  $btn_confirm.style.height = '30px';
  $btn_confirm.style.lineHeight = '30px';
  $btn_confirm.style.fontSize = '14px';
  $btn_confirm.style.fontWeight = 'bold';
  $btn_confirm.style.backgroundColor = '#1890ff';
  $btn_confirm.style.border = 'solid 1px #1890ff';
  $btn_confirm.style.borderRadius = '3px';
  $btn_confirm.style.cursor = 'pointer';
  $btn_confirm.style.color = '#ffffff';
  $btn_confirm.style.display = 'inline-block';
  $btn_confirm.style.verticalAlign = 'middle';
  $btn_confirm.style.marginRight = '10px';
  $btn_confirm.innerHTML = '安 装';
  $btn_confirm.onclick = () => eventBus.emit(UPDATESERVICE_RENDERER_EVENTS.CONFIRM_INSTALL);
  // 取消按钮
  const $btn_cancel = document.createElement('div');
  $btn_cancel.style.width = '80px';
  $btn_cancel.style.height = '30px';
  $btn_cancel.style.lineHeight = '30px';
  $btn_cancel.style.fontSize = '14px';
  $btn_cancel.style.fontWeight = 'bold';
  $btn_cancel.style.backgroundColor = '#ffffff';
  $btn_cancel.style.border = 'solid 1px #d9d9d9';
  $btn_cancel.style.borderRadius = '3px';
  $btn_cancel.style.cursor = 'pointer';
  $btn_cancel.style.display = 'inline-block';
  $btn_cancel.style.verticalAlign = 'middle';
  $btn_cancel.innerHTML = '取 消';
  $btn_cancel.onclick = () => eventBus.emit(UPDATESERVICE_RENDERER_EVENTS.CANCEL_UPDATE);

  const $btn_box = document.createElement('div');
  $btn_box.style.textAlign = 'center';
  $btn_box.style.marginTop = '10px';
  $btn_box.appendChild($btn_confirm);
  $btn_box.appendChild($btn_cancel);

  const $text_box = document.createElement('div');
  $text_box.style.textAlign = 'center';
  $text_box.innerHTML = '更新包下载完成，是否安装？';

  $dialog.appendChild($text_box);
  $dialog.appendChild($btn_box);

  return $dialog;
}

// 更新失败弹窗
function createFailDialog(){
  const $dialog = document.createElement('div');
  $dialog.innerHTML = '<h3>更新失败</h3>';
  return $dialog;
}
