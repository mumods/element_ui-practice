import {request} from './request'

export function report() {
 return request({
     url: 'reports/type/1',
     
 })
}