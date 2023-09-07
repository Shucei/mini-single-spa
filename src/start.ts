import { loadApps } from './application/app'

let isStarted = false
export default function start() {
    if (!isStarted) {
        isStarted = true
        loadApps()
    }
}

export function isStart() {
    return isStarted
}