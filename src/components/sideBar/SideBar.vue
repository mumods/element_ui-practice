<template>
  <el-menu
      router
      :collapse="isCollapse"
      :collapse-transition = 'false'
      unique-opened
      :default-active="activePath"
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF">
      <div :class="[toggle,isCollapse?fold:unfold]" @click="toggle"></div>
      <el-submenu :index="item.path" v-for="item in menuList" :key="item.id"> 
      <!--index表示路由位置-->
        <template slot="title">
          <i :class="icon[item.id]"></i>
          <span slot="title">{{item.authName}}</span>
        </template>
          <el-menu-item :index="'/'+site.path" v-for="site in item.children" :key="site.id" @click="active('/'+site.path)">
             <i class="el-icon-menu"></i>
            <span slot="title">{{site.authName}}</span>
          </el-menu-item>
      </el-submenu>
    </el-menu>
</template>

<script>
import {getMenu} from 'network/sideBar.js'
export default {
  name: 'Sidebar',
  props: {
    
  },
  data(){
    return {
      menuList:[],
      icon:{
        '125':'el-icon-user-solid',
        '103':'el-icon-s-shop',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-s-platform',
      },
      isCollapse:false,
      fold:'el-icon-s-fold',
      unfold:'el-icon-s-unfold',
      activePath:''
    }
  },
  methods: {
      toggle(){
        this.isCollapse = !this.isCollapse
        this.$emit('toggleChange',this.isCollapse)
      },
      active(e){
        sessionStorage.setItem('activePath',e)
        this.activePath = e
      }
    },
  created(){
    getMenu().then(res=>{
      this.menuList = res.data
      // console.log(res)
    }),
    this.activePath = sessionStorage.getItem('activePath')
  }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .el-menu{
    border-right: none;
    .el-icon-s-fold,.el-icon-s-unfold{
      width: 100%;
      box-sizing: border-box;
      padding-right: 10px;
      height: 30px;
      color: #666;
      font-size: 20px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background-color: #333744;
      cursor: pointer;
      border-bottom: 1px solid #444;
    }
  }
</style>