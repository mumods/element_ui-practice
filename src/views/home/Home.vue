<template>
  <el-container class="home">
    <el-header>
      <div class="name"></div>
      <el-button type='info' @click='exit'>退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  components: {},
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
    }
    .el-aside{
      background-color: #333744;
    }
    .el-main{
      background-color: #eaedf1;
    }
  }
</style>
