import request from '@/utils/request'

export function managePurchasesList(query) {
  return request({
    url: 'manage/manage_purchases',
    method: 'get',
    params: query
  })
}

export function createPurchases(data) {
  return request({
    url: 'manage/manage_purchases',
    method: 'put',
    data
  })
}

export function editPurchases(id) {
  return request({
    url: 'manage/manage_purchases/' + id,
    method: 'get'
  })
}

export function updatePurchases(data, id) {
  return request({
    url: 'manage/manage_purchases/' + id,
    method: 'post',
    data
  })
}

export function deletePurchases(id) {
  return request({
    url: 'manage/manage_purchases/' + id,
    method: 'delete'
  })
}
