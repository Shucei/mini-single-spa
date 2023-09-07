export interface AnyObject {
  [key: string]: any
}

export enum AppStatus { // 应用的状态
  BEFORE_BOOTSTRAP = 'BEFORE_BOOTSTRAP', // 启动前
  BOOTSTRAPPED = 'BOOTSTRAPPED', // 启动完毕
  BOOTSTRAP_ERROR = 'BOOTSTRAP_ERROR', // 启动失败
  BEFORE_MOUNT = 'BEFORE_MOUNT', // 挂载前
  MOUNTED = 'MOUNTED', // 挂载完毕
  MOUNT_ERROR = 'MOUNT_ERROR', // 挂载失败
  BEFORE_UNMOUNT = 'BEFORE_UNMOUNT', // 卸载前
  UNMOUNTED = 'UNMOUNTED', // 卸载完毕
  UNMOUNT_ERROR = 'UNMOUNT_ERROR', // 卸载失败
}

export interface Application {
  name: string // 应用名称
  activeRule: Function | string // 激活的路由规则
  loadApp: () => Promise<any> // 加载应用的方法
  props: AnyObject | Function // 传递给子应用的参数
  status?: AppStatus // 当前应用的状态
  container?: HTMLElement // 子应用的容器
  bootstrap?: (props: AnyObject) => Promise<any> // 启动子应用的方法
  mount?: (props: AnyObject) => Promise<any> // 挂载子应用的方法
  unmount?: (props: AnyObject) => Promise<any> // 卸载子应用的方法
} // 定义子应用的类型