<template>
  <el-container class="home">
    <el-header>
      <div class="name">
        <img src="../../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type='info' @click='exit' size="small">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <SideBar/>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideBar from 'components/sideBar/SideBar'
export default {
  name: "Home",
  components: {
    SideBar
  },
  data(){
    return{

    }
  },
  methods:{
    exit(){
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
};
</script>
<style lang="scss" scoped>
  .home{
    height: 100%;
    .el-header{
      background-color: #373d41;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name{
          color: #fff;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        img{
          width: 50px;
          height: 50px;
          margin-right: 10px;
        }
      }
    }
    .el-aside{
      background-color: #333744;
    }
    .el-main{
      background-color: #eaedf1;
    }
  }
</style>
