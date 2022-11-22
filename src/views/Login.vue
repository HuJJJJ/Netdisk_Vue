<template>
  <div class="login">
    <div class="main">
      <div class="logoContainer">
        <div class="logo"><img src="../assets/img/logo.png" alt="" /></div>
        <div class="name">小破盘</div>
      </div>
      <div
        class="mainBox"
        :class="activeName == 'first' ? '' : 'mainBoxRegistered'"
      >
        <el-tabs
          v-model="activeName"
          type="card"
          @tab-click="handleClick"
          stretch
        >
          <el-tab-pane label="登录" name="first">
            <div class="loginInput">
              <el-form ref="form" :model="login" label-width="80px">
                <el-form-item>
                  <el-input
                    v-model="login.username"
                    placeholder="请输入账号"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="login.password"
                    type="password"
                    placeholder="请输入密码"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="注册" name="second">
            <div class="registeredInput">
              <el-form ref="form" :model="login" label-width="80px">
                <el-form-item>
                  <el-input
                    v-model="registered.username"
                    placeholder="请输入账号"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="registered.password"
                    placeholder="请输入密码"
                    type="password"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="registered.nickname"
                    placeholder="请输入昵称"
                  ></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="clickRegistered"
                    >注册</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from "../network/request";
import { get } from "../network/request";

export default {
  name: "Login",
  data() {
    return {
      login: {
        username: "",
        password: "",
      },
      registered: {
        username: "",
        password: "",
        nickname: "",
      },
      activeName: "first",
    };
  },
  methods: {
    //   点击登录的回调
    async onSubmit() {
      var result = await post(
        "Login",
        {
          UserName: this.login.username,
          Password: this.login.password,
        },
      );
      if (result.status == 200) {
        if (result.data.success == true) {
          console.log(result.data);

          this.$store.commit("setToken", result.data.token);
          this.$store.commit("setNickname", result.data.nickName);
          this.$store.commit("setUsername", result.data.userName);
          this.$store.commit("setUID", result.data.id);
          this.$router.push({name:"Home"});
        }else{
           this.$message.error("登录失败");
        }
      }else{
        this.$message.error("登录失败");
      }
    },

    // 点击注册的回调
    async clickRegistered() {
      var result = await post("Register", {
        NickName: this.registered.nickname,
        UserName: this.registered.username,
        Password: this.registered.password,
      });
     if (result.status == 200) {
        if (result.data.success == true) {
          if(result.data.data>0){
                this.$message.success("注册成功");
                return;
          }
        }else{
          this.$message.error(result.data.msg);
          return;
        }
      }
      this.$message.error("注册失败");
    },

    handleClick(e) {
      console.log(e.name);
    },
  },
};
</script>

<style scoped>

 body {
    margin: 0;
    padding: 0;
  }
.login {
  background-color: #ecefff;
  height: 100vh;
}

.logoContainer {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: center;
}

.logo {
  width: 50px;
}

.logo img {
  width: 100%;
}

.name {
  color: #25262b;
  font-size: 20px;
  letter-spacing: 4px;
  font-weight: bold;
  margin-left: 7px;
}

.main {
  width: 350px;
  height: 400px;
  position: absolute;
  right: 10vw;
  top: 15vh;
}

.mainBox {
  width: 350px;
  background-color: #fff;
  height: 330px;
  border-radius: 10px;
  overflow: hidden;
}

.mainBoxRegistered {
  height: 430px;
}

.el-form /deep/ .el-form-item__content {
  margin: 0 !important;
  padding: 0 20px;
}

.el-input /deep/ input {
  border-radius: 10px;
}

.loginInput {
  margin-top: 20px;
}

.el-tabs /deep/ .is-active,
.el-tabs /deep/ div:hover {
  color: #595bb3;
}

.el-tabs /deep/ .is-active {
  background-color: #fff;
}

.el-tabs /deep/ .el-tabs__item {
  border: none !important;
  font-size: 18px;
  height: 50px;
  line-height: 50px;
}

.el-tabs /deep/ .el-tabs__nav {
  border: none;
}

.el-tabs /deep/ .el-tabs__nav-scroll {
  background-color: #f5f5f6;
}

.el-input /deep/ .el-input__inner {
  height: 48px;
  font-size: 15px;
}

.el-button {
  width: 100%;
  background-color: #6c6dbb;
  border: none;
  border-radius: 10px;
  margin-top: 10px;
  height: 45px;
  font-size: 15px;
}

.el-button:hover {
  background-color: #595bb3;
}

.codeContainer {
  position: relative;
}

.codeButtonContainer {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
}

.getcode {
  background-color: #6c6dbb;
  color: white;
  height: 35px;
  margin: 0;
}

.countDown {
  color: rgb(141, 141, 141);
}
</style>
