<template>
  <div class="orders">
    <el-upload
      action
      :on-remove="handleRemove"
      list-type="picture"
      :on-success = 'handleSuccsess'
      :on-change="changeFile"
      :auto-upload="false"
      multiple
    >
      <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
      <el-button @click="submit" size="small" type="success">确认上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import { upload } from "network/goods";
export default {
  name: "reports",
  props: {},
  data() {
    return {
      imgData:[],
      uploadForm:null
    };
  },
  methods: {
      changeFile(e){
        // console.log(e)
        this.imgData.push(e.url)
        console.log(this.imgData)
      },
      handleSuccsess(e){
        console.log(e)
      },
      handleRemove(e){
        console.log(e)
      },
      submit(){
        upload(this.imgData).then(res=>{
          console.log(res)
        })
      }
  },
  created() {

  },
  mounted() {

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
