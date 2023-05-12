import { defineStore } from 'pinia'
import { connect, write } from '@/hooks/useExt'

export default defineStore('lang', () => {
  const langCode = connect('langCode', 'en')
  const Langs = [
    { label: 'English', value: 'en' },
    { label: '한국어', value: 'ko' },
    { label: 'ภาษาไทย', value: 'th' }
  ]
  const changeLang = (lang:string) => {
    return write({ langCode: lang })
  }
  return {
    langCode,
    Langs,
    changeLang
  }
})
