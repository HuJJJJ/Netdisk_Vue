<template>
  <div class="AsideBar">
    <div
      class="barItem"
      :class="selectIndex == index ? 'select' : ''"
      v-for="(item, index) in asideBarData"
      :key="index"
      @click="clickAsideBarItem(index)"
    >
      <i class="iconfont" :class="'icon-' + item.icon"></i>
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "AsideBar",
  data() {
    return {
      selectIndex: 0,
      asideBarData: [
        {
          path: "/FileList",
          name: "文件",
          icon: "wenjian",
          type: 0,
        },
        { path: "/FileList", name: "相册", icon: "xiangce1", type: 1 },
        { path: "/FileList", name: "文档", icon: "xiangce1", type: 2 },
        { path: "/FileList", name: "视频", icon: "xiangce1", type: 3 },
        { path: "/FileList", name: "音频", icon: "xiangce1", type: 4 },
        { path: "/FileList", name: "压缩包", icon: "xiangce1", type: 5 },
        { path: "/FileList", name: "其他", icon: "xiangce1", type: 6 },
        // { path: "/Test", name: "收藏夹", icon: "favorite" },
      ],
      downloadFileInfo: {
        name: "",
        url: "",
      },
    };
  },

  methods: {
    clickAsideBarItem(index) {
     this.selectIndex=index;
      this.$store.commit("setFileListShowType", index);
      if (this.$route.path != this.asideBarData[index].path) {
        this.$router.push(this.asideBarData[index].path);
      }
    },
  },
  watch: {
    //   监听vuex中的当前所在目录
  },
  created() {},
};
</script>

<style scoped>
i {
  font-size: 24px;
  margin-right: 10px;
}

.barItem {
  display: flex;
  align-items: center;
  margin: 0 10px;
  padding: 10px 15px;
  border-radius: 13px;
  cursor: pointer;
}

.barItem:hover {
  background-color: #ececee;
}

.select {
  background-color: rgb(231, 231, 231) !important;
}

.icon-close {
  position: absolute;
  font-size: 30px;
  top: 20px;
  left: 30px;
  color: #25262b;
}
</style>
