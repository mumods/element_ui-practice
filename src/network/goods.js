import {request} from './request'
export function getGoods(params) {
 return request({
     url:'goods',
     params,
 })
}
export function deleteGoods(id) {
    return request({
        url:`goods/${id}`,
        method:'delete'
    })
}

export function trendsParams(id,sel) {
    return request({
        url:`categories/${id}/attributes`,
        params:{
            sel
        }
    })
}

export function upload(file) {
    return request({
        url:'upload',
        method:'post',
        data:{
            file
        }
    })
}