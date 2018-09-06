import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/positions',
    method: 'get',
    params: query
  })
}

export function fetchPositionInfo(id) {
  return request({
    url: '/user/positions/' + id,
    method: 'get',
    params: {
      id
    }
  })
}

export function createPosition(data) {
  return request({
    url: '/user/positions',
    method: 'post',
    data
  })
}

export function updatePosition(id, data) {
  return request({
    url: '/user/positions/' + id,
    method: 'put',
    data
  })
}

export function deletePosition(id) {
  return request({
    url: '/user/positions/' + id,
    method: 'delete'
  })
}
