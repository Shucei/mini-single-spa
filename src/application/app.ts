import { Application } from '../types'
export const apps: Application[] = []

export function reroute() {
  
}

// 判断应用是否激活
function isActive(app: Application) {
    return typeof app.activeRule === 'function' && app.activeRule(window.location)
}