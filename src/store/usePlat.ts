import { PLATS } from '@/hooks/const'
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import $ from 'jquery'
import { getUrlParams, historyParams } from '@/hooks/useUrl'
import usePdt from './usePdt'

declare global{

}

export default defineStore('plat', () => {
  const plat = ref('')
  const s = usePdt()
  const init = (platName:string, isProduct:boolean) => {
    plat.value = platName
  }
  return {
    plat,
    init
  }
})
