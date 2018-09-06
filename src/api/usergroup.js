import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/groups',
    method: 'get',
    params: query
  })
}

export function fetchGroupInfo(id) {
  return request({
    url: '/user/groups/' + id,
    method: 'get',
    params: { id }
  })
}

export function createGroup(data) {
  return request({
    url: '/user/groups',
    method: 'post',
    data
  })
}

export function updateGroup(id, data) {
  return request({
    url: '/user/groups/' + id,
    method: 'put',
    data
  })
}

export function deleteGroup(id) {
  return request({
    url: '/user/groups/' + id,
    method: 'delete'
  })
}
