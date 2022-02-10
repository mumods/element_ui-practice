<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="100">
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table
        :data="rolesList"
        stripe
        border
        style="width: 100%"
        height="400"
      >
        <el-table-column type="expand" label="展開">
          <template slot-scope="scope">
            <el-row
              :class="[
                'borderBottom',
                'center',
                index === 0 ? 'borderTop' : '',
              ]"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
            >
              <el-col :span="5">
                <el-tag>{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[id === 0 ? '' : 'borderTop', 'center']"
                  v-for="(site, id) in item.children"
                  :key="site.id"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{ site.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="site1 in site.children"
                      :key="site1.id"
                      type="warning"
                      closable
                      @close="removeRights(scope.row, site1.id)"
                      >{{ site1.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序號"></el-table-column>
        <el-table-column prop="roleName" label="角色名稱"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editBtn(scope.row.id)"
              >編輯</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteBtn(scope.row.id)"
              >刪除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="getSetRights(scope.row)"
              >分配權限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="35%"
      @close="addDiaLogclose"
    >
      <el-form
        :model="addRoles"
        ref="addRuleForm"
        :rules="addUserRules"
        label-width="70px"
        class="addRuleForm"
      >
        <el-form-item prop="roleName" label="角色名稱">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesData">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改信息-->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="35%"
      @close="editDialogclose"
    >
      <el-form
        :model="editRolesList"
        ref="editRuleForm"
        :rules="addUserRules"
        label-width="70px"
        class="editRuleForm"
      >
        <el-form-item prop="roleName" label="角色名稱">
          <el-input v-model="editRolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述">
          <el-input v-model="editRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配权限-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsdialogVisible"
      width="30%"
      @close='setRightsdialogClose'
    >
      <el-tree
        show-checkbox
        :data="SetRightsList"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightdeter"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoles,
  addRoles,
  editRoles,
  queryRoles,
  deleteRoles,
  deleteRights,
  setRights,
  grantRights
} from "network/roles.js";
export default {
  name: "Roles",
  props: {},
  data() {
    return {
      roleId:'',
      rolesList: [],
      SetRightsList: [],
      defkeys:[],
      addRoles: {
        roleName: "",
        roleDesc: "",
      },
      editRolesList: {},
      addDialogVisible: false,
      editDialogVisible: false,
      setRightsdialogVisible: false,
      addUserRules: {
        roleName: [
          { required: true, message: "请输入用戶名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },

      //树形控件的prop
      defaultProps: {
        children: "children",
        label: "authName",
      },
    };
  },
  methods: {
    getRolesData() {
      getRoles().then((res) => {
        console.log(res);
        if (res.meta.status != 200) return;
        this.rolesList = res.data;
      });
    },
    addRolesData() {
      this.$refs.addRuleForm.validate((valid) => {
        //驗證表單數據書否全都通過驗證
        if (!valid) return;
        addRoles(this.addRoles).then((res) => {
          if (res.meta.status != 201) return this.$message.error("添加出錯");
          this.addDialogVisible = false;
          this.$message.success("添加成功");
          this.getRolesData();
        });
      });
    },
    addDiaLogclose() {
      this.$refs.addRuleForm.resetFields();
    },
    editDialogclose() {
      this.$refs.editRuleForm.resetFields();
    },
    editRole() {
      this.$refs.editRuleForm.validate((valid) => {
        if (!valid) return;
        editRoles(this.editRolesList).then((res) => {
          if (res.meta.status != 200) return this.$message.error("修改失敗");
          this.editDialogVisible = false;
          this.$message.success("修改成功");
          this.getRolesData();
        });
      });
    },

    //打開修改對話框
    editBtn(id) {
      queryRoles(id).then((res) => {
        if (res.meta.status != 200) return this.$message.error("失敗");
        this.editDialogVisible = true;
        this.editRolesList = res.data;
        console.log(this.editRolesList);
      });
    },
    deleteBtn(id) {
      deleteRoles(id).then((res) => {
        if (res.meta.status != 200) return this.$message.error("刪除失敗");
        this.$message.success("刪除成功");
        this.getRolesData();
      });
    },
    removeRights(role, rightid) {
      this.$confirm("此操作将永久删除该權限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          deleteRights(role.id, rightid).then((e) => {
            console.log(e);
            if (e.meta.status != 200) return this.$message.error("删除失败");
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            role.children = e.data;
          });
        })
        .catch((err) => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getSetRights(e) {
      this.roleId=e.id
      setRights().then((res) => {
        if (res.meta.status != 200)
          return this.$message.error("获取权限列表失败");
        this.SetRightsList = res.data;
        // console.log(e)
        this.getLeafKeys(e,this.defkeys)
      });
      this.setRightsdialogVisible = true;
    },
    getLeafKeys(node,arr){
      if(!node.children) return arr.push(node.id)
      node.children.forEach(item=>{
        this.getLeafKeys(item,arr)
      })
    },
    setRightsdialogClose(){
      this.defkeys = []
    },
    setRightdeter(){
      const keys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      const x = keys.join()
        console.log(x)
      grantRights(this.roleId,x).then(res=>{
        if(res.meta.status!=200 ) return this.$message.error('分配权限失败')
        this.$message.success('分配权限成功')
        this.getRolesData()
      this.setRightsdialogVisible = false
      })
      
    }
  },
  created() {
    this.getRolesData();
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-card {
  margin: 10px 0;
  .el-table {
    margin: 10px 0 0 0;
  }
}
.el-tag {
  margin: 10px;
}
.borderRight {
  border-right: 1px solid #f3f3f3;
}
.borderTop {
  border-top: 1px solid #f3f3f3;
}
.borderBottom {
  border-bottom: 1px solid #f3f3f3;
}
.center {
  display: flex;
  align-items: center;
}
</style>
