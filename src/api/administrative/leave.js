import request from '@/utils/request'

export function manageLeaveList(query) {
  return request({
    url: 'manage/leave',
    method: 'get',
    params: query
  })
}

export function createLeave(data) {
  return request({
    url: '/manage/leave/',
    method: 'post',
    data
  })
}

export function leaveInfo(id) {
  return request({
    url: 'manage/leave/' + id,
    method: 'get'
  })
}

export function updateLeave(data, id) {
  return request({
    url: 'manage/leave/' + id,
    method: 'put',
    data
  })
}

export function deleteLeave(id) {
  return request({
    url: 'manage/leave/' + id,
    method: 'delete'
  })
}
