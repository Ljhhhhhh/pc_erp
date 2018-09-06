import request from '@/utils/request'

export function meetingList(query) {
  return request({
    url: '/meet/meets/',
    method: 'get',
    params: query
  })
}

export function meetingEdit(id) {
  return request({
    url: '/meet/meets/' + id,
    method: 'get'
  })
}

export function meetingTypePerson(meet_type_id) {
  return request({
    url: '/meet/meets_select',
    method: 'post',
    data: {
      meet_type_id
    }
  })
}

export function createMeeting(data) {
  return request({
    url: '/meet/meets/',
    method: 'post',
    data
  })
}

export function updateMeeting(data, id) {
  return request({
    url: '/meet/meets/' + id,
    method: 'put',
    data
  })
}

export function deleteMeeting(id) {
  return request({
    url: '/meet/meets/' + id,
    method: 'delete'
  })
}

export function editMeetingLog(meet_content, id) {
  return request({
    url: '/meet/meet_content/' + id,
    method: 'put',
    data: {
      meet_content
    }
  })
}

export function endMeetingLog(meet_content, id) {
  return request({
    url: '/meet/meet_over/' + id,
    method: 'put',
    data: {
      meet_content
    }
  })
}

