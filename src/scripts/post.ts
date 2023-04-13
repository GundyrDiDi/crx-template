import { readImg } from '@/hooks/useSrhImg'
import { sendMessage } from '@/hooks/useExt'
import { PLATS } from '@/hooks/const'

export default (plat:string) => {
  if (plat === PLATS.theckb) {
    window.addEventListener('message', (res) => {
      const { cmd, imgData, userData } = res.data ?? {}
      if (cmd === 'uploadImg') {
        readImg(imgData.src, '1688')
      } else if (cmd === 'transferUser') {
        console.log('transferUser', userData)
        const { token, curShop, user } = userData
        const { systemSource } = user ?? {}
        sendMessage('setUser', { token, curShop, systemSource })
      }
    })
    setTimeout(() => {
      window.postMessage({ isInstall: true }, '*')
    }, 2000)
  }
}
