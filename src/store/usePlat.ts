import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import usePdt from './usePdt'
import { PLATS } from '@/hooks/const'

declare global{

}

export default defineStore('plat', () => {
  const plat = ref('')
  const pdt = usePdt()
  const init = async (platName:string, isProduct:boolean) => {
    plat.value = platName
    if (isProduct) {
      await pdt.init(platName)
    }
  }
  const showBubble = () => {
    return plat.value !== PLATS.theckb
  }
  return {
    plat,
    init,
    showBubble
  }
})
