import { IUpdateNoticeData, UPDATE_NOTICE_CODE, UPDATE_REQUEST_EVENTS } from "../common";

declare const listenUpdateNotice;

interface IUpdateServiceRendererOpt {
    // 是否自动检测更新，设为true时 new 之后自动检测
    autoCheck?: boolean;
    // 是否渲染UI交互页面
    renderUi: boolean;
}
class UpdateServiceRenderer {
    private _renderUi:boolean;
    private _callbacks:Record<string,Function>;
    private _components: Record<string,HTMLElement>;
    constructor(opts:IUpdateServiceRendererOpt={renderUi:true}){
        this._renderUi = opts.renderUi;
        this._listenIpc();
        if(opts.autoCheck){
            this.checkUpdate();
        }
        if(opts.renderUi){
            this._preRender();
        }
    }
    /**
     * 检查更新
     */
    public checkUpdate(){
        listenUpdateNotice?.sendMessage?.(UPDATE_REQUEST_EVENTS.CHECK_UPDATE);
    }
    /**
     * 确认下载
     */
    public confirmDownload(){
        listenUpdateNotice?.sendMessage?.(UPDATE_REQUEST_EVENTS.CONFIRM_DOWNLOAD);
    }
    /**
     * 确认安装更新
     */
    public confirmUpdate(){
        listenUpdateNotice?.sendMessage?.(UPDATE_REQUEST_EVENTS.CONFIRM_UPDATE);
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
    public onDownloading(callback?:Function){
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
        this._renderUi && this._renderCheckingUI();
        this._callbacks[UPDATE_NOTICE_CODE.CHECKING]?.(msg);
    }
    /**
     * 回调：没有新版本
     */
    public _onNoUpdate(msg?:any){
        this._renderUi && this._renderNoUpdateUI();
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
    public _onDownloading(progress?:any){
        this._renderUi && this._renderDownloadingUI();
        this._callbacks[UPDATE_NOTICE_CODE.DOWNLOADING]?.(progress);
    }
    /**
     * 回调：更新失败
     */
    public _onUpdateFail(msg?:any){
        this._renderUi && this._renderFailUI();
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
        console.debug('_renderCheckingUI');
        this._components.$dialog.innerHTML = this._components.$dialog_checking.innerHTML;
        this._showDialog();
    }
    /**
     * 渲染UI：没有新版本
     */
    private _renderNoUpdateUI(){
        console.debug('_renderNoUpdateUI');
    }
    /**
     * 渲染UI：有可用更新
     */
    private _renderNeedUpdateUI(){
        console.debug('_renderNeedUpdateUI');
    }
    /**
     * 渲染UI：下载中
     */
    private _renderDownloadingUI(){
        console.debug('_renderDownloadingUI');
    }
    /**
     * 渲染UI：更新失败
     */
    private _renderFailUI(){
        console.debug('_renderFailUI');
    }
    /**
     * 渲染UI：下载完成
     */
    private _renderDownloadSuccessUI(){
        console.debug('_renderDownloadSuccessUI');
    }
    private _preRender(){
        const $body = document.body;
        // 遮罩背景
        const $mask = document.createElement('div');
        $mask.style.position = 'fixed';
        $mask.style.top = '0';
        $mask.style.left = '0';
        $mask.style.width = '100%';
        $mask.style.height = '100%';
        $mask.style.zIndex = '9999';
        $mask.style.display = 'none';

        // 弹窗
        const $dialog = document.createElement('div');
        $dialog.style.position = 'absolute';
        $dialog.style.top = '50%';
        $dialog.style.left = '50%';
        $dialog.style.transform = 'translate(-50%,-50%)';
        $dialog.style.width = 'auto';
        $dialog.style.height = 'auto';
        // $dialog.style.minWidth = '200px';
        // $dialog.style.minHeight = '120px';
        $dialog.style.zIndex = '10000';
        $dialog.style.textAlign = 'center';
        $dialog.style.display = 'none';

        const $dialog_checking = document.createElement('div');
        $dialog.style.width = '200px';
        $dialog.style.height = '100px';
        $dialog.style.lineHeight = '100px';
        $dialog.innerHTML = '检查更新中...';

        $body.appendChild($mask);
        $body.appendChild($dialog);
        
        
        this._components = {
            $body,
            $mask,
            $dialog,
            $dialog_checking
        };
    }
    private _showDialog(){
        this._components.$dialog.style.display = 'block';
        this._components.$mask.style.display = 'block';
    }
    private _hideDialog(){
        this._components.$dialog.style.display = 'none';
        this._components.$mask.style.display = 'none';
    }
    /**
     * 监听ipc
     */
    private _listenIpc(){
        window['listenUpdateNotice']?.onMessage?.((data:IUpdateNoticeData)=>{
            switch(data.code){
                // 检查更新中。。。
                case UPDATE_NOTICE_CODE.CHECKING:
                    this.onCheckingUpdate(data.message);
                    break;
                // 没有新版本
                case UPDATE_NOTICE_CODE.NO_NEW_VERSION:
                    this.onNoUpdate(data.message);
                    break;
                // 有新版本
                case UPDATE_NOTICE_CODE.HAS_NEW_VERSION:
                    this.onNeedUpdate(data.message);
                    break;
                // 下载完成
                case UPDATE_NOTICE_CODE.DOWNLOAD_SUCCESS:
                    this.onDownloadSuccess(data.message);
                    break;
                // 下载中
                case UPDATE_NOTICE_CODE.DOWNLOADING:
                    this.onDownloading(data.message);
                    break;
                // 更新失败
                case UPDATE_NOTICE_CODE.UPDATE_FAIL:
                    this.onUpdateFail(data.message);
                    break;
            }
        });
    }
}
export { UpdateServiceRenderer };