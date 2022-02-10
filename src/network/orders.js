import {request} from './request'

export function orders(params) {
 return request({
     url: 'orders',
     params
 })
}