import { EventEmitter, IUpdateNoticeData, IUpdateServiceAPI, UPDATESERVICE_RENDERER_EVENTS, UPDATE_NOTICE_CODE, UPDATE_REQUEST_EVENTS } from '../common';
import { createComponents } from './components';

declare global {
  interface Window { 
    updateService: IUpdateServiceAPI;
  }
}

interface IUpdateServiceRendererOpt {
  // 是否渲染UI交互页面
  renderUi?: boolean;
}

interface IUpdateServiceDownloadingProcess {
  percent?: number;
}
/**
 * 更新服务：渲染进程核心类
 */
class UpdateServiceRenderer {
  // 是否渲染UI提示
  private _renderUi:boolean;
  // 是否静默检查更新，未true时检查中和无更新时隐藏UI提示
  private _slient: boolean;
  private _callbacks:Record<string, Function>={};
  private _components: Record<string, HTMLElement>;
  // 点击遮罩关闭弹窗
  private _hideDialogViaClickMask = false;
  private _eventBus: EventEmitter = new EventEmitter();

  constructor(opts:IUpdateServiceRendererOpt={ renderUi:true }){
    this._renderUi = opts.renderUi;
    // 监听 ipc
    this._listenIpc();
    // 绑定事件
    this._bind();
    if(opts.renderUi){
      this._preRender();
    }
  }
  /**
   * 检查更新
   */
  public checkUpdate(slient = false){
    this._slient = slient;
    window.updateService?.sendMessage?.(UPDATE_REQUEST_EVENTS.CHECK_UPDATE);
  }
  /**
   * 确认下载
   */
  public confirmDownload(){
    window.updateService?.sendMessage?.(UPDATE_REQUEST_EVENTS.CONFIRM_DOWNLOAD);
  }
  /**
   * 确认安装更新
   */
  public confirmUpdate(){
    window.updateService?.sendMessage?.(UPDATE_REQUEST_EVENTS.CONFIRM_UPDATE);
  }
  /**
   * 配置回调：检测中
   * @param callback 自定义回调 
   */
  public onCheckingUpdate(callback?:Function){
    callback && (this._callbacks[UPDATE_NOTICE_CODE.CHECKING] = callback);
  }
  /**
   * 配置回调：没有新版本
   * @param callback 可自定义回调 
   */
  public onNoUpdate(callback?:Function){
    callback && (this._callbacks[UPDATE_NOTICE_CODE.NO_NEW_VERSION] = callback);
  }
  /**
   * 配置回调：有新版本
   * @param callback 可自定义回调 
   */
  public onNeedUpdate(callback?:Function){
    callback && (this._callbacks[UPDATE_NOTICE_CODE.HAS_NEW_VERSION] = callback);
  }
  /**
   * 配置回调：下载中
   * @param callback 可自定义回调 
   */
  public onDownloading(callback?:(process?:IUpdateServiceDownloadingProcess)=>void){
    callback && (this._callbacks[UPDATE_NOTICE_CODE.DOWNLOADING] = callback);
  }
  /**
   * 配置回调：更新失败
   * @param callback 可自定义回调 
   */
  public onUpdateFail(callback?:Function){
    callback && (this._callbacks[UPDATE_NOTICE_CODE.UPDATE_FAIL] = callback);
  }
  /**
   * 配置回调：下载完成
   * @param callback 可自定义回调 
   */
  public onDownloadSuccess(callback?:Function){
    callback && (this._callbacks[UPDATE_NOTICE_CODE.DOWNLOAD_SUCCESS] = callback);
  }
  /**
   * 回调：检测中
   */
  public _onCheckingUpdate(msg?:any){
    !this._slient && this._renderUi && this._renderCheckingUI();
    this._callbacks[UPDATE_NOTICE_CODE.CHECKING]?.(msg);
  }
  /**
   * 回调：没有新版本
   */
  public _onNoUpdate(msg?:any){
    !this._slient && this._renderUi && this._renderNoUpdateUI();
    this._callbacks[UPDATE_NOTICE_CODE.NO_NEW_VERSION]?.(msg);
  }
  /**
   * 回调：有新版本
   */
  public _onNeedUpdate(msg?:any){
    this._renderUi && this._renderNeedUpdateUI();
    this._callbacks[UPDATE_NOTICE_CODE.HAS_NEW_VERSION]?.(msg);
  }
  /**
   * 回调：下载中
   */
  public _onDownloading(progress?:IUpdateServiceDownloadingProcess){
    this._renderUi && this._renderDownloadingUI(progress);
    this._callbacks[UPDATE_NOTICE_CODE.DOWNLOADING]?.(progress);
  }
  /**
   * 回调：更新失败
   */
  public _onUpdateFail(msg?:any){
    this._renderUi && this._renderFailUI(msg);
    this._callbacks[UPDATE_NOTICE_CODE.UPDATE_FAIL]?.(msg);
  }
  /**
   * 回调：下载完成
   */
  public _onDownloadSuccess(msg?:any){
    this._renderUi && this._renderDownloadSuccessUI();
    this._callbacks[UPDATE_NOTICE_CODE.DOWNLOAD_SUCCESS]?.(msg);
  }
  /**
   * 渲染UI：检测中
   */
  private _renderCheckingUI(){
    console.log('_renderCheckingUI');
    this._hideDialogViaClickMask = false;
    this._components.$dialog.innerHTML = '';
    this._components.$dialog.appendChild(this._components.$dialog_checking);
    this._showDialog();
  }
  /**
   * 渲染UI：没有新版本
   */
  private _renderNoUpdateUI(){
    console.log('_renderNoUpdateUI');
    this._hideDialogViaClickMask = false;
    this._components.$dialog.innerHTML = '';
    this._components.$dialog.appendChild(this._components.$dialog_noUpdate);
    this._showDialog();
    // 3s 后自动关闭弹窗
    this._hideDialog(3000);
  }
  /**
   * 渲染UI：有可用更新
   */
  private _renderNeedUpdateUI(){
    console.log('_renderNeedUpdateUI');
    this._hideDialogViaClickMask = false;
    this._components.$dialog.innerHTML = '';
    this._components.$dialog.appendChild(this._components.$dialog_neewUpdate);
    this._showDialog();
  }
  /**
   * 渲染UI：下载中
   */
  private _renderDownloadingUI(progress?:IUpdateServiceDownloadingProcess){
    console.log('_renderDownloadingUI');
    const percent = progress?.percent?.toFixed(1);
    this._hideDialogViaClickMask = false;
    this._components.$dialog.innerHTML = '';
    this._components.$dialog_downloading.innerHTML = percent ? `更新下载中：${percent}%` : '更新下载中...';
    this._components.$dialog.appendChild(this._components.$dialog_downloading);
    this._showDialog();
  }
  /**
   * 渲染UI：更新失败
   */
  private _renderFailUI(msg:any=''){
    console.log('_renderFailUI');
    this._hideDialogViaClickMask = true;
    this._components.$dialog_fail.innerHTML = `<h3>更新失败</h3><div style='text-align:center;'>${msg}</div>`;
    this._components.$dialog.innerHTML = '';
    this._components.$dialog.appendChild(this._components.$dialog_fail);
    this._showDialog();
  }
  /**
   * 渲染UI：下载完成
   */
  private _renderDownloadSuccessUI(){
    console.log('_renderDownloadSuccessUI');
    this._hideDialogViaClickMask = false;
    this._components.$dialog.innerHTML = '';
    this._components.$dialog.appendChild(this._components.$dialog_downloadSuccess);
    this._showDialog();
  }
  /**
   * 部分UI
   */
  private _preRender(){
    this._components = createComponents({
      eventBus: this._eventBus,
      onClickMask: (ev)=>{
        ev.preventDefault();
        if(this._hideDialogViaClickMask){
          this._hideDialog();
        }
      }
    });

    const { $body, $mask, $dialog } = this._components;
    $body.appendChild($mask);
    $body.appendChild($dialog);
  }
  /**
   * 显示弹窗
   */
  private _showDialog(){
    this._components.$dialog.style.display = 'block';
    this._components.$mask.style.display = 'block';
  }
  /**
   * 隐藏弹窗
   */
  private _hideDialog(delay?:number){
    if(typeof delay === 'number' && delay > 0){
      setTimeout(() => {
        this._components.$dialog.style.display = 'none';
        this._components.$mask.style.display = 'none';
        this._components.$dialog.innerHTML = '';
      }, delay);
    }else{
      this._components.$dialog.style.display = 'none';
      this._components.$mask.style.display = 'none';
      this._components.$dialog.innerHTML = '';
    }
  }
  /**
   * 监听ipc
   */
  private _listenIpc(){
    window.updateService?.onMessage?.((data:IUpdateNoticeData)=>{
      switch(data.code){
        // 检查更新中。。。
        case UPDATE_NOTICE_CODE.CHECKING:
          this._onCheckingUpdate(data.message);
          break;
        // 没有新版本
        case UPDATE_NOTICE_CODE.NO_NEW_VERSION:
          this._onNoUpdate(data.message);
          break;
        // 有新版本
        case UPDATE_NOTICE_CODE.HAS_NEW_VERSION:
          this._onNeedUpdate(data.message);
          break;
        // 下载完成
        case UPDATE_NOTICE_CODE.DOWNLOAD_SUCCESS:
          this._onDownloadSuccess(data.message);
          break;
        // 下载中
        case UPDATE_NOTICE_CODE.DOWNLOADING:
          this._onDownloading(data.message as IUpdateServiceDownloadingProcess);
          break;
        // 更新失败
        case UPDATE_NOTICE_CODE.UPDATE_FAIL:
          this._onUpdateFail(data.message);
          break;
      }
    });
  }
  private _bind(){
    this._eventBus.on(UPDATESERVICE_RENDERER_EVENTS.CONFIRM_UPDATE, () => this.confirmDownload());
    this._eventBus.on(UPDATESERVICE_RENDERER_EVENTS.CANCEL_UPDATE, () => this._hideDialog());
    this._eventBus.on(UPDATESERVICE_RENDERER_EVENTS.CONFIRM_INSTALL, () => this.confirmUpdate());
    this._eventBus.on(UPDATESERVICE_RENDERER_EVENTS.CANCEL_DOWNLOAD, () => this._hideDialog());
  }
}

export { UpdateServiceRenderer };
