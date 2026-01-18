import {
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
} from '@ant-design/icons-vue'

const Layout = () => import('@/layout/Layout.vue')

export default {
  path: '/sys',
  name: 'Sys',
  meta: {
    title: '系统',
    icon: SettingOutlined,
    isShowMenu: true,
    perm: 'sys', // ⭐ 模块级
  },
  component: Layout,
  children: [{
      path: 'user',
      name: 'User',
      meta: {
        title: '用户',
        icon: UserOutlined,
        isShowMenu: true,
        perm: 'sys:user:page', // ⭐ 页面权限
      },
      component: () => import('@/views/sys/User.vue'),
    },
    {
      path: 'role',
      name: 'Role',
      meta: {
        title: '角色',
        icon: TeamOutlined,
        isShowMenu: true,
        perm: 'sys:role:page',
      },
      component: () => import('@/views/sys/Role.vue'),
    },
    {
      path: 'permission',
      name: 'Permission',
      meta: {
        title: '权限',
        icon: SafetyOutlined,
        isShowMenu: true,
        perm: 'sys:permission:page',
      },
      component: () => import('@/views/sys/Permission.vue'),
    },
  ],
}