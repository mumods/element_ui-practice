import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/home/Home.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//导航守卫，如果没有检测到登录token值，返回登录页面
router.beforeEach((to,from,next)=>{
  //to表示要跳转的路径 from表示从那跳转 next()表示跳转
  if(to.path === '/login') return next()
  const token = sessionStorage.getItem('token')
  if(!token) return next('/login')
})

export default router
