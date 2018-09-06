import request from '@/utils/request'

export function workflow(type) {
  return request({
    url: '/workflow/workflow/' + type,
    method: 'get'
  })
}

export function workflowsign(signexport) {
  return request({
    url: '/workflow/workflowsign/ ' + signexport,
    method: 'get'
  })
}
