import bootstrapApp from '../lifecycle/bootstrap'
import mountApp from '../lifecycle/mount'
import unMountApp from '../lifecycle/unmount'
import { Application, AppStatus } from '../types'

export const apps: Application[] = []

export async function loadApps() {
    const toUnMountApp = getAppsWithStatus(AppStatus.MOUNTED) // 获取所有已经挂载的应用
    if (toUnMountApp.length) {
        await Promise.all(toUnMountApp.map(unMountApp)) // 卸载所有已经挂载的应用
    }
    
    const toLoadApp = getAppsWithStatus(AppStatus.BEFORE_BOOTSTRAP) // 获取所有待挂载的应用
    await Promise.all(toLoadApp.map(bootstrapApp)) // 加载所有待挂载的应用

    const toMountApp = [
        ...getAppsWithStatus(AppStatus.BOOTSTRAPPED), 
        ...getAppsWithStatus(AppStatus.UNMOUNTED), 
    ] // 获取所有待挂载的应用
    
    await toMountApp.map(mountApp) // 挂载所有待挂载的应用
}

function getAppsWithStatus(status: AppStatus) {
    const result: Application[] = []
    apps.forEach(app => {  
        // 如果 app 路由规则匹配 to bootstrap or to mount
        if (isActive(app) && app.status === status) { // 如果应用是激活的，并且状态是待挂载
            switch (app.status) { 
                // 如果是待挂载，或者已经挂载过，或者已经卸载过，都需要重新挂载
                case AppStatus.BEFORE_BOOTSTRAP:
                case AppStatus.BOOTSTRAPPED:
                case AppStatus.UNMOUNTED: 
                    result.push(app)
                    break
            }
        } else if (app.status === AppStatus.MOUNTED && status === AppStatus.MOUNTED) {
            // 如果路由规则不匹配 to unmount
            result.push(app)
        } 
    })
    return result
}

// 判断应用是否激活
function isActive(app: Application) {
    return typeof app.activeRule === 'function' && app.activeRule(window.location)
}