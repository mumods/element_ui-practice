module.exports = {
    // devServer: {
    //     host: 'localhost',
    //     port: 8080, 
    //     open: true 
    // },
    configureWebpack:{
        resolve:{
            alias:{
                'assets': '@/assets',
                'commom': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views'
            }
        }
    },

    //从外部导入，打包时不占用空间
//     chainWebpack: config=>{
//         config.set('externals',{
//             vue: 'vue',
//             'vue-router': 'VueRouter',
//             axios: 'axios',
//             lodash: '_',
//             echarts: 'echarts',
//             nprogress: 'NProgress',
//             'vue-quill-editor': 'VueQuillEditor'
//         })
//     }
}