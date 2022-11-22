<template>
  <div style="width: 100%; height: 100%">
    <div style="padding-top: 20px">
      <div style="width: 95%; height: 40px; margin: 0 auto">
        <div
          v-if="currenFolder.id != 0 && this.fileListType == 0"
          style="float: left"
        >
          <el-button
            @click="backUpOneLevel"
            type="text"
            style="color: rgb(133, 158, 247)"
            >返回上一级&ensp;</el-button
          >|
        </div>
        <div
          v-if="currenFolder.id != 0 && this.fileListType == 0"
          style="float: left"
        >
          <el-button
            @click="backRoot"
            type="text"
            style="color: rgb(133, 158, 247)"
            >&ensp;返回根目录</el-button
          >
        </div>
      </div>
      <el-row :gutter="10">
        <!--文件夹-->
        <el-col v-for="(item, index) in folderList" :key="index" :span="3">
          <div
            @dblclick="showFolder(index)"
            @dragstart="dragFolder($event, item)"
            @drop="drop($event, item)"
            @dragover="allowDrop($event)"
            class="lightgreen-box"
            @contextmenu.prevent="onfolderContextmenu($event, index)"
          >
            <div class="outer">
              <div class="inner">
                <img
                  width="100px"
                  height="100PX"
                  src="../assets/img/folder.png"
                />
                <el-tooltip
                  :content="item.FolderName"
                  placement="bottom-end"
                  effect="light"
                >
                  <div v-if="!item.IsRename">
                    {{ item.FolderName }}
                  </div>
                  <div v-if="item.IsRename">
                    <input
                      @blur="blur"
                      autofocus
                      @change="foldeRename"
                      class="renameInput"
                      v-model="item.newName"
                      style="width: 70%; margin: 0 auto"
                      type="text"
                    />
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-col>
        <!--文件-->
        <el-col v-for="(item, index) in fileList" :key="index" :span="3">
          <div
            draggable="true"
            @dragstart="drag($event, item)"
            @dblclick="showFile(index)"
            class="lightgreen-box"
            @contextmenu.prevent="onContextmenu($event, index)"
          >
            <div class="outer">
              <div class="inner">
                <img width="100px" height="100PX" :src="item.imgSrc" />
                <el-tooltip
                  :content="item.FileName"
                  placement="bottom-end"
                  effect="light"
                >
                  <div v-if="!item.IsRename">
                    {{ item.shortName }}
                  </div>
                  <div v-if="item.IsRename">
                    <input
                      @blur="blur"
                      autofocus
                      @change="fileRename"
                      class="renameInput"
                      v-model="item.newName"
                      style="width: 70%; margin: 0 auto"
                      type="text"
                    />
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--移动文件到指定文件夹-->
    <div>
      <el-dialog
        width="30%"
        title="选择文件夹"
        :visible.sync="FolderTreeDialogIsShow"
        append-to-body
      >
        <el-tree
          :data="FolderTree"
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => move(node, data)"
              >
                移动
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-dialog>
    </div>

    <!--生成分享码dialog-->
    <div>
      <el-dialog
        center
        width="280px"
        title="生成分享码"
        :visible.sync="dialogTableVisible"
      >
        <div class="dialogMain">
          <el-date-picker
            v-model="sharingCodeGivenPeriod"
            type="date"
            placeholder="选择共享文件过期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div>
        <div class="dialogFooter">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button
            type="primary"
            :icon="sharingLoading ? 'el-icon-loading' : ''"
            @click="generateSharing"
          >
            生 成</el-button
          >
        </div>
        <el-dialog
          width="30%"
          title="分享码"
          :visible.sync="innerVisible"
          append-to-body
        >
          <el-input type="text" v-model="SharingCode" />
        </el-dialog>
      </el-dialog>
    </div>
    <!--截图-->
    <div style="display: none">
      <video crossOrigin="Anonymous" controls style="width: 300px"></video>
      <canvas id="myCanvas" width="343" height="200"></canvas>
    </div>
    <!--图片播放器-->
    <ImagePlayer
      @closeDialog="closeImagePlayer"
      :currentImg="imgplayer"
      :isImgDialogShow="isImgDialogShow"
    ></ImagePlayer>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { get, post } from "../network/request";
import { BaseURL } from "../network/request";
import { DownLoadFile } from "../plugins/downloadUtils";
import { handleLongString, getImgSrc } from "../plugins/utils";
import ImagePlayer from "../components/imagePlayer/ImagePlayer.vue";
export default {
  components: {
    ImagePlayer,
  },
  data() {
    return {
      SharingCode: "",
      sharingLoading: false,
      //分享码dialog
      dialogTableVisible: false,
      innerVisible: false,
      sharingCodeGivenPeriod: "",
      currentFileIndex: 0,
      //图片播放器对象
      imgplayer: {
        name: "",
        url: "",
      },
      //是否打开图片播放器
      isImgDialogShow: false,

      //侧边栏
      asideBarData: [
        {
          path: "/files",
          name: "文件",
          icon: "wenjian",
          componentName: "files",
          params: { path: "/root" },
        },
        { path: "/albums", name: "相册", icon: "xiangce1" },
        { path: "/collectes", name: "收藏夹", icon: "favorite" },
      ],
      fileListType: 0,
      fileList: [],
      folderList: [],
      //currentFolderId: 0,
      //当前所在的目录
      currenFolder: {},
      //当前被移动的文件
      currentMoveObject: {},
      //树形结构
      FolderTreeDialogIsShow: false,
      FolderTree: [],
      defaultProps: {
        children: "children",
        label: "lable",
      },
    };
  },
  methods: {
    //返回上一级目录
    async backUpOneLevel() {
      this.GetFolderInFolder(this.currenFolder.parentId);
      //获取当前文件夹的文件列表
      this.GetFileListByFolder(this.currenFolder.parentId);

      //假如父路径是根路径
      if (0 != this.currenFolder.parentId) {
        this.currenFolder = await this.GetFolderById();
        console.log(this.currenFolder);
      } else {
        this.currenFolder = { id: 0, parentId: 0 };
      }
    },

    //返回root目录
    backRoot() {
      this.GetFolderInFolder(0);
      //获取当前文件夹的文件列表
      this.GetFileListByFolder(0);
      this.currenFolder.id = 0;
    },

    //树形结构点击事件
    handleNodeClick(data) {},
    //点击树形结构移动文件回调
    async move(node, folder) {
      await this.moveFile(folder);
      await this.GetFileListByFolder(this.currentMoveObject.folderId);
      this.FolderTreeDialogIsShow = false;
    },

    //拖拽文件夹
    dragFolder(ev, item) {
      this.currentMoveObject = item;
    },

    //拖拽文件
    drag(ev, item) {
      console.log("拖动", item);
      this.currentMoveObject = item;
    },
    // 允许放下拖拽
    allowDrop(ev) {
      ev.preventDefault();
    },
    // 放下文件事件
    async drop(ev, item) {
      console.log("放下", item);
      ev.preventDefault();
      console.log();
      if (this.currentMoveObject.FolderName != undefined) {
        console.log("移动文件夹");
      } else {
        console.log("移动文件");
        await this.moveFile(item);
        this.GetFileListByFolder(item.parentId);
      }
    },

    //移动文件
    async moveFile(folder) {
      var result = await post("File/Move", {
        FileId: this.currentMoveObject.Id,
        NewFolderId: folder.id,
      });
      if (result.status == 200) {
        if (result.data.success == true) {
          this.$message.success("移动成功");
        }
      }
    },

    //请求后端生成分享码
    async generateSharing() {
      this.sharingLoading = true;
      var result = await post("Sharing/Add", {
        FileId: this.fileList[this.currentFileIndex].Id,
        GivenPeriod: this.sharingCodeGivenPeriod,
        UserName: this.$store.state.nickname,
      });

      if (result.status == 200) {
        if (result.data.data > 0) {
          this.SharingCode = result.data.sharingCode;
          // this.$router.push(this.$route.path+"/"+ this.SharingCode);
        }
      }
      this.sharingLoading = false;
      this.innerVisible = true;
    },
    //打开分享码dialog
    generateSharingCodeDialog(i) {
      this.currentFileIndex = i;
      this.dialogTableVisible = true;
    },

    //关闭图片查看器回调
    closeImagePlayer() {
      this.imgplayer = {};
      this.isImgDialogShow = false;
    },

    //右键文件夹菜单
    onfolderContextmenu(event, i) {
      let menu = {
        items: [
          {
            label: "重命名",
            disabled: false,
            onClick: () => {
              this.showfolderInput(i);
            },
          },
          {
            label: "删除文件夹",
            onClick: () => {
              this.DeleteFile(i);
            },
          },
          //   children: [{ label: "删除文件" }, { label: "重命名" }]
        ],
        event, // 鼠标事件信息
        customClass: "custom-class", // 自定义菜单 class
        zIndex: 3, // 菜单样式 z-index
        minWidth: 230, // 主菜单最小宽度
        renameIndex: 0,
      };
      this.$contextmenu(menu);
      return false;
    },

    //文件列表右键菜单
    onContextmenu(event, i) {
      let menu = {
        items: [
          {
            label: "下载文件",
            onClick: () => {
              this.DownLoad(i);
            },
          },
          {
            label: "重命名",
            disabled: false,
            onClick: () => {
              this.showInput(i);
            },
          },

          {
            label: "查看文件",
            onClick: () => {
              this.showFile(i);
            },
          },

          {
            label: "移动",
            onClick: () => {
              this.currentMoveObject = this.fileList[i];
              this.FolderTreeDialogIsShow = true;
            },
          },

          {
            label: "分享",
            onClick: () => {
              this.generateSharingCodeDialog(i);
            },
          },
          {
            label: "删除文件",
            onClick: () => {
              this.DeleteFile(i);
            },
          },
          //   children: [{ label: "删除文件" }, { label: "重命名" }]
        ],
        event, // 鼠标事件信息
        customClass: "custom-class", // 自定义菜单 class
        zIndex: 3, // 菜单样式 z-index
        minWidth: 230, // 主菜单最小宽度
        renameIndex: 0,
      };
      this.$contextmenu(menu);
      return false;
    },

    //查看文件夹
    showFolder(i) {
      this.currenFolder = this.folderList[i];

      var folderId = this.folderList[i].Id;
      this.GetFileListByFolder(folderId);
      this.GetFolderInFolder(this.folderList[i].id);
    },

    //查看文件
    showFile(i) {
      var file = this.fileList[i];
      switch (file.Type) {
        case 1:
          this.showImagePlayer(file);
          break;
        case 3:
          this.showVideoPlayer(file);
          break;
        case 4:
          this.showMusicPlayer(file);
          break;

        default:
          this.$message.error("当前不支持查看该类型的文件");
          break;
      }
    },

    //打开音乐播放器
    showMusicPlayer(file) {
      let fileInfo = {};
      fileInfo.name = file.FileName;
      fileInfo.url = file.FilePath;
      fileInfo.duration = 0;
      this.$store.commit("setCurrentMusicInfo", fileInfo);
      this.$store.commit("setIsMusicPlayerShow", true);
      this.$store.commit("setMusicPlayState", true);
    },

    //打开视频播放器
    showVideoPlayer(file) {
      this.$store.commit("setIsVideoPlayerShow", true);
      this.$store.commit("setIsCurrentVideoInfo", {
        name: file.FileName,
        url: file.filePath,
      });
    },
    //打开图片查看器
    showImagePlayer(file) {
      this.imgplayer.name = file.FileName;
      this.imgplayer.url = file.FilePath;
      this.isImgDialogShow = true;
    },

    //获取视频封面
    getVideoCover(url, i) {
      let size = 1000;
      // 获取video节点
      const video = document.querySelector("video");
      video.width = size;
      video.height = size;
      video.currentTime = 5; // 第一帧的时间
      video.src = url;
      video.crossOrigin = "anonymous";
      //创建canvas对象
      const canvas = document.getElementById("myCanvas");
      canvas.setAttribute("crossOrigin", "Anonymous");
      canvas.width = size;
      canvas.height = size;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
      // 转换成base64形式
      const img = canvas.toDataURL("image/jpeg"); // 这个就是图片的base64
      this.fileList[i].imgSrc = img;
      this.$nextTick(() => {
        // 利用canvas对象方法绘图
      });
    },

    //重命名窗口失焦事件
    blur() {
      let temp = this.fileList[this.renameIndex];
      temp.IsRename = false;
      this.$set(this.fileList, this.renameIndex, temp);
      this.renameIndex = -1;
    },

    //修改文件名称
    async fileRename() {
      //修改重命名输入框的状态
      let temp = this.fileList[this.renameIndex];
      temp.IsRename = false;
      this.$set(this.fileList, this.renameIndex, temp);
      this.renameIndex = -1;
      if (temp.FileName == temp.newName) return;

      //修改名称
      var result = await post("File/Rename", {
        FileId: temp.Id,
        NewName: temp.newName,
      });
      if (result.status == 200) {
        if (result.data.data == true) {
          this.GetFileListByFolder(this.currenFolder.id);
        }
      }
    },

    //重命名文件夹
    async foldeRename() {
      //修改重命名输入框的状态
      let temp = this.folderList[this.renameIndex];
      temp.IsRename = false;
      this.$set(this.folderList, this.renameIndex, temp);
      this.renameIndex = -1;
      if (temp.FolderName == temp.newName) return;

      //新增文件夹
      if (temp.Id == -1) {
        var addResult = await post("Folder/Add", {
          UserId: this.$store.state.UID,
          FolderName: temp.newName,
          parentId: this.currenFolder.id,
        });
        this.GetFileListByFolder(this.currenFolder.id);
        this.GetFolderInFolder(this.currenFolder.id);
        this.$store.commit("setIsCreateFolder", false);
        return;
      }

      //修改名称
      var result = await post("Folder/Rename", {
        Id: temp.Id,
        NewName: temp.newName,
      });
      if (result.status == 200) {
        if (result.data.data == true) {
          this.GetFileListByFolder(this.currenFolder.id);
          this.GetFolderInFolder(this.currenFolder.id);
        }
      }
    },

    //显示重命名输入框
    showInput(i) {
      this.renameIndex = i;
      let temp = this.fileList[i];
      temp.IsRename = true;
      this.$set(this.fileList, i, temp);
    },

    //显示重命名输入框
    showfolderInput(i) {
      this.renameIndex = i;
      let temp = this.folderList[i];
      temp.IsRename = true;
      this.$set(this.folderList, i, temp);
    },

    // 下载文件方法
    async DownLoad(i) {
      var fileId = this.fileList[i].Id;
      const fileName = this.fileList[i].fileName;
      DownLoadFile(fileId, fileName);
    },

    //删除文件
    async DeleteFile(i) {
      let fileId = this.fileList[i].Id;
      var result = await post("File/DeleteFile", { FileId: fileId });
      this.GetFileListByFolder(this.currenFolder.id);
    },

    //获取文件列表
    async GeFileList() {
      var result = await post("File/GetFileList", {
        UserId: this.$store.state.UID,
        Type: this.fileListType,
      });
      if (result.status == 200) {
        this.fileList = result.data.data;
        this.fileListHandling();
      }
    },

    //查找文件夹中的文件
    async GetFileListByFolder(id) {
      var result = await post("File/GetFileByFolder", {
        UserId: this.$store.state.UID,
        FolderId: id,
      });
      if (result.status == 200) {
        this.fileList = result.data.data;
        this.fileListHandling();
      }
    },

    //获取文件夹中的文件夹
    async GetFolderInFolder(id) {
      var result = await post("Folder/GetFolderInFolder", {
        UserId: this.$store.state.UID,
        FolderId: id,
      });
      if (result.status == 200) {
        this.folderList = result.data.data;
      }
    },

    //根据id查找文件夹
    async GetFolderById() {
      var result = await get(
        "Folder/GetFolderById/" + this.currenFolder.parentId
      );
      if (result.status == 200) {
        return result.data.data;
      }
    },

    //获取文件夹树
    async GetFolderTree() {
      var userId = this.$store.state.UID;
      var result = await get("Folder/GetFolderTree/" + userId);
      if (result.status == 200) {
        this.FolderTree = result.data.data;
      }
    },

    //字符串过长时，处理字符串
    fileListHandling() {
      for (let i = 0; i < this.fileList.length; i++) {
        this.fileList[i].IsRename = false;
        this.fileList[i].newName = this.fileList[i].FileName;
        this.fileList[i].shortName = handleLongString(
          this.fileList[i].FileName
        );
        //获取文件扩展名
        const type = this.fileList[i].FileName.substring(
          this.fileList[i].FileName.lastIndexOf(".") + 1
        );
        if (type == "png" || type == "jpg" || type == "gif") {
          this.fileList[i].imgSrc = this.fileList[i].FilePath;
        } else if (type == "mp4") {
          this.getVideoCover(this.fileList[i].FilePath, i);
        } else {
          this.fileList[i].imgSrc = require("../assets/img/" + getImgSrc(type));
        }
      }
    },
  },
  created() {
    this.fileListType = 0;
    this.backRoot();
    //获取文件夹树
    this.GetFolderTree();
  },
  watch: {
    async "$store.state.fileListShowType"(current) {
      this.fileListType = current;
      this.folderList = {};

      if (current == 0) {
        await this.GetFolderInFolder(0);
        await this.GetFileListByFolder(0);
        console.log(this.folderList);
        return;
      }
      this.GeFileList();
    },

    "$store.state.isCreateFolder"(current) {
      console.log(current);
      if (current == true) {
        this.folderList.push({
          Id: -1,
          FolderName: "",
          parentId: this.currenFolder.id,
          userId: this.$store.state.UID,
        });
        this.showfolderInput(this.folderList.length - 1);
      }
    },
    IsRefresh: async function (current) {
      //this.GeFileList();
    },
  },
};
</script>


<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.dialogFooter {
  width: 100%;
  margin-top: 20px;
}
.renameInputShow {
  display: block;
}
.renameInputNoShow {
  display: none;
}
.renameInput:focus {
  outline-color: rgb(142, 140, 216);
}

.fileNameDiv {
  user-select: none;
}
.outer {
  width: 100%;
  height: 120px;
  display: table;
}
.inner {
  padding-top: 10px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.lightgreen-box {
  margin-top: 20px;
  height: 140px;
}
.lightgreen-box:hover {
  background-color: rgb(179, 194, 249);
}

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

li {
  list-style: none;
}
</style>

