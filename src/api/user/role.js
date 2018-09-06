import request from '@/utils/request'

export function rolesList(query) {
  return request({
    url: '/user/roles/',
    method: 'get',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: '/user/roles/',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: '/user/roles/' + id,
    method: 'put',
    data
  })
}

export function deleteRole(id, data) {
  return request({
    url: '/user/roles/' + id,
    method: 'delete',
    data
  })
}

export function roleAuth(data) {
  return request({
    url: '/user/user_auth/',
    method: 'post',
    data
  })
}

export function getAuth(query) {
  return request({
    url: '/user/auth_node/',
    method: 'get',
    params: query
  })
}
