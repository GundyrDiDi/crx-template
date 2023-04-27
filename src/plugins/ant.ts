import { message } from 'ant-design-vue'
import { MessageType } from 'ant-design-vue/lib/message'
import { t } from '@/i18n'

message.config({
  top: '30px',
  getContainer: () => window.__root,
  duration: 3
})

type MsgTypes = ['success', 'info', 'warn', 'error']

type msgFn = { [key in MsgTypes[number]]: (...r: Parameters<typeof t>) => MessageType }

const msgTypes: MsgTypes = ['success', 'info', 'warn', 'error']

export const msg = msgTypes.reduce((acc, v) => {
  acc[v] = (msg) => message[v](t(msg))
  return acc
}, {} as msgFn)
