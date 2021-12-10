import {request} from './request'

export function getUsers(userinfo) {
 return request({
     url: 'users',
     params:userinfo
 })

}
export function updataState(a,b) {
    return request({
        url: `users/${a}/state/${b}`,
        method:'put'
    })
}