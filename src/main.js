import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import TreeTable from 'vue-table-with-tree-grid'

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.component('treeTable',TreeTable)
Vue.filter('dateFormat',function(e){
  const dt = new Date(e*1000)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2,'0')
  const d = dt.getDate().toString().padStart(2,'0')
  const hh = dt.getHours().toString().padStart(2,'0')
  const mm = dt.getMinutes().toString().padStart(2,'0')
  const ss = dt.getSeconds().toString().padStart(2,'0')
  return `${y} - ${m} - ${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
