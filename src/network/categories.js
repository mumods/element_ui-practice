import {request} from './request'

export function getCategories(params) {
 return request({
     url:'categories',
     params,
 })
}

export function addCategories(data) {
    return request({
        url:'categories',
        method:'post',
        data,
    })
   }
