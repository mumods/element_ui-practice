<template>
  <div class="hello">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button @click="showAddDialog" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <treeTable :expand-type="false" show-index :selection-type="false" :data="cateList" :columns="columns" border stripe style="width: 100%; margin: 10px 0">
        <!--是否有效-->
        <template slot="isOk" slot-scope="scope">
          <i style="color: lightgreen" v-show="scope.row.cat_deleted" class="el-icon-success"></i>
          <i style="color: red" v-show="scope.row.cat_deleted === false" class="el-icon-error"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="error" v-else>三级</el-tag>
        </template>
        <template slot="operate">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </treeTable>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[6, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--添加用户对话框-->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="30%" @close="addDiagoClose">
      <el-form ref="form" :rules="addCateRules" :model="addCateForm" label-width="70px">
        <el-form-item label="分类名字" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!--props指定配置对象
           options指定加载的数据
           -->
          <el-cascader clearable v-model="selectKeys" :options="parentCateList" expandTrigger="hover" :props="cascaderProps" @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategories, addCategories } from 'network/categories'
export default {
  name: 'Categories',
  props: {},
  data() {
    return {
      addDialogVisible: false, //添加分类对话框的显示或隐藏
      cateList: [], //分类数据
      parentCateList: [],
      selectKeys: [], //级联选择器绑定的数据
      queryInfo: {
        //分类数据接口传参
        type: '3',
        pagenum: 1,
        pagesize: 6,
      },
      queryInfoDialog: {
        type: 2,
      },
      total: 0, //分类数据数量
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate',
        },
      ],
      addCateForm: {
        //添加用户数据
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
      },
      //指定casader配置对象
      cascaderProps: {
        value: 'cat_id', //选定的值 比如id
        label: 'cat_name', //显示的数据
        children: 'children', //父子之前是通过什么对象名来嵌套的
      },
    }
  },
  methods: {
    //获取分类数据
    getCate() {
      getCategories(this.queryInfo).then((res) => {
        if (res.meta.status != 200) return this.$message.error('获取分裂数据失败')
        // console.log(res);
        this.cateList = res.data.result
        this.total = res.data.total
      })
    },

    //修改一个页面显示数量
    handleSizeChange(e) {
      this.queryInfo.pagesize = e
      this.getCate()
    },
    //修改当前页
    handleCurrentChange(e) {
      this.queryInfo.pagenum = e
      this.getCate()
    },

    //显示添加对话框
    showAddDialog() {
      this.addDialogVisible = true
      getCategories(this.queryInfoDialog).then((res) => {
        if (res.meta.status != 200) return this.$message.error('获取分类失败')
        this.parentCateList = res.data
        console.log(this.parentCateList)
      })
    },
    //关闭添加分裂对话框时
    addDiagoClose() {
      this.selectKeys = []
      this.$refs.form.resetFields()
      this.addCateForm = {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      }
    },
    //级联发生选择的触发函数
    parentCateChange() {
      // console.log(this.selectKeys)
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    //确认添加
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.form.validate((valid) => {
        if (!valid) return
        addCategories(this.addCateForm).then((res) => {
          if (res.meta.status != 201) return this.$message.error('添加失败')
          console.log(res)
          this.getCate()
          this.addDialogVisible = false
        })
      })
    },
  },
  created() {
    this.getCate()
  },
  mounted() {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-card {
  margin: 10px 0;
}
.el-cascader {
  width: 100%;
}
</style>
