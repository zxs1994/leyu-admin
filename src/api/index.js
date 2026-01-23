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
  item: (id) => get(`${path}/${id}`),
  add: (data) => post(`${path}`, data),
  update: (data) => put(`${path}/${data.id}`, data),
  delete: (id) => del(`${path}/${id}`),
  list: (data) => get(`${path}`, data),
})

export const commonApi = {
  enums: () => get('/common/enums'),
}

export const authApi = {
  login: (data) => post('/auth/login', data),
  logout: () => post('/auth/logout'),
}

export const deptApi = {
  ...createApi('/sys/dept'),
  tree: () => get('/sys/dept/tree'),
}

export const userApi = {
  ...createApi('/sys/user'),
  getUserInfo: () => get('/sys/user/info'),
  updateUserInfo: (data) => put('/sys/user/info', data),
}

export const roleApi = {
  ...createApi('/sys/role'),
  getPermissionTree: () => get('/sys/role/permission-tree'),
}

export const permissionApi = {
  ...createApi('/sys/permission'),
}

export const tenantApi = {
  ...createApi('/platform/tenant'),
  switchTenant: (id) => post(`/platform/tenant/switch/${id}`),
}