import { isPromise } from 'src/utils/utils'
import { Application, AppStatus } from '../types'

export default function unMountApp(app: Application): Promise<any> {
    app.status = AppStatus.BEFORE_UNMOUNT

    let result = (app as any).unmount(app.props) // 调用应用的 unmount 方法
    
    if (!isPromise(result)) {
        result = Promise.resolve(result)
    } // 如果不是 promise，转换成 promise
    
    return result
    .then(() => {
        app.status = AppStatus.UNMOUNTED
    })
    .catch((err: Error) => {
        app.status = AppStatus.UNMOUNT_ERROR
        throw err
    })
}