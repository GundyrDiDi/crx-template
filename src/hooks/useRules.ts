import { t } from '@/i18n'

const rules = {
  required (val:string) {
    if (val === '' || val === null || val === undefined) {
      return t('无效内容')
    }
  },
  noblank (val:string) {
    if (val.trim() === '') {
      return t('无效内容')
    }
  },
  plain (val:string) {
    if (!/^[\da-zA-Z\s-]+$/.test(val.trim())) {
      return t('仅限输入英文和数字字符')
    }
  },
  plainEn (val:string) {
    if (!/^[a-zA-Z\s-]+$/.test(val.trim())) {
      return t('仅限输入英文字符')
    }
  },
  email (val:string) {
    if (!/[\d\w]+\b@([a-zA-ZA-z0-9-]+\.)+[a-z]+/.test(val)) {
      return t('无效邮箱')
    }
  },
  password (val:string) {
    const reg = /^[A-Za-z0-9!@#$%^&*.]{6,32}$/
    if (!reg.test(val)) {
      return t('输入的密码格式不正确，请设置X-Y个字符，字母和数字的组合，字母区分大小写').replace(/X-Y/, '6-32')
    }
  },
  phone (val:string) {
    if (!(val === '-' || /^[\d-]{6,20}$/.test(val))) {
      return t('格式不正确，请输入6-20位数字或“-”')
    }
  },
  backup (val:string) {
    //
  }
}

type RuleName = keyof typeof rules

type Param = RuleName|fn

/**
 * in one validator
 * @param keys
 * @returns
 */
export const useRule = (...keys:Param[]) => {
  return async (rule:obj, val:string) => {
    for (let i = 0; i < keys.length; i++) {
      const v = keys[i]
      const fn:fn = (v as RuleName) in rules ? rules[v as RuleName] : (v as fn)
      const reject = await fn(val)
      if (reject) {
        return Promise.reject(new Error('※ ' + reject))
      }
    }
  }
}

/**
 *
 * @param keys rule key
 * @param trigger blur | change
 * @param required 必填
 * @returns ant-form type rule
 */
export const useRules = (keys:Param|Param[], trigger:'blur'|'change' = 'blur', required = true) => {
  const data:Param[] = Array.isArray(keys) ? (keys ?? []) : [keys]
  if (required)data.unshift('required')
  return {
    required,
    validator: useRule(...data),
    trigger
  }
}
