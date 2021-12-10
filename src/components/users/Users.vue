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
              @change="stateChange(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </div>
          </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userinfo.pagenum"
        :page-sizes="[1, 2, 3, 8]"
        :page-size="userinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getUsers } from "network/users.js";
import { updataState } from "network/users.js";
export default {
  name: "HelloWorld",
  props: {},
  data() {
    return {
      inputInfo: "",
      userinfo: {
        query: "",
        pagenum: 1,
        pagesize: 1,
      },
      userList: [],
      total: 0,
      state:''
    };
  },
  methods: {

    //获取数据
    getUserInfo() {
      getUsers(this.userinfo).then((res) => {
        this.userList = res.data.users;
        this.total = Number(res.data.total);
        // console.log(res);
      });
    },

    

    //页面点击切换显示数据条数
    handleSizeChange(e){
      this.userinfo.pagesize = e
      this.getUserInfo()
    },
    handleCurrentChange(e){
      this.userinfo.pagenum = e
      this.getUserInfo()
    },

    //
    stateChange(e){
      //状态修改
      let id = Number(e.id)
      updataState(id,e.mg_state).then(res=>{
        console.log(res)
      })
    }
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
  .el-table-column{
    display: flex;
    justify-content: space-between;
  }
}
.el-pagination{
  margin-top: 20px;
}
</style>