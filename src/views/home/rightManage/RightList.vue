<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="rights"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.level == 0">权限一</el-tag>
            <el-tag type="success" v-show="scope.row.level == 1">权限二</el-tag>
            <el-tag type="warning" v-show="scope.row.level == 2">权限三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { rightList } from "network/rights.js";
export default {
  data() {
    return {
      rights: [],
    };
  },
  props: {},
  methods: {
    getRightsList() {
      rightList().then((res) => {
        if (res.meta.status != 200) return;
        this.rights = res.data;
        console.log(res.data);
      });
    },
  },
  created() {
    this.getRightsList();
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.el-card {
  margin: 10px 0;
  .el-table {
    text-align: center;
  }
}
</style>