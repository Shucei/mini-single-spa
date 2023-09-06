import path from 'path'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import rollup from 'rollup'
import { uglify } from 'rollup-plugin-uglify' 

const resolveFile = function (filePath) {
    return path.join(__dirname, filePath)
}

const pluginName = 'mini-single-spa' 
function getOptions(mode) {
    const result = {
        input: resolveFile('src/index.ts'),
        output: {
            file: resolveFile(`dist/${pluginName}.${mode}.js`),
            format: mode,
            sourcemap: true,
            name: 'MiniSingleSPA', 
        },
        plugins: [
            resolve(),
            commonjs(),
            typescript(),
            json({
                compact: true,
            }),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV), 
            }),
        ],
    }

    if (process.env.NODE_ENV === 'production') {
        result.plugins.push(uglify({
            compress: {
                drop_console: true,
            },
        }))
    }

    return result
}

if (process.env.NODE_ENV === 'development') {
    const watcher = rollup.watch(getOptions('esm')) // 监听文件变化
    console.log('rollup is watching for file change...')
    // 监听构建过程中的各个事件
    watcher.on('event', event => {
        switch (event.code) {
            case 'START': // 构建开始
                console.log('rollup is rebuilding...')
                break
            case 'ERROR': // 有错误时，控制台会打印错误信息
            case 'FATAL':
                console.log('error in rebuilding.')
                break
            case 'END': // 完成构建
                console.log('rebuild done.')
        }
    })
}

const modes = ['esm', 'cjs', 'iife']
export default modes.map(mode => getOptions(mode)) 