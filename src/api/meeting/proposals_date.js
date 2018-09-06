import request from '@/utils/request'

export function proposalsOverList(query) {
  return request({
    url: '/meet/proposals_over',
    method: 'get',
    params: query
  })
}
export function proposalsEnd(designated_status, id) {
  return request({
    url: '/meet/designated_status/' + id,
    method: 'put',
    data: {
      designated_status
    }
  })
}

export function proposalsUpdateRate(designated_rate, id) {
  return request({
    url: '/meet/proposals_update_rate/' + id,
    method: 'put',
    data: {
      designated_rate
    }
  })
}

