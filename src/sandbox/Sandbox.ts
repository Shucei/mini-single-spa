/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
// 沙箱实现方案

// 1. 快照实现(浪费内存)
class SnapshotSandbox {
    active: boolean

    modifyPropsMap: Map<string, any>

    windowSnapShot: Window | null

    constructor() {
        this.active = false
        this.modifyPropsMap = new Map() // 保存修改的属性
        this.windowSnapShot = null // 保存 window 对象的快照
    }

    activate = () => {
        this.active = true
        this.windowSnapShot = { ...window } // 拷贝 window 对象
        // 恢复修改的属性
        Object.keys(this.modifyPropsMap).forEach((key) => {
            // @ts-ignore
            window[key] = this.modifyPropsMap[key]
        })
    }

    deactivate = () => {
        Object.keys(window).forEach((key) => {
            // @ts-ignore
            if (window[key] !== this.windowSnapShot[key]) {
                // 如果 window 对象的属性被修改
                // @ts-ignore
                this.modifyPropsMap[key] = window[key] // 保存修改的属性
                // @ts-ignore
                window[key] = this.windowSnapShot[key] // 恢复修改的属性
            }
        })
    }
}

// 2. 代理实现(两个应用一起运行window对象会被污染)
class ProxySandbox {
    modifyPropsMap: Map<string, any>

    addPropsMap: Map<string, any>

    currentPropsMap: Map<string, any>

    proxy: any

    constructor() {
    // 1、修改的内容  2、新增的内容   3、删除的内容
        this.modifyPropsMap = new Map() // 保存修改的属性
        this.addPropsMap = new Map() // 保存新增的属性
        this.currentPropsMap = new Map() // 保存当前的属性

        const proxy = new Proxy({}, {
            get: (target, key:any, recevier) => window[key], 
           
            set: (target, key: any, value) => {
                // @ts-ignore
                if (!window.hasOwnProperty(key)) {
                    // 如果 window 对象没有该属性，则为新增属性
                    this.addPropsMap.set(key, value)
                } else if (!this.modifyPropsMap.has(key)) { // 如果 window 对象有该属性，且没有被修改过
                    this.modifyPropsMap.set(key, window[key]) // 保存修改的属性
                }
                this.currentPropsMap.set(key, value) // 保存当前的属性
                window[key] = value
                return true
            },  
        })
        this.proxy = proxy
    }

    // eslint-disable-next-line class-methods-use-this
    setWindowProp = (key: string, value: any) => {
        if (value == undefined) {
            // @ts-ignore
            delete window[key]
        } else {
            // @ts-ignore
            window[key] = value
        }
    }

    active = () => {
        // 用最新的属性覆盖 window 对象 
        this.modifyPropsMap.forEach((value, key) => {
            this.setWindowProp(key, value)
        })
    }

    deactivate = () => {
        // 恢复修改的属性
        this.modifyPropsMap.forEach((value, key) => {
            this.setWindowProp(key, value)
        })

        // 删除新增的属性
        this.addPropsMap.forEach((value, key) => {
            this.setWindowProp(key, undefined)
        })
    }
}

// 优化代理，多实例
class OptimizeProxySandbox {
    active: boolean

    proxy : any

    constructor() {
        this.active = false
        this.proxy = new Proxy({}, {
            get: (target:any, key:any, recevier) => target[key] ?? window[key], // 如果代理对象没有该属性，则从 window 对象中获取
            set: (target:any, key:any, value) => {
                if (this.active) {
                    target[key] = value
                }
                return true
            },
        })
    }

    activate = () => {
        if (!this.active) this.active = true
    }

    deactivate = () => {
        this.active = false
    } 
}