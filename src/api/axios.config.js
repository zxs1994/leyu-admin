import axios from 'axios'
import {
  getToken,
  gotoLogin
} from '@/utils'
// import router from '@/router'
import {
  message
} from 'ant-design-vue'
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
})
import dayjs from 'dayjs'
import {
  userApi
} from '@/api'

const transformData = (data, obj) => {
  if (!data) return {} // 如果数据不存在，直接返回
  const result = {
    ...data,
    ...obj
  }
  result.createdAt = data.createdAt ? dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
  result.updatedAt = data.updatedAt ? dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss') : ''

  return result
}

const transformRes = (res, obj) => {
  const data = res.data
  if (Array.isArray(data)) {
    return {
      ...res,
      data: data.map(i => transformData(i, obj))
    }
  }
  if (res.data?.records) {
    // 如果是分页数据，处理 records
    return {
      ...res,
      data: {
        ...res.data,
        records: res.data.records.map(i => transformData(i, obj))
      }
    }
  }
  return {
    ...res,
    data: transformData(data, obj)
  }
}

axiosInstance.interceptors.request.use(async function (config) {
  try {
    if (!config.headers) {
      config.headers = {}
    }
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    // config.headers['lang'] = 'zh-CN'
  } catch (error) {
    console.error('axios request error:', error)
    // window.location.assign(LOGIN_ADDRESS);
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return config
  }
})

axiosInstance.interceptors.response.use(
  async res => {
      const data = res.data || {}
      const code = data.code
      const config = res.config || {}
      const msg = data.msg || data.code
      // console.log(config)
      switch (code) {
        case 200:
          if (config.showMsg) {
            message.success(msg)
          }
          break
        case 401:
          // console.log(data)
          message.warning(msg)
          gotoLogin()
          break

        case '10009':
          try {
            if (config.name === 'refreshToken') {
              throw new Error('Token 刷新失败')
            }
            await userApi.refresh()
            return axiosInstance(config) // 重试原始请求
          } catch (e) {
            console.log(e)
            gotoLogin()

            break
          }
          default:
            if (!config.noShowError) {
              message.error(msg)
            }
            break
      }
      return transformRes(data)
    },
    (error) => {
      const msg = error?.response?.data?.message || error?.message || error
      message.error(msg)
      throw {
        ...error,
        msg,
      }
    },
)

export function get(path, params = undefined, config = {}) {
  return axiosInstance.get(path, {
    params,
    ...config
  })
}

export function post(path, body = undefined, config = {}) {
  return axiosInstance.post(path, body, config)
}

export function put(path, body = undefined, config = {}) {
  return axiosInstance.put(path, body, config)
}

export function del(path, body = undefined, config = {}) {
  return axiosInstance.delete(path, {
    body,
    ...config,
  })
}

export default axiosInstance