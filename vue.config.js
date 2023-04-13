/* eslint-disable @typescript-eslint/no-var-requires */
console.log(process.argv)
const PJT = process.argv.reduce((acc, v) => acc || (v.match(/--prj=(.+)/) ?? [])[1], '') || 'ckb'
process.env.VUE_APP_PJT = PJT
const { v2, v3 } = require(`./src/projects/${PJT}/manifest.ts`)
const path = require('path')

module.exports = {
  // pages: {
  //   popup: {
  //     template: 'public/browser-extension.html',
  //     entry: './src/popup/main.js',
  //     title: 'Popup'
  //   }
  // },
  productionSourceMap: false,
  pluginOptions: {
    browserExtension: {
      artifactsDir: './dist',
      manifestTransformer: () => {
        if (process.env.NODE_ENV === 'development') {
          return v2
        } else {
          return v3
        }
      },
      artifactFilename: () => `${PJT}_${v3.version}.zip`,
      componentOptions: {
        background: {
          entry: 'src/background.ts'
        },
        contentScripts: {
          entries: {
            'content-script': [
              'src/content-scripts.ts'
            ]
          }
        }
      }
    }
  },
  css: {
    extract: false
  },
  chainWebpack: config => {
    config.resolve.alias.set('@p', path.join(__dirname, `src/projects/${PJT}`))
    // 字体和图片文件
    const rule = config.module.rule('fonts').use('url-loader')
    rule.tap(options => {
      return {
        ...options,
        limit: 100 * 1024 * 1024
      }
    })
    const rule2 = config.module.rule('images').use('url-loader')
    rule2.tap(options => {
      return {
        ...options,
        limit: 100 * 1024 * 1024
      }
    })
    const dir = path.join(__dirname, 'src/assets/icons')
    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include.add(dir).end() // 包含 icons 目录
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ extract: false }).end()
    config.plugin('svg-sprite').use(
      require('svg-sprite-loader/plugin'), [{ plainSprite: true }]
    )
    config.module.rule('svg').exclude.add(dir)
  }
  //
}
