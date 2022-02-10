<template>
  <div class="hello">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意！只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <el-row class="row">
        选择商品分类：
        <el-cascader clearable v-model="selectCateKeys" :options="cateList" :props="cateProps" expandTrigger="hover" @change="cateChange"> </el-cascader>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isBtnDisabled" @click="addDialog" size="mini" type="primary">添加参数</el-button>
          <el-table :data="manyList" border style="width: 100%">
            <el-table-column type="expand" label="展开">
              <template slot-scope="scope">
                <el-tag closable @close="tagClose(index, scope.row)" v-for="(item, index) in scope.row.attr_vals" :key="item.attr_id">
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"> + 添加vals</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="editParams(scope.row.attr_id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button @click="deleteParams(scope.row.attr_id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isBtnDisabled" size="mini" type="primary">添加属性</el-button>
          <el-table :data="onlyList" border style="width: 100%">
            <el-table-column type="expand" label="展开">
              <template slot-scope="scope">
                <el-tag closable @close="tagClose(index, scope.row)" v-for="item in scope.row.attr_vals" :key="item.attr_id">
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"> + 添加vals</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="editParams(scope.row.attr_id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button @click="deleteParams(scope.row.attr_id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加参数对话框-->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="30%" @close="dialogClose">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="70px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogEnsure">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑对话框-->
    <el-dialog :title="'编辑' + titleText" :visible.sync="editDialogVisible" width="30%" @close="editDialogClose">
      <el-form :model="editForm" :rules="addRules" ref="editForm" label-width="70px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogEnsure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategories } from 'network/categories'
import { getParams, addParams, getRowParams, editParams, deleteParams, addTagParams } from 'network/params'

export default {
  name: 'Params',
  props: {},
  data() {
    return {
      cateList: [], //级联的数据
      selectCateKeys: [], //级联框双向绑定数据
      cateProps: {
        value: 'cat_id', //选定的值 比如id
        label: 'cat_name', //显示的数据
        children: 'children', //父子之前是通过什么对象名来嵌套的
      }, //级联框props属性值
      activeName: 'many', //被激活的标题
      manyList: [], //动态参数列表数据
      onlyList: [], //静态属性列表数据
      addDialogVisible: false, //添加参数对话框显示与隐藏
      editDialogVisible: false, //编辑对话框显示与隐藏
      addRules: {
        attr_name: [{ required: true, message: `请输入参数`, trigger: 'blur' }],
      }, //  表单规则
      addForm: {
        attr_name: '',
      },
      editForm: {
        attr_name: '',
      },
      inputVisible: false, //el-tag显示与隐藏
      inputValue: '', //文本框绑定值
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectCateKeys.length != 3) return true
      return false
    },

    //获取级联id
    cateId() {
      if ((this.selectCateKeys.length = 3)) return this.selectCateKeys[2]
    },

    //添加对话框title
    titleText() {
      if (this.activeName == 'many') return '动态参数'
      return '静态属性'
    },
  },
  methods: {
    //获取级联数据
    getCateList() {
      getCategories().then((res) => {
        if (res.meta.status != 200) return this.$message.error('获取级联数据失败')
        this.cateList = res.data
        // console.log(this.cateList);
      })
    },

    //级联状态改变
    cateChange() {
      if (this.selectCateKeys.length != 3) {
        this.selectCateKeys = []
        this.onlyList = []
        this.manyList = []
      }
      // console.log(this.selectCateKeys);
      this.getParamsData()
    },
    //标题被点击切换时
    handleClick() {
      // console.log(this.activeName);
      this.getParamsData()
    },

    //获取参数列表
    getParamsData() {
      getParams(this.cateId, this.activeName).then((res) => {
        console.log(res)
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          ;(item.inputVisible = false), //el-tag显示与隐藏
            (item.inputValue = '') //文本框绑定值
        })
        if (res.meta.status != 200) return this.$message.error('获取参数失败')
        if (this.activeName == 'many') return (this.manyList = res.data)
        return (this.onlyList = res.data)
      })
    },
    //添加对话框
    addDialog() {
      this.addDialogVisible = true
    },

    //关闭添加对话框
    dialogClose() {
      this.$refs.addForm.resetFields()
    },

    //关闭编辑对话框
    editDialogClose() {
      this.$refs.editForm.resetFields()
    },

    //确定添加
    addDialogEnsure() {
      this.$refs.addForm.validate((valid) => {
        if (!valid) return
        let attr = {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        }
        addParams(this.cateId, attr).then((res) => {
          if (res.meta.status != 201) return this.$message.error('添加失败')
          this.$message.success('参数添加成功')
          this.getParamsData()
          this.addDialogVisible = false
        })
      })
    },
    //打开编辑对话框
    editParams(attr_id) {
      getRowParams(this.cateId, attr_id, this.activeName).then((res) => {
        if (res.meta.status != 200) return this.$message.error('编辑查询参数失败')
        this.editForm = res.data
      })
      this.editDialogVisible = true
    },

    //确认关闭编辑对话框
    editDialogEnsure() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return
        editParams(this.cateId, this.editForm.attr_id, this.editForm.attr_name, this.activeName).then((res) => {
          if (res.meta.status != 200) return this.$message.error('修改参数失败')
          this.$message.success('修改参数成功')
          this.getParamsData()
          this.editDialogVisible = false
        })
      })
    },
    //删除参数
    deleteParams(attr_id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteParams(this.cateId, attr_id).then((res) => {
            if (res.meta.status != 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getParamsData()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    //添加vals确定实践
    handleInputConfirm(e) {
      if (e.inputValue == '') {
        e.inputVisible = false
        return
      }
      e.attr_vals.push(e.inputValue)
      e.inputValue = ''
      e.inputVisible = false
      addTagParams(this.cateId, e.attr_id, e.attr_name, e.attr_sel, e.attr_vals.join(',')).then((res) => {
        if (res.meta.status != 200) return this.$message.error('添加失败')
        this.$message.success('添加成功')
      })
    },
    //点击按钮显示input框
    showInput(e) {
      e.inputVisible = true
      //nextTick 等待页面渲染完成再执行
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //删除tag标签
    tagClose(index, row) {
      row.attr_vals.splice(index, 1)
      addTagParams(this.cateId, row.attr_id, row.attr_name, row.attr_sel, row.attr_vals.join(',')).then((res) => {
        if (res.meta.status != 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
      })
    },
  },
  created() {
    this.getCateList()
  },
  mounted() {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-card {
  margin: 10px 0;
  .row {
    margin: 10px 0;
  }
  .el-table {
    margin: 10px 0;
    .el-tag {
      margin: 10px;
    }
    .input-new-tag {
      width: 120px;
    }
  }
}
</style>
