import { request } from "./request"

//轮播图和推荐
export function getHomeMultidata() {
    return request({
        url: '/home/multidata'
    })
}

// 商品
export function getHomeGoods(type, page) {
    return request({
        url: '/home/data',
        params: {
            type,
            page
        }
    })
}