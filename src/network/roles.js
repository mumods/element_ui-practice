import {request} from './request'

export function getRoles() {
    return request({
        url: 'roles'
    })
}
export function addRoles(data) {
    return request({
        url: 'roles',
        method:'post',
        data,
    })
}
export function queryRoles(id) {
    return request({
        url: `roles/${id}`
    })
}
export function editRoles(e) {
    return request({
        url: `roles/${e.roleId}`,
        method:'put',
        data:{
            roleName:e.roleName,
            roleDesc:e.roleDesc
        }
    })
}

export function deleteRoles(id) {
    return request({
        url: `roles/${id}`,
        method:'delete'
    })
}

export function deleteRights(id,rightid) {
    return request({
        url: `roles/${id}/rights/${rightid}`,
        method:'delete'
    })
}

export function setRights() {
    return request({
        url: `rights/tree`
    })
}

export function grantRights(roleId,rids) {
    return request({
        url: `roles/${roleId}/rights`,
        method:'post',
        data:{
            rids,
        }
    })
}