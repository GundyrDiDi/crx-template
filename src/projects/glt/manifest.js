/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const fs = require('fs')
const json = fs.readFileSync(path.join(path.resolve(), 'src/manifest.json'), 'utf8')
const common2 = {
  name: 'THE CKB Easybuy',
  homepage_url: 'https://s.theckb.com/',
  description: '',
  default_locale: 'en',
  icons: {
    16: 'icons/logo2.png',
    32: 'icons/logo2.png',
    48: 'icons/logo2.png',
    96: 'icons/logo2.png',
    128: 'icons/logo2.png'
  },
  ...JSON.parse(json)
}

module.exports = {
  v2: {
    manifest_version: 2,
    version: '0.0.0',
    ...common2,
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
        48: 'icons/logo2.png'
      }
    }
  },
  v3: {
    version: '6.0.0',
    manifest_version: 3,
    ...common2,
    background: {
      service_worker: 'js/background.js'
    }
  }
}
