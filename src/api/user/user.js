import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/users',
    method: 'get',
    params: query
  })
}

export function fetchUserInfo(id) {
  return request({
    url: '/user/users/' + id,
    method: 'get',
    params: { id }
  })
}

export function createUser(data) {
  return request({
    url: '/user/users',
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
  return request({
    url: '/user/users/' + id,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/users/' + id,
    method: 'delete'
  })
}

/**
 * 修改面膜
 * @param {旧密码，新密码} data
 */
export function resetPassword(data) {
  return request({
    url: '/user/resetPassword',
    method: 'put',
    data
  })
}
