<template>
  <div class="hello">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getGoodsList">
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="goodsAdd" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe style="width: 100%" height="360">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量(kg)" width="120"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button @click="deleteGoods(scope.row.goods_id)" size="mini" type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoods, deleteGoods } from 'network/goods'
export default {
  name: 'Goods',
  props: {},
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      }, //接口参数
      goodsList: [],
      total: 0,
    }
  },
  methods: {
    getGoodsList() {
      getGoods(this.queryInfo).then((res) => {
        // console.log(res)
        if (res.meta.status != 200) return this.$message.error('获取商品信息失败')
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    //点击切换页面显示数量
    handleSizeChange(e) {
      this.queryInfo.pagesize = e
      this.getGoodsList()
    },
    //切换页码
    handleCurrentChange(e) {
      this.queryInfo.pagenum = e
      this.getGoodsList()
    },
    //删除操作
    deleteGoods(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteGoods(id).then((res) => {
            if (res.meta.status != 200) return this.$message.error('删除失败')
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.getGoodsList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    goodsAdd() {
      this.$router.push('/goods/add')
    },
  },
  created() {
    this.getGoodsList()
  },
  mounted() {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-card {
  margin: 10px 0;
  .el-table {
    margin: 10px 0;
  }
}
</style>
