import { useUrlSearchParams } from '@vueuse/core'

export const historyParams = useUrlSearchParams('history')

export const hashParams = useUrlSearchParams('hash')

export const getUrlParams = useUrlSearchParams
