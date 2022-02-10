<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>

export default {
  components:{

  },
  data(){
    return{

    }
  }
}
</script>
<style lang="scss">
@import 'assets/css/base.css';
#app {
  height: 100%;
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-width: 800px;
}

</style>
