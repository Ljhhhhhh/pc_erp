import request from '@/utils/request'

export function nodesList() {
  return request({
    url: '/user/nodes/',
    method: 'get'
  })
}

export function createNode(data) {
  return request({
    url: '/user/nodes/',
    method: 'post',
    data
  })
}

export function updateNode(id, data) {
  return request({
    url: '/user/nodes/' + id,
    method: 'put',
    data
  })
}

export function deleteNode(id, data) {
  return request({
    url: '/user/nodes/' + id,
    method: 'delete',
    data
  })
}

export function getNodesTree() {
  return request({
    url: '/user/nodes_tree',
    method: 'get'
  })
}
