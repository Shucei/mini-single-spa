import overwriteEventsAndHistory from './navigation/overwriteEventsAndHistory'
export { default as registerApplication } from './application/registerApplication' // 根据路径加载应用
export { default as start } from './start' // 启动应用，挂载组件
overwriteEventsAndHistory()