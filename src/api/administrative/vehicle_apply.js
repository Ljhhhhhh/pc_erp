import request from '@/utils/request'

export function manageCarsList(query) {
  return request({
    url: '/manage/manage_cars',
    method: 'get',
    params: query
  })
}

export function createManageCars(data) {
  return request({
    url: '/manage/manage_cars',
    method: 'post',
    data
  })
}

export function editManageCars(data, id) {
  return request({
    url: '/manage/manage_cars/' + id,
    method: 'put',
    data
  })
}

export function readManageCars(id) {
  return request({
    url: '/manage/manage_cars/' + id,
    method: 'get'
  })
}

export function deleteManageCars(id) {
  return request({
    url: '/manage/manage_cars/' + id,
    method: 'delete'
  })
}

