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
            clearable
            placeholder="请输入内容"
            v-model="userinfo.query"
            class="input-with-select"
            @clear="getUserInfo"
            @change="clearData"
          >
            <el-button
              @click="getUserInfo"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button @click="dialogVisible = true" type="primary"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <el-table border :data="userList" stripe style="width: 100%" height="320">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180"
        ></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <div slot-scope="scope">
            <!--scope表示表格prop的数据，scope.row为当前行的prop值-->
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChange(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </div>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editDialogShow(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="openDelete(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userinfo.pagenum"
        :page-sizes="[3, 5, 8, 20]"
        :page-size="userinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用戶"
      :visible.sync="dialogVisible"
      width="35%"
      @close="dialogClose"
    >
      <el-form
        :model="addUser"
        :rules="rulesAddUser"
        ref="ruleForm"
        label-width="60px"
        class="ruleForm"
      >
        <el-form-item label="用戶名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="郵箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手機" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用戶數據-->
    <el-dialog
      title="修改用戶信息"
      :visible.sync="editDialogVisible"
      width="35%"
    >
      <el-form
        :model="editUser"
        :rules="rulesAddUser"
        ref="editRuleForm"
        label-width="60px"
        class="editRuleForm"
      >
        <el-form-item label="用戶名">
          <el-input v-model="editUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="郵箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手機" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--权限-->
    <el-dialog @close='rolesClose' title="提示" :visible.sync="setRoledialogVisible" width="30%">
      <div style="text-align: left; line-height: 30px">
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <div>
          分配新角色:
          <el-select v-model="selectRole" placeholder="请选择">
            <el-option v-for="item in rolesData" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsers,
  updataState,
  addUserForm,
  editUserForm,
  getUserForm,
  deleteUserForm,
  saveUsersRoles,
  getUsersRoles
} from "network/users.js";
export default {
  name: "HelloWorld",
  props: {},
  data() {
    //驗證郵箱
    var checkMail = (rule, value, callback) => {
      const regMail =
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (regMail.test(value)) return callback();
      callback(new Error("請輸入合法的郵箱"));
    };
    //驗證號碼
    var checkPhoneNumber = (rule, value, callback) => {
      const regNumber =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regNumber.test(value)) return callback();
      callback(new Error("請輸入合法的電話"));
    };
    return {
      userinfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      total: 0,
      state: "",
      setRoledialogVisible: false,
      dialogVisible: false,
      editDialogVisible: false,
      rulesAddUser: {
        username: [
          { required: true, message: "请输入用戶名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密碼", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入郵箱", trigger: "blur" },
          { validator: checkMail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入電話號碼", trigger: "blur" },
          { validator: checkPhoneNumber, trigger: "blur" },
        ],
      },
      addUser: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editUser: {},
      //需要被分配角色的用户信息
      userInfo: {},
      rolesData:[],
      selectRole:''
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

    //輸入框沒有值是清除搜索
    clearData() {
      clearTimeout(this.timeId);
      this.timeId = setTimeout(() => {
        if (this.userinfo.query === "") {
          this.getUserInfo();
        }
      }, 100);
    },

    //页面点击切换显示数据条数
    handleSizeChange(e) {
      this.userinfo.pagesize = e;
      this.getUserInfo();
    },
    handleCurrentChange(e) {
      this.userinfo.pagenum = e;
      this.getUserInfo();
    },

    //
    stateChange(e) {
      //状态修改
      let id = Number(e.id);
      updataState(id, e.mg_state).then((res) => {
        console.log(res);
        if (res.meta.status != 200) {
          e.mg_state = !e.mg_state;
          this.$message.error("更新狀態失敗");
        } else {
          this.$message.success("更新狀態成功");
        }
      });
    },

    //關閉對話框
    dialogClose() {
      this.$refs.ruleForm.resetFields();
    },

    //添加用戶
    addUserInfo() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return;
        }
        addUserForm(this.addUser).then((res) => {
          if (res.meta.status != 201)
            return this.$message.error("添加用戶失敗");
          this.$message.success("添加用戶成功");
          this.dialogVisible = false;
          this.getUserInfo();
        });
      });
    },

    //顯示修改對話框
    editDialogShow(e) {
      this.editDialogVisible = true;
      getUserForm(e).then((res) => {
        if (res.meta.status != 200)
          return this.$message.error("查詢用戶信息失敗");
        this.editUser = res.data;
        console.log(res);
      });
    },
    //關閉修改對話框
    cancelEditDialog() {
      this.editDialogVisible = false;
    },
    //確認修改信息
    editUserInfo() {
      this.$refs.editRuleForm.validate((valid) => {
        if (!valid) return;
        editUserForm(this.editUser).then((res) => {
          console.log(res);
          if (res.meta.status != 200)
            return this.$message.error("修改信息失敗");
          this.editDialogVisible = false;
          this.$message.success("修改成功");
          this.getUserInfo();
        });
      });
    },
    //打開刪除框
    openDelete(e) {
      this.$confirm("刪除該用戶信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          console.log(res);
          deleteUserForm(e).then((result) => {
            if (result.meta.status != 200)
              return this.$message.error("刪除失敗");
            this.$message.error("刪除成功");
            this.getUserInfo();
          });
        })
        .catch((err) => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //重新分配角色权限
    setRole(userInfo) {
      this.userInfo = userInfo;
      getUsersRoles().then((res) => {
        if(res.meta.status!=200) return this.$message.error('获取失败')
        this.rolesData = res.data
      });
      this.setRoledialogVisible = true;
    },
    saveRoleInfo(){
      if(!this.selectRole) return this.$message.error('修改失败')
      saveUsersRoles(this.userInfo.id,this.selectRole).then(res=>{
        if(res.meta.status!=200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.setRoledialogVisible = false
        this.getUserInfo()
      })
    },
    rolesClose(){
      this.userInfo = {},
      this.rolesData = [],
      this.selectRole = ''
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
.el-table {
  margin-top: 20px;
  text-align: center;
  .el-table-column {
    display: flex;
    justify-content: space-between;
  }
}
.el-pagination {
  margin-top: 20px;
}
</style>