<template>
  <div class="Index">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="240px">
        <div class="asideHeader">
          <div class="logo"><img src="../assets/img/logo.png" alt="" /></div>
          <div class="name">小破盘</div>
        </div>
        <aside-bar></aside-bar>
        <user-info-card class="userInfoCard"></user-info-card>
      </el-aside>
      <el-main>
        <div style="width: 100%; height: 10%;magrin:0 auto;">
          <top-nav></top-nav>
        </div>
        <div style="width: 100%; height: 90%">
          <router-view :key="$route.path" ref="routerView"></router-view>
        </div>
      </el-main>
    </el-container>
    <!-- 音频播放组件 -->
    <music-player></music-player>
    <VideoPlayer></VideoPlayer>

  </div>
</template>


<script>
import axios from "axios";
import AsideBar from "../components/asideBar/AsideBar.vue";
import UserInfoCard from "../components/userInfoCard/UserInfoCard.vue";
import TopNav from "../components/topNavigation/TopNavigation.vue";
import MusicPlayer from "../components/musicPlayer/MusicPlayer.vue";
import VideoPlayer from "../components/videoPlayer/VideoPlayer.vue"

export default {
  components: {
    AsideBar,
    UserInfoCard,
    TopNav,
    MusicPlayer,
    VideoPlayer,
  
  },
  name: "Home",
  data() {
    return {
    };
  },
  methods: {

  },
  created() {},
};
</script>

<style scoped>
.el-aside {
  background-color: #f5f5f6;
  height: 100vh;
}

.el-main {
  width: calc(100vw - 240px);
}

.custom-class .menu_item__available:hover,
.custom-class .menu_item_expand {
  background: #ffecf2 !important;
  color: #ff4050 !important;
}

.asideHeader {
  display: flex;
  align-items: center;
  margin: 20px;
  position: relative;
}

.asideHeader .logo {
  width: 50px;
}

.asideHeader .logo img {
  width: 100%;
}

.asideHeader .name {
  color: #25262b;
  font-size: 20px;
  letter-spacing: 4px;
  font-weight: bold;
  margin-left: 7px;
}

.userInfoCard {
  position: absolute;
  bottom: 0;
}
</style>
