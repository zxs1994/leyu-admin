import {
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  ApartmentOutlined,
  AuditOutlined
} from '@ant-design/icons-vue'

const Layout = () => import('@/layout/Layout.vue')

export default {
  path: '/sys',
  name: 'Sys',
  redirect: '/sys/user',
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
        title: '用户管理',
        icon: UserOutlined,
        isShowMenu: true,
        perm: 'sys:user:page', // ⭐ 页面权限
      },
      component: () => import('@/views/sys/User.vue'),
    },
    {
      path: 'dept',
      name: 'Dept',
      meta: {
        title: '组织部门',
        icon: ApartmentOutlined,
        isShowMenu: true,
        perm: 'sys:dept:tree',
      },
      component: () => import('@/views/sys/Dept.vue'),
    },
    {
      path: 'role',
      name: 'Role',
      meta: {
        title: '角色管理',
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
        title: '权限管理',
        icon: SafetyOutlined,
        isShowMenu: true,
        perm: 'sys:permission:page',
      },
      component: () => import('@/views/sys/Permission.vue'),
    },
    {
      path: 'operation-log',
      name: 'OperationLog',
      meta: {
        title: '操作日志',
        icon: AuditOutlined,
        isShowMenu: true,
        perm: 'sys:operation-log:page',
      },
      component: () => import('@/views/sys/OperationLog.vue'),
    }
  ],
}