module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-px-to-viewport":{
      viewportWidth: 1536,
    viewportHeight: 864,
    unitPrecision: 5, //防止无法整除
    viewportUnit: 'vw', //指定需要转换的单位
    // selectorBlackList:['ignore'], //指定不需要转换的类名 可以给所有不需要转换的元素加上ignore类
    minPixelValue:1,  //最小转换单位，过小的元素不会被转换
    mediaQuery:false
    }
  }
}