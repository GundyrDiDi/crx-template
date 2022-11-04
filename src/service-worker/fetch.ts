const serize = (params, url) => params

function create (options):any {
  const baseUrl = options.baseUrl
  const setConfig = (config:any) => ({})
  const http = async (url, config = {}) => {
    const { params, ...rest } = config
    const whole = baseUrl + serize(params, url)
    return fetch(whole, await setConfig(rest))
      .then(res => res.json())
      .then(res => options.response(res))
  }
  return {
    baseUrl,
    get (url, data) {
      return http(url, {
        methods: 'get',
        data
      })
    },
    post (url, data) {
      return http(url, {
        methods: 'post',
        data
      })
    }
  }
}

const $http = create({})
$http.create = create

export default $http
