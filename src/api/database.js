import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/database_list',
    method: 'get',
    params: query
  })
}

export function databaseBackup(data) {
  return request({
    url: '/admin/backup_database',
    method: 'post',
    data: data
  })
}

export function fetchBackupList(query) {
  return request({
    url: '/admin/backup_list',
    method: 'get',
    params: query
  })
}

export function restoreDatabase(data) {
  return request({
    url: '/admin/restore_database',
    method: 'post',
    data: data
  })
}
