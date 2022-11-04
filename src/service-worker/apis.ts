import $http from './fetch'

export const getData = () => $http.get()

export default {
  getData
}
