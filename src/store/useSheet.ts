import { defineStore } from 'pinia'
import { ref } from 'vue'
import usePdt from './usePdt'
import { connect } from '@/hooks/useExt'

export default defineStore('sheet', () => {
  const list = ref([])
  const googleUrl = connect('googleUrl', '')
  const addSheet = () => {
    //
  }
  return {
    googleUrl,
    list,
    addSheet
  }
})
