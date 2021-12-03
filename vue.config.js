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
    }
}