import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'home', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/userinfo',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/userinfo'),
      name: 'userinfo',
      meta: {
        title: 'userinfo',
        icon: 'userinfo'
      }
    }]
  },
  {
    path: '/todo',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/userinfo/todo'),
      name: 'todo',
      meta: {
        title: 'todo',
        icon: 'todo'
      }
    }]
  },
  {
    path: '/done',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/userinfo/todo'),
      name: 'done',
      meta: {
        title: 'done',
        icon: 'done'
      }
    }]
  },
  {
    path: '/administrative',
    component: Layout,
    redirect: 'noredirect',
    name: 'administrative',
    meta: {
      title: 'administrative',
      icon: 'company'
    },
    children: [{
      path: 'vehicleApply',
      component: () => import('@/views/administrative/vehicleApply'),
      name: 'vehicleApply',
      meta: {
        title: 'vehicleApply'
      }
    },
    {
      path: 'addCarApply',
      component: () => import('@/views/administrative/components/addCarApply'),
      name: 'addCarApply',
      hidden: true,
      meta: {
        title: 'addCarApply',
        noCache: true
      }
    },
    {
      path: 'carApplyDetail',
      component: () => import('@/views/administrative/components/carApplyDetail'),
      name: 'carApplyDetail',
      hidden: true,
      meta: {
        title: 'carApplyDetail',
        noCache: true
      }
    },
    {
      path: 'leaveDetail',
      component: () => import('@/views/administrative/components/leaveDetail'),
      name: 'leaveDetail',
      hidden: true,
      meta: {
        title: 'leaveDetail',
        noCache: true
      }
    },
    {
      path: 'purchasesDetail',
      component: () => import('@/views/administrative/components/purchasesDetail'),
      name: 'purchasesDetail',
      hidden: true,
      meta: {
        title: 'purchasesDetail',
        noCache: true
      }
    },
    {
      path: 'editLeave',
      component: () => import('@/views/administrative/components/editLeave'),
      name: 'editLeave',
      hidden: true,
      meta: {
        title: 'editLeave',
        noCache: true
      }
    },
    {
      path: 'leave',
      component: () => import('@/views/administrative/leave'),
      name: 'leave',
      meta: {
        title: 'leave',
        noCache: true
      }
    },
    {
      path: 'addPurchases',
      component: () => import('@/views/administrative/components/addPurchases'),
      name: 'addPurchases',
      hidden: true,
      meta: {
        title: 'addPurchases',
        noCache: true
      }
    },
    {
      path: 'purchases',
      component: () => import('@/views/administrative/purchases'),
      name: 'purchases',
      meta: {
        title: 'purchases',
        noCache: true
      }
    }]
  },
  {
    path: '/meet',
    component: Layout,
    meta: {
      title: 'meeting',
      icon: 'meeting'
    },
    children: [{
      path: 'meeting',
      component: () => import('@/views/meeting/meeting'),
      name: 'meeting',
      meta: {
        title: 'meeting'
      }
    },
    {
      path: 'meeting_edit',
      component: () => import('@/views/meeting/components/meetingEdit'),
      name: 'meetingEdit',
      hidden: true,
      meta: {
        title: 'meetingEdit',
        noCache: true
      }
    },
    {
      path: 'meeting_detail',
      component: () => import('@/views/meeting/components/meetingDetail'),
      name: 'meetingDetail',
      hidden: true,
      meta: {
        title: 'meetingDetail',
        noCache: true
      }
    },
    {
      path: 'proposals',
      component: () => import('@/views/meeting/proposals'),
      name: 'proposals',
      meta: {
        title: 'proposals'
      }
    },
    {
      path: 'proposals_edit',
      component: () => import('@/views/meeting/components/proposalsEdit'),
      name: 'proposalsEdit',
      hidden: true,
      meta: {
        title: 'proposalsEdit',
        noCache: true
      }
    },
    {
      path: 'proposals_date',
      component: () => import('@/views/meeting/proposalsDate'),
      name: 'proposalsDate',
      meta: {
        title: 'proposalsDate'
      }
    },
    {
      path: 'proposals_detail',
      component: () => import('@/views/meeting/components/proposalsDetail'),
      name: 'proposalsDetail',
      hidden: true,
      meta: {
        title: 'proposalsDetail',
        noCache: true
      }
    },
    {
      path: 'proposals_date_detail',
      component: () => import('@/views/meeting/components/proposalsDateDetail'),
      name: 'proposalsDateDetail',
      hidden: true,
      meta: {
        title: 'proposalsDateDetail',
        noCache: true
      }
    },
    {
      path: 'my_meets',
      component: () => import('@/views/meeting/myMeets'),
      name: 'my_meets',
      meta: {
        title: 'my_meets'
      }
    },
    {
      path: 'my_proposals',
      component: () => import('@/views/meeting/myProposals'),
      name: 'my_proposals',
      meta: {
        title: 'my_proposals'
      }
    }]
  },
  {
    path: '/companies',
    component: Layout,
    redirect: 'noredirect',
    name: 'companies',
    meta: {
      title: 'companies',
      icon: 'company'
    },
    children: [
      { path: 'usergroups', component: () => import('@/views/usergroup/index'), name: 'usergroups', meta: { title: 'department' }},
      { path: 'position', component: () => import('@/views/position'), name: 'position', meta: { title: 'position' }},
      { path: 'users', component: () => import('@/views/user/index'), name: 'users', meta: { title: 'users' }},
      { path: 'role', component: () => import('@/views/user/role'), name: 'role', meta: { title: 'roles' }},
      { path: 'role/permission', component: () => import('@/views/user/components/role_permission'), name: 'role_permission', hidden: true, meta: { title: 'role_permission', noCache: true }},
      { path: 'user_nodes', component: () => import('@/views/user/user_nodes'), name: 'user_nodes', meta: { title: 'user_nodes' }},
      { path: 'admin_log', component: () => import('@/views/admin/admin_log'), name: 'admin_log', meta: { title: 'logs' }},
      {
        path: 'workflow',
        component: () => import('@/views/user/workflow'),
        name: 'workflow',
        meta: { title: 'workflow' }
      },
      {
        path: 'workflow_edit',
        component: () => import('@/views/user/components/workflowEdit'),
        hidden: true,
        name: 'workflowEdit',
        meta: {
          noCache: true,
          title: 'workflow_edit'
        }
      },
      { path: 'login_log', component: () => import('@/views/admin/login_log'), name: 'login_log', meta: { title: 'login' }}

    ]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/database_backup',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'database_manager',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'database_backup',
      component: () => import('@/views/admin/database_back'),
      name: 'database_backup',
      meta: {
        title: 'database_backup',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'database_restore',
      component: () => import('@/views/admin/database_restore'),
      name: 'database_restore',
      meta: {
        title: 'database_restore'
      }
    }]
  }
]
