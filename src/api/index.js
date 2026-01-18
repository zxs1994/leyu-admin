import {
  get,
  post,
  put,
  del
} from './axios.config.js'

import {
  getToken,
  setToken
} from '@/utils'

const createApi = (path) => ({
  page: (params) => get(`${path}/page`, params),
  getById: (id) => get(`${path}/${id}`),
  save: (data) => post(`${path}`, data),
  updateById: (data) => put(`${path}/${data.id}`, data),
  removeById: (id) => del(`${path}/${id}`),
  list: (data) => get(`${path}`, data),
})

export const commonApi = {
  enums: () => get('/common/enums')
}

export const userApi = {
  ...createApi('/sys/user'),
  getUserInfo: () => get('/sys/user/info'),
  updateUserInfo: (data) => put('/sys/user/info', data),
}

export const roleApi = {
  ...createApi('/sys/role'),
}

export const permissionApi = {
  ...createApi('/sys/permission'),
  getPermissionTree: () => get('/sys/permission/tree')
}

export const authApi = {
  login: (data) => post('/auth/login', data),
  logout: () => post('/auth/logout'),
}

export const todoListApi = {
  page: () => {}
}