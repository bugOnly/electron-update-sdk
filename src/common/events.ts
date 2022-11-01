interface Listeners {
  [key: string]: Function[]
};

/**
 * 添加监听
 * @param eventName - event名称
 * @param listener - 响应函数
 * @param listeners - 已存响应函数集合
 */
function addEventListener(eventName: string, listener: Function, listeners: Listeners) {
  const exists = listeners[eventName] && listeners[eventName]?.indexOf(listener) !== -1;
  if (!exists) {
    listeners[eventName] = listeners[eventName] || [];
    listeners[eventName].push(listener);
  }
}
/**
 * 移除监听
 * @param eventName - event名称
 * @param listener - 响应函数
 * @param listeners - 已存响应函数集合
 */
function removeEventListener(eventName: string, listener: Function, listeners: Listeners) {
  if (listeners?.[eventName]) {
    const index = listeners[eventName].indexOf(listener);
    if (index !== -1) {
      listeners[eventName].splice(index, 1);
    }
  }
}

export class EventEmitter {
  private readonly _listeners: Listeners={};
  private readonly _onceListeners: Listeners={};
  
  /**
   * 添加监听
   * @param eventName - event名称
   * @param listener - 响应函数
   * @return `this`
   */
  public on(eventName: string, listener: Function): this {
    addEventListener(eventName, listener, this._listeners);
    return this;
  }
  /**
   * 移除监听
   * @param eventName - event名称
   * @param listener - 响应函数
   * @return `this`
   */
  public off(eventName: string, listener: Function):this {
    removeEventListener(eventName, listener, this._listeners);
    removeEventListener(eventName, listener, this._onceListeners);

    return this;
  }
  /**
   * 添加一次性监听
   * @param eventName - event名称
   * @param listener - 响应函数
   * @return `this` 
   */
  public once(eventName: string, listener: Function):this {
    addEventListener(eventName, listener, this._onceListeners);
    return this;
  }
  /**
   * 触发事件
   * @param event - event
   * @return `this`
   */
  public emit(eventName: string, data?:any):this {    
    if (this._listens(eventName)) {
      const ev = {
        eventName,
        data
      };

      const handlers = this._listeners[eventName] || [];

      for (const fn of handlers) {
        fn(ev);
      }

      const onceHandlers = this._onceListeners[eventName] ? [...this._onceListeners[eventName]] : [];

      for (const fn of onceHandlers) {
        // 一次性事件触发后移除监听
        removeEventListener(eventName, fn, this._onceListeners);
        fn.call(this, ev);
      }
    }

    return this;
  }
  /**
   * 判断是否监听了name事件
   * @param eventName - event名称
   */
  private _listens(eventName: string):boolean {
    return this._listeners[eventName]?.length > 0 || this._onceListeners[eventName]?.length > 0;
  }
};

export enum UPDATESERVICE_RENDERER_EVENTS {
  // 确认更新
  CONFIRM_UPDATE = 'CONFIRM_UPDATE',
  // 取消更新
  CANCEL_UPDATE = 'CANCEL_UPDATE',
  // 确认安装
  CONFIRM_INSTALL = 'CONFIRM_INSTALL',
  // 取消下载（下载过程中）
  CANCEL_DOWNLOAD = 'CANCEL_DOWNLOAD',
};
