const common2 = {
  name: 'KAERUツール(THE直行便)',
  homepage_url: 'https://s.theckb.com/',
  description: 'THE直行便は、お客様がより便利で中国の1688、タオバオ、Tmall公式サイトで商品を選択できるように、該ブラウザ拡張機能を開発致しました。',
  default_locale: 'ja',
  icons: {
    16: 'icons/ckb.png',
    32: 'icons/ckb.png',
    48: 'icons/ckb.png',
    96: 'icons/ckb.png',
    128: 'icons/ckb.png'
  },
  permissions: [
    'tabs',
    'storage',
    'notifications'
  ],
  content_scripts: [
    {
      matches: [
        'https://*.1688.com/*',
        'https://*.taobao.com/*',
        'https://*.tmall.com/*',
        'https://*.amazon.co.jp/*',
        'https://*.rakuten.co.jp/*',
        'https://*.aliexpress.com/*',
        'https://*.coupang.com/*',
        'https://*.coupangcdn.com/*',
        'https://*.gmarket.co.kr/*',
        'https://*.11st.co.kr/*',
        'https://s.theckb.com/*',
        'https://cdn-test.theckb.com/*',
        'https://*.png/*',
        'https://*.jpg/*',
        'https://*.bmp/*'
      ],
      js: [
        'js/content-script.js'
      ],
      run_at: 'document_end'
    }
  ]
}

module.exports = {
  v2: {
    ...common2,
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
        48: 'icons/ckb.png'
      }
    }
  },
  v3: {
    ...common2,
    version: '6.2.2',
    manifest_version: 3,
    background: {
      service_worker: 'js/background.js'
    }
  }
}
