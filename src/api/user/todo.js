import request from '@/utils/request'

/**
 * 待办已办数量
 */
export function work_num() {
  return request({
    url: '/user/workflow_all_nums',
    method: 'get'
  })
}

/**
 * 待办列表
 * @param {*} query
 */
export function todoList() {
  return request({
    url: '/user/workflow_doing',
    method: 'get'
  })
}

/**
 * 已办列表
 * @param {*} query
 */
export function doneList() {
  return request({
    url: '/user/workflow_done',
    method: 'get'
  })
}

/**
 * 具体流程详情
 */
export function workflowDetail(id) {
  return request({
    url: '/workflow/workflow_apply_process/' + id,
    method: 'get'
  })
}

/**
 * 用户同意他人流程
 */
export function workflowApplyAllow(id, data) {
  return request({
    url: '/user/workflow_apply_allow/' + id,
    method: 'put',
    data
  })
}

/**
 * 用户驳回他人流程
 */
export function workflowApplyNoAllow(id, data) {
  return request({
    url: '/user/workflow_apply_not_allow/' + id,
    method: 'put',
    data
  })
}

/**
 * 用户取回自己流程
 */
export function workflowApplyTakeback(id, next_step) {
  return request({
    url: 'user/workflow_back_own/' + id,
    method: 'put',
    data: {
      next_step
    }
  })
}
