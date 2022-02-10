import {request} from './request'
export function getCategories() {
 return request({
     url:'categories'
 })
}
export function getParams(id,sel) {
    return request({
        url:`categories/${id}/attributes`,
        params:{
            sel
        }
    })
}
export function addParams(id,data) {
    return request({
        url:`categories/${id}/attributes`,
        method:'post',
        data
    })
}
export function getRowParams(id,attr_id,attr_sel) {
    return request({
        url:`categories/${id}/attributes/${attr_id}`,
        params:{
            attr_sel
        }
    })
}
export function editParams(id,attr_id,attr_name,attr_sel) {
    return request({
        url:`categories/${id}/attributes/${attr_id}`,
        method:'put',
        data:{
            attr_name,
            attr_sel
        }
    })
}
export function deleteParams(id,attr_id) {
    return request({
        url:`categories/${id}/attributes/${attr_id}`,
        method:'delete'
    })
}
export function addTagParams(id,attr_id,attr_name,attr_sel,attr_vals) {
    return request({
        url:`categories/${id}/attributes/${attr_id}`,
        method:'put',
        data:{
            attr_name,
            attr_sel,
            attr_vals
        }
    })
}   