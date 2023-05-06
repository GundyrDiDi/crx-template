import useLang from '@/store/useLang'
import { App } from 'vue'

const message = {
  读取商品sku失败: {

  },
  关闭: {
    en: 'close',
    ja: '閉じる'
  },
  加入会员: {
    ja: '会員登録へ'
  },
  登录后查看剩余搜索次数: {
    ja: '残利用可能数はログインし確認可能'
  },
  '今日剩余：': {
    ja: '本日利用可能回数：'
  },
  '图搜X次，关键词搜索Y次': {
    ja: '画像検索X回、日本語検索Y回'
  },
  sku: { ja: 'sku' },
  图片: { ja: '画像' },
  商品名: { ja: '商品名' },
  直行便sku: { ja: '直行便SKU' },
  商品规格: { ja: '商品プロパティ' },
  复制: {
    ja: 'コピー'
  },
  展示选择规格后的信息: {
    ja: 'ご選択商品の直行便SKUは、以下からご確認いただけます'
  },
  下载所有SKU: {
    ja: '全ての直行便SKUをダウンロード'
  },
  '※非会员每日限免X次图搜、Y次关键词搜索。开通会员可无限使用': {
    ja: `※非会員の方は、利用機能回数に制限あり
        画像検索：3回、日本語検索：3 回
        （会員登録で制限なし）`
  },
  '今日使用次数已达到上限，请开通会员': {
    ja: '本日KAERUツールの利用可能回数が上限に達しましたので、会員登録して下さい'
  },
  请先登录直行便: {
    ja: 'KAERUアイコンをクリックして \n THE直行便システムにログインして下さい'
  },
  未选择商品规格: {
    ja: 'まだ商品選択していません',
    en: 'No product SKU has been selected',
    ko: '상품규격 미선택',
    th: 'ยังไม่ได้เลือกข้อมูลจำเพาะของสินค้า'
  },
  搜索商品名或店舗名: {
    ja: '商品名/店舗名（日本語と中国語で検索可能）',
    en: 'Enter a product or shop',
    ko: '상품명이나 가게명 검색.',
    th: 'ค้นหาชื่อสินค้าหรือชื่อร้าน'
  },
  不支持采购: {
    ja: '購買はサポートされていません',
    ko: '구매가 지원되지 않습니다'
  },
  添加商品: {
    ja: '直行便カートに追加',
    ko: '상품추가'
  },
  添加商品成功: {
    ja: 'カートに追加しました'
  },
  添加商品失败: {
    ja: '追加に失敗しました'
  },
  商品数量不能为空: {
    ja: '必須項目 購入数量'
  },
  确定: {
    en: 'OK',
    ko: '확인',
    th: 'ตกลง'
  },
  登录: {
    ja: 'ログイン',
    en: 'Sign in',
    ko: '로그인',
    th: 'เข้าสู่ระบบ'
  },
  账号密码登录: {
    en: 'By Password',
    ko: '아이디 비밀번호 로그인',
    th: 'เข้าสู่ระบบด้วยรหัสผ่านบัญชี'
  },
  邮箱验证码登录: {
    en: 'By Email',
    ko: '이메일 로그인',
    th: 'เข้าสู่ระบบด้วยรหัสยืนยันอีเมล'
  },
  请输入账号: {
    en: 'Your username',
    ko: '아이디를 입력해주세요',
    th: 'โปรดป้อนบัญชี'
  },
  请输入密码: {
    en: 'Your password',
    ko: '비밀번호를 입력해주세요',
    th: 'โปรดป้อนรหัสผ่าน'
  },
  请输入邮箱: {
    en: 'Your email address',
    ko: '이메일을 입력해주세요',
    th: 'โปรดป้อนอีเมล์'
  },
  请输入验证码: {
    en: 'Verification code',
    ko: '인증번호를 입력해주세요',
    th: 'โปรดป้อนรหัสยืนยัน'
  },
  获取验证码: {
    en: 'Verify',
    ko: '인증번호 발송',
    th: 'รับรหัสยืนยัน'
  },
  发送中: {
    en: 'Waiting',
    ko: '인증번호 발송중',
    th: 'กำลังส่ง'
  },
  验证码已发送: {
    en: 'The Verification Code has been send to your email',
    ko: '인증번호가 이미 발송되었습니다',
    th: 'รหัสยืนยันได้ส่งแล้ว'
  },
  账号或密码错误: {
    en: 'Incorrect username or password',
    ko: '아이디 또는 비밀번호가 틀렸습니다.',
    th: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
  },
  邮箱或验证码错误: {
    en: 'Incorrect email or code',
    ko: '이메일 혹은 인증번호가 틀렸습니다.',
    th: 'อีเมลหรือรหัสยืนยันไม่ถูกต้อง'
  },
  '此邮箱未注册,请先注册': { // 后台返回文案
    en: 'The email address has\'t been registered yet.Please contact our service staff',
    ko: '아직 등록되지않은 이메일입니다. 회원가입을 해주세요',
    th: 'อีเมลนี้ไม่ได้ลงทะเบียน โปรดลงทะเบียนก่อน'
  },
  忘记密码: {
    en: 'Forgot password',
    ko: '비밀번호를 잃어버렸습니다',
    th: 'ลืมรหัสผ่าน'
  },
  注册会员: {
    en: 'Sign up',
    ko: '회원가입',
    th: 'ลงทะเบียนสมาชิก'
  },
  无效内容: {
    en: 'Invalid content',
    ko: '잘못된 내용',
    th: 'เนื้อหาไม่ถูกต้อง'
  },
  仅限输入英文和数字字符: {
    en: 'English Characters and Numbers Only',
    ko: '영문이나 숫자만 입력할 수 있습니다.',
    th: 'ป้อนตัวอักษรและตัวเลขเท่านั้น'
  },
  无效邮箱: {
    en: 'Invalid email address',
    ko: '존재하지 않는 이메일입니다.',
    th: 'อีเมลไม่ถูกต้อง'
  },
  必填内容: {
    en: 'Invalid content',
    ko: '반드시 입력',
    th: 'เนื้อหาที่ต้องกรอก'
  },
  英语: {
    en: 'English',
    ko: '영어',
    th: 'ภาษาอังกฤษ'
  },
  泰语: {
    en: 'Thai',
    ko: '태국어',
    th: 'ภาษาไทย'
  },
  韩语: {
    en: 'Korean',
    ko: '한국어',
    th: 'ภาษาเกาหลี'
  },
  绑定谷歌表: {
    en: 'Edit Your Google Sheets',
    ko: 'Google 시트 연동',
    th: 'เชื่อมโยง Google ชีต'
  },
  查看谷歌表: {
    en: 'My Sheets',
    ko: '내 구글 시트보기',
    th: 'Google ชีตของฉัน'
  },
  请输入谷歌表链接: {
    en: 'Enter the google sheet URL',
    ko: 'Google 시트 URL을 입력해 주세요',
    th: 'โปรดป้อนลิงค์ Google ชีต'
  },
  谷歌表: {
    en: 'the Google sheets',
    ko: 'Google 시트',
    th: 'the Google sheets'
  },
  未绑定谷歌表: {

  },
  绑定X后即可选购商品: {
    en: 'You can buy products after binding X',
    ko: 'X 연동후 상품을 선택할 수 있습니다.',
    th: 'คุณสามารถซื้อสินค้าหลังจากเชื่อมโยง X ชีต'
  },
  绑定: {
    en: 'Bind',
    ko: '연동',
    th: 'เชื่อมโยง '
  },
  解绑: {
    en: 'Unbind',
    ko: '연동해제',
    th: 'ยกเลิกเชื่อมโยง '
  },
  绑定成功: {
    en: 'Bind succeeded',
    ko: '연동 성공',
    th: 'เชื่อมโยงสำเร็จ '
  },
  数量: {
    en: 'Qty',
    ko: '수량',
    th: 'จำนวน'
  },
  我要代购: {
    en: 'I Want To Buy',
    ko: '장바구니에 담기',
    th: 'ฉันอยากซื้อ'
  },
  写入成功: {
    en: 'Entered succeeded',
    ko: '가져오기 성공',
    th: 'ป้อนสำเร็จ'
  },
  写入失败: {
    en: 'Entered Failed',
    ko: '가져오기 실패',
    th: 'ป้อนล้มเหลว'
  },
  删除失败: {
    en: 'Delete failed',
    ko: '삭제 실패',
    th: 'ลบล้มเหลว'
  },
  登录状态失效: {
    en: 'Login status is invalid',
    ko: '로그인 상태 비활성화',
    th: 'สถานะการเข้าสู่ระบบไม่ถูกต้อง'
  },
  退出登录: {
    en: 'Log out',
    ko: '로그아웃',
    th: 'ออกจากระบบ'
  },
  您确定退出登录吗: {
    en: 'Are you sure to log out?',
    ko: '로그아웃 하시겠습니까?',
    th: 'แน่ใจหรือไม่ที่จะออกจากระบบ'
  },
  退出登录后进货袋内的商品信息保留: {
    en: 'After logging out, the product information in the CKB cart will be retained',
    ko: '로그아웃 후,장바구니속에 상품 정보 보유하겠습니다',
    th: 'หลังจากออกจากระบบแล้ว ข้อมูลสินค้าในรถเข็นจะเก็บ'
  },
  取消: {
    en: 'cancel',
    ko: '취소',
    th: 'ยกเลิก'
  },
  该用户名已被注册: {
    en: 'Sorry, this has been registered',
    ko: '죄송합니다. 이미 등록된 계정입니다.',
    th: 'ชื่อผู้ใช้นี้ได้ถูกลงทะเบียนแล้ว'
  },
  请再次输入密码: {
    en: 'Please reconfirm the new password',
    ko: '다시한번 입력하세요',
    th: 'ยืนยันรหัสผ่านใหม่อีกครั้ง'
  },
  请输入您的名称: {
    en: 'Contact Name',
    ko: '이름',
    th: 'ชื่อผู้ติดต่อ'
  },
  同意此项条款: {
    en: 'Agree with following items',
    ko: '아래의 조항에 동의합나다.',
    th: 'ยอมรับทั้งหมด'
  },
  已有帐户去登录: {
    en: 'Already have an account? Sign in',
    ko: '계정이 있으십니까? 로그인하기',
    th: 'มีบัญชีอยู่แล้ว เข้าสู่ระบบ'
  },
  两次密码不一致: {
    en: 'Passwords must match',
    ko: '두 비밀번호가 일치하지 않습니다.',
    th: 'รหัสผ่านทั้งสองไม่ตรงกัน'
  },
  谷歌表语言: {
    en: 'Language of google sheet',
    ko: '구글엑셀 사용언어',
    th: 'การใช้ภาษาของ Google ชีต'
  },
  注册成功: {
    en: 'Registration success!',
    ko: '가입 성공!',
    th: 'ลงทะเบียนสำเร็จ'
  },
  邮箱验证码不正确: {
    en: 'The verification code format is incorrect, please re-enter',
    ko: '인증번호가 정확하지 않습니다. 다시한번 입력해 주세요.',
    th: 'รูปแบบรหัสยืนยันไม่ถูกต้อง กรุณาป้อนใหม่'
  },
  $: {}
}

export type Messages = typeof message

const create = (langs: string[]) => {
  const locale: { [key in (typeof langs)[number]]: obj<string> } = langs.reduce((acc, v) => ({ [v]: {}, ...acc }), {})
  Object.entries(message).forEach(([key, v]: [string, obj]) => {
    langs.forEach((lang) => {
      locale[lang][key] = v[lang] ?? key
    })
  })
  return locale
}

type T = (key: keyof Messages) => string

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        t: T
    }
}
declare global {
    export interface Window {
        t: T
    }
}

export const langs = ['ja', 'en', 'ko', 'th']

const locale = create(langs)

export const t: T = (msg) => locale[useLang().get('langCode')][msg]

export const i18n = (app: App) => {
  app.config.globalProperties.t = window.t = t
}
