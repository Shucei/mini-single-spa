/* eslint-disable guard-for-in */
const newMapUrl = {}

/**
 * 处理script标签
 */
function processScripts() {
    Array.from(document.querySelectorAll('script')).forEach((script) => {
        if (script.type === 'systemjs-importmap') {
            const imports = JSON.parse(script.innerHTML).imports
            Object.entries(imports).forEach(([key, value]) => {
                newMapUrl[key] = value
            })
        }
    })
}
/**
 * 加载script标签
 * @param url
 * @returns
 */
function loadScript(url) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = newMapUrl[url] || url // 如果有cdn，那么就使用cdn,否则就使用本地路径
        script.async = true
        document.head.appendChild(script)
        script.addEventListener('load', () => {
            let _lastRegister = lastRegister
            lastRegister = undefined
            resolve(_lastRegister)
        })
    })
}

/**
 *
 * @returns 返回新增的全局变量
 */
let set = new Set()
function saveGlobalProp() {
    // 保存当前的全局变量
    for (let prop in window) {
        set.add(prop)
    }
}

saveGlobalProp()
function getLastGlobalProp() {
    for (let prop in window) {
        if (set.has(prop)) continue
        set.add(prop)
        return window[prop]
    }
}

let lastRegister // 用来保存当前的模块

class SystemJs {
    // eslint-disable-next-line class-methods-use-this
    import(id) {
        // id原则上可以是一个第三方路径cdn
        let Newexectue
        return Promise.resolve(processScripts())
        .then(() => {
            // 去当前路径查找对应的字样index.js
            const lastSepIndex = id.lastIndexOf('/')
            const baseUrl = window.location.href.slice(0, lastSepIndex + 1)
            // 如果是相对路径，那么就拼接上当前路径
            if (id.startsWith('./')) {
                return baseUrl + id.slice(2)
            }
            // 根据文件的路径，加载对应的资源文件
        })
        .then((url) => loadScript(url).then((register) => {
            // register: [deps, declare] => [['react', 'react-dom'],()=>{return {setters:[],execute(){}}}]
            console.log('文件加载完成')
            let { setters, execute } = register[1](() => { })
            Newexectue = execute
            return [register[0], setters]
        }).then(([registeration, setters]) => Promise.all(registeration.map((dep, i) => loadScript(dep).then(() => {
            const property = getLastGlobalProp() // 获取当前的全局变量
            // 加载完毕后，会在window上增添属性  window.React window.ReactDOM
            setters[i](property) 
        }))))).then(() => {
            Newexectue()
        })
    }

    // deps: 依赖的模块，declare: 模块的内容
    // eslint-disable-next-line class-methods-use-this
    register(deps, declare) {
        // 将回调的结果保存
        lastRegister = [deps, declare]
    }
}

new SystemJs().import('./index.ts').then(() => {
    console.log('加载完成')
})
