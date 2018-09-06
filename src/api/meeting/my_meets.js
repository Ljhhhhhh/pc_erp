import request from '@/utils/request'

export function myMeets(query) {
  return request({
    url: '/user/meets/',
    method: 'get',
    params: query
  })
}

export function myProposals(query) {
  return request({
    url: '/user/meet_proposals/',
    method: 'get',
    params: query
  })
}

