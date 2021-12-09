import {request} from './request'

export function getUsers(userinfo) {
 return request({
     url: 'users',
     params:userinfo
 })
}