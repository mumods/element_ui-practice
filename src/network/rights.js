import {request} from './request'

export function rightList() {
    return request({
        url: 'rights/list'
    })
}