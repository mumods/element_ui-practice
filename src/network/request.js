import axios from 'axios'
export function request(config) {
    return new Promise((resolve,reject) =>{
        //创建axios实例
        const instance =axios.create({
            baseURL:'https://lianghj.top:8888/api/private/v1/',
            timeout:5000
        })

        //拦截器
        instance.interceptors.request.use(config =>{
            // console.log(config)
            //操作
            //1.比如一些情求信息不符合要求，需要修改
            //2.每次发送请求时，希望在界面显示一个请求图标，比如加载中
            //3.登录请求添加token码
            return config
        },err =>{
            // console.log(err)
        })
        instance.interceptors.response.use(res =>{
            // console.log(res)
            return res.data
        },err =>{
            // console.log(err)
        })

        instance(config).then(res =>{
            resolve(res)
        }).catch(res =>{
            reject(err)
        })
    })
}

// export function request1(config) {
//     //创建axios实例
//     const instance = axios.create({
//         baseURL:'http://',
//         timeout:5000
//     })
//     return instance(config)
// }
