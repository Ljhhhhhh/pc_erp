import request from '@/utils/request'

export function proposalsList(query) {
  return request({
    url: '/meet/proposals',
    method: 'get',
    params: query
  })
}

export function proposalsPassList(query) {
  return request({
    url: '/meet/all_pass_need_vote_meet_proposals',
    method: 'get',
    params: query
  })
}

export function proposalDeatil(id) {
  return request({
    url: '/meet/proposals/' + id,
    method: 'get'
  })
}

export function createProposal(data) {
  return request({
    url: '/meet/proposals',
    method: 'post',
    data
  })
}

export function updateProposal(data, id) {
  return request({
    url: '/meet/proposals/' + id,
    method: 'put',
    data
  })
}

export function assignProposal(data, id) {
  return request({
    url: '/meet/proposal_status/' + id,
    method: 'put',
    data
  })
}

export function deleteProposal(id) {
  return request({
    url: '/meet/proposals/' + id,
    method: 'delete'
  })
}

