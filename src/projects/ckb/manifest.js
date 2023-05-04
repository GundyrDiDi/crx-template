/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const json = fs.readFileSync(path.join(path.resolve(), 'src/manifest.json'), 'utf8')

const common1 = {
  name: 'KAERUツール(THE直行便)',
  homepage_url: 'https://s.theckb.com/',
  description: 'THE直行便は、お客様がより便利で中国の1688、タオバオ、Tmall公式サイトで商品を選択できるように、該ブラウザ拡張機能を開発致しました。',
  default_locale: 'ja',
  icons: {
    16: 'icons/logo1.png',
    32: 'icons/logo1.png',
    48: 'icons/logo1.png',
    96: 'icons/logo1.png',
    128: 'icons/logo1.png'
  },
  ...JSON.parse(json)
}

module.exports = {
  v2: {
    ...common1,
    manifest_version: 2,
    version: '0.0.0',
    background: {
      scripts: [
        'js/background.js'
      ],
      persistent: false
    },
    content_security_policy: "script-src 'self' 'unsafe-eval' ; object-src 'self'",
    browser_action: {
      default_title: 'THE直行便発注プラグイン',
      default_icon: {
        48: 'icons/logo1.png'
      }
    }
  },
  v3: {
    ...common1,
    version: '7.0.1',
    manifest_version: 3,
    background: {
      service_worker: 'js/background.js'
    }
  }
}
