import axios from 'axios'

export function request(config, success, failure) {


    // 1.创建axios实例
    const instance = axios.create({
        // baseURL: 'http://123.207.32.32:8000',
        // baseURL: 'http://localhost:3000',
        baseURL: "http://152.136.185.210:7878/api/m5",
        timeout: 5000
    })

    //2.拦截器
    // 2.1请求拦截
    instance.interceptors.request.use(config => {
        // console.log(config);
        //请求拦截的作用
        //1. config信息不符合服务器的要求
        //2.发送请求前,要在界面中显示一个请求图标  show
        //3.某些请求要携带某些信息 比如(登录token)
        return config //拦截后要返回
    }, err => {
        // console.log(err);
    })
    //2.2响应拦截
    instance.interceptors.response.use(res => {
        // console.log(res);
        return res.data
    }, err => {
        // console.log(err);
    })

    //3.发送网络请求
    return instance(config)
}
