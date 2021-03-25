// 这里简单的 copy 了 vue-cli 提供的 build 代码
let webpackConfig = require('./webpack.config')

let rm = require('rimraf')
let path = require('path')
let webpack = require('webpack')
let util = require('util')

const compileCallback = (er, stats) => {
    if (er) throw er
    stats = stats.stats.isArray() ? stats.stats : [stats]
    stats.forEach((item) => {
        process.stdout.write(item.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')
    })         

    console.log('Build complete.\n')
}

rm(path.resolve(__dirname, './dist'), err => {
    if (err) throw err
    let compiler = webpack(webpackConfig)
    
    compiler.run(compileCallback)
})

