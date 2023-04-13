import { defineStore } from 'pinia'
import { connect } from '@/hooks/useExt'

export default defineStore('lang', () => {
  const langCode = connect('langCode', 'en')
  return {
    langCode
  }
})
