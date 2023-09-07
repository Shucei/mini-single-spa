import bootstrapApp from '../lifecycle/bootstrap'
import mountApp from '../lifecycle/mount'
import unMountApp from '../lifecycle/unmount'
import { Application, AppStatus } from '../types'

export const apps: Application[] = []
/**  
卸载所有已失活的子应用
初始化所有刚注册的子应用
加载所有符合条件的子应用

一：当页面 URL 改变后，如果子应用满足以下两个条件，则需要加载该子应用：
1、activeRule() 的返回值为 true，例如 URL 从 / 变为 /vue，这时子应用 vue 为激活状态（假设它的激活规则为 /vue）。
2、子应用状态必须为 bootstrap 或 unmount，这样才能向 mount 状态转换。如果已经处于 mount 状态并且 activeRule() 返回值为 true，则不作任何处理。

二：如果页面的 URL 改变后，子应用满足以下两个条件，则需要卸载该子应用：
1、activeRule() 的返回值为 false，例如 URL 从 /vue 变为 /，这时子应用 vue 为失活状态（假设它的激活规则为 /vue）。
2、子应用状态必须为 mount，也就是当前子应用必须处于加载状态（如果是其他状态，则不作任何处理）。然后 URL 改变导致失活了，所以需要卸载它，状态也从 mount 变为 unmount。
 */
export async function loadApps() {
    const toUnMountApp = getAppsWithStatus(AppStatus.MOUNTED) // 获取所有待卸载的应用
    
    if (toUnMountApp.length) {
        await Promise.all(toUnMountApp.map(unMountApp)) // 卸载所有已失活的子应用
    }
    
    const toLoadApp = getAppsWithStatus(AppStatus.BEFORE_BOOTSTRAP) // 获取所有待加载的应用
    await Promise.all(toLoadApp.map(bootstrapApp)) // 初始化所有刚注册的子应用

    const toMountApp = [
        ...getAppsWithStatus(AppStatus.BOOTSTRAPPED), 
        ...getAppsWithStatus(AppStatus.UNMOUNTED), 
    ] // 获取所有待挂载的应用
    
    await toMountApp.map(mountApp) // 加载所有符合条件的子应用
}

function getAppsWithStatus(status: AppStatus) {
    const result: Application[] = []
    apps.forEach(app => {  
        // 如果 app 路由规则匹配 to bootstrap or to mount
        if (isActive(app) && app.status === status) { // 判断应用是否激活
            switch (app.status) { 
                // 如果应用状态为待挂载、待卸载、待初始化，则直接返回
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