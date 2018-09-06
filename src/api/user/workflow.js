// 流程管理
import request from '@/utils/request'

/* 获取流程列表 */
export function fetchWorkflow(query) {
  return request({
    url: '/workflow/list/',
    method: 'get',
    params: query
  })
}

/* 获取某个流程详情 */
export function workflowDetail(id) {
  return request({
    url: '/workflow/workflow/' + id,
    method: 'get'
  })
}

/* 创建流程详情 */
export function createWorkflowDetail(data) {
  return request({
    url: '/workflow/workflowdetail/',
    method: 'post',
    data
  })
}

/* 创建流程 */
export function createWorkflow(data) {
  return request({
    url: '/workflow/workflow/',
    method: 'post',
    data
  })
}

/* 修改流程详情 */
export function updateWorkflowDetail(data, id) {
  return request({
    url: 'workflow/workflowdetail/' + id,
    method: 'put',
    data
  })
}

/* 修改流程详情 */
export function updateWorkflow(data, id) {
  return request({
    url: 'workflow/workflow/' + id,
    method: 'put',
    data
  })
}

/* 删除流程（整个） */
export function deleteWorkflow(id) {
  return request({
    url: '/workflow/workflow/' + id,
    method: 'delete'
  })
}

/* 删除流程（某个详情） */
export function deleteWorkflowDetail(id) {
  return request({
    url: '/workflow/workflowdetail/' + id,
    method: 'delete'
  })
}

