<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-steps :space="200" align-center :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form label-position="top" :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="addForm">
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                expandTrigger="hover"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="site" v-for="(site, i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="url"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="header"
              :on-success="handleSuccsess"
            >
              <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4"> </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="查看图片" :visible.sync="dialogVisible" width="50%" @close="handleClose">
      <img ref="imgUrl" :src="imgUrl" alt="" class="preview" />
    </el-dialog>
  </div>
</template>

<script>
import { getCategories } from 'network/categories'
import { trendsParams } from 'network/goods'
export default {
  name: 'GoodsAdd',
  props: {},
  data() {
    return {
      fileList: [],
      dialogVisible: false,
      url: 'https://lianghj.top:8888/api/private/v1/upload',
      activeIndex: '0',
      cateList: [],
      manyTableData: [], //动态参数数据
      onlyTableData: [], //静态参数数据
      addForm: {
        goods_name: '',
        goods_cat: [], //商品所属的分类数组
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [], //上传图片信息
        attrs: '',
      },
      addRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入商品分类', trigger: 'blur' }],
      },
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      header: {
        Authorization: sessionStorage.getItem('token'),
      },
      imgUrl: '',
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) return this.addForm.goods_cat[2]
      return ''
    },
  },
  methods: {
    getCate() {
      getCategories().then((res) => {
        if (res.meta.status != 200) return this.$message.error('获取失败')
        // console.log(res)
        this.cateList = res.data
      })
    },
    //级联发生变化执行的函数
    handleChange() {
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeLeave() {
      if (this.activeIndex == '0' && this.addForm.goods_cat.length != 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    //tab切换执行
    tabClick() {
      if (this.activeIndex == '1') {
        trendsParams(this.cateId, 'many').then((res) => {
          // console.log(res);
          if (res.meta.status != 200) return this.$message.error('获取动态参数失败')
          let patt = /.+,.+/
          let patt1 = /.+\s.+/
          res.data.forEach((item) => {
            if (patt.test(item.attr_vals)) {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            } else if (patt1.test(item.attr_vals)) {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            }
          })
          this.manyTableData = res.data
          // console.log(res);
        })
      } else if (this.activeIndex == '2') {
        trendsParams(this.cateId, 'only').then((res) => {
          console.log(res)
          if (res.meta.status != 200) return this.$message.error('获取静态参数失败')
          this.onlyTableData = res.data
        })
      }
    },
    //放大图片
    handlePreview(e) {
      this.imgUrl = e.response.data.url
      this.dialogVisible = true
    },
    //移除图片
    handleRemove(e) {
      console.log(e)
      let path = e.response.data.tmp_path
      let i = this.addForm.pics.findIndex((item) => {
        item.pic === path
      })
      this.addForm.pics.splice(i, 1)
      this.$message.success('移除成功')
    },
    //上传成功执行函数
    handleSuccsess(e) {
      console.log(e)
      let picInfo = { pic: e.data.tmp_path }
      this.addForm.pics = [...this.addForm.pics, picInfo]
      console.log(this.addForm)
    },
    handleClose() {
      this.$refs.imgUrl.src = ''
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
  .el-steps {
    margin: 10px 0;
  }
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }
}
.preview {
  width: 100%;
}
</style>
