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
export function addUserForm(data) {
    return request({
        url: 'users',
        data:data,
        method:'post'
    })
}
export function getUserForm(id) {
    return request({
        url: `users/${id}`
    })
}
export function editUserForm(e) {
    return request({
        url: `users/${e.id}`,
        data:{
            id:e.id,
            email:e.email,
            mobile:e.mobile
        },
        method:'put'
    })
}
export function deleteUserForm(id) {
    return request({
        url: `users/${id}`,
        data:{
            id,
        },
        method:'delete'
    })
}

export function getUsersRoles() {
    return request({
        url: 'roles'
    })
}

export function saveUsersRoles(id,rid) {
    return request({
        url: `users/${id}/role`,
        data:{
            rid,
        },
        method: 'put'
    })
}
