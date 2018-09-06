import request from '@/utils/request'

export function fetchAdminLogList(query) {
  return request({
    url: '/admin/adminlog',
    method: 'get',
    params: query
  })
}

export function fetchLoginLogList(query) {
  return request({
    url: '/admin/loginlog',
    method: 'get',
    params: query
  })
}
