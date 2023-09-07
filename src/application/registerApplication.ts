import { Application, AppStatus } from '../types'
import { apps, loadApps } from './app'

export default function registerApplication(app: Application) {
    if (typeof app.activeRule === 'string') {
        const path = app.activeRule
        app.activeRule = (location = window.location) => location.pathname === path // 默认是根据路径匹配
    }
    
    // 给每个应用增加状态，默认是待挂载
    app.status = AppStatus.BEFORE_BOOTSTRAP 
    apps.push(app)
    
    loadApps() // 重写路由逻辑
} 