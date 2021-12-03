import {request} from './request'

export function login(username,password) {
 return request({
     url: 'login',
     data: {
        username,
        password
        },
     method: 'post'
 })
}