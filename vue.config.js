// const PJT = process.argv.reduce((acc, v) => acc?acc:(v.match(/--prj=(.+)/) ?? [])[1], '')
// process.env.VUE_APP_PJT=PJT

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
  chainWebpack: config => {
    // console.log(PJT)
  }
}
