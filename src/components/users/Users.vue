<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" shadow="always">
      <el-row>
        <el-col :span="7" :offset="0">
          <el-input
            placeholder="请输入内容"
            v-model="inputInfo"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="0"
          ><el-button type="primary">添加用户</el-button></el-col
        >
      </el-row>
      <el-table border :data="userList" stripe style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <div slot-scope="scope">
            <!--scope表示表格prop的数据，scope.row为当前行的prop值-->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </div>
          </el-table-column>
        <el-table-column  label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getUsers } from "network/users.js";
export default {
  name: "HelloWorld",
  props: {},
  data() {
    return {
      inputInfo: "",
      userinfo: {
        query: "",
        pagenum: "1",
        pagesize: "10",
      },
      userList: [],
      total: "",
      state:''
    };
  },
  methods: {
    getUserInfo() {
      getUsers(this.userinfo).then((res) => {
        this.userList = res.data.users;
        this.total = res.data.total;
        console.log(res);
      });
    },
  },
  created() {
    this.getUserInfo();
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.el-breadcrumb {
  margin: 0 0 20px 0;
}
.el-table{
  margin-top: 20px;
  text-align: center;
}
</style>