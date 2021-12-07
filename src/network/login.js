import {request} from './request'

export function login(loginForm) {
 return request({
     url: 'login',
     data: loginForm,
     method: 'post'
 })
}