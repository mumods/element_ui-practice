<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar">
        <img src="~assets/logo.png" alt="" />
      </div>
      <el-form
        ref="loginReset"
        :rules="loginRules"
        label-width="80px"
        class="loginForm"
        :model="loginForm"
      ><!--
        rules定义验证规则
        label-width文本框头部文字占用长度
        :model绑定数据，子元素v-model绑定详细数据
         -->
        <el-form-item label="用户名：" prop="username">
          <!--prop表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的-->
          <el-input
            clearable
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            clearable
            show-password
            v-model="loginForm.password"
            placeholder="请输入密码"
          >
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            <!--前侧使用类添加图标-->
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "../network/login.js";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //重置文本框
    reset() {
      this.$refs.loginReset.resetFields();
      //resetFields重置对应节点文本框的数据
    },

    //登录
    login() {
      this.$refs.loginReset.validate((valid) => {
        //valid判断输入的值是否符合rules规则，validate是rules校验的回调函数
        if (!valid) return;
        login(this.loginForm).then((res) => {
          if (res.meta.status != 200) {
            this.$message({
              message: "登录失败",
              type: "error",
            });
          } else {
            this.$message.success("登录成功");
            console.log(res);
            sessionStorage.setItem("token", res.data.token);
            this.$router.push("/home");
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login {
  height: 100%;
  background-color: #2b4b6b;
  .login_box {
    width: 450px;
    height: 300px;
    border-radius: 10px;
    background-color: #fff;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 1px solid #eee;
      box-shadow: 0 0 5px #fff;
      padding: 5px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        border-radius: 50%;
        background-color: #eee;
        width: 100%;
        height: 100%;
      }
    }
    .loginForm {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
