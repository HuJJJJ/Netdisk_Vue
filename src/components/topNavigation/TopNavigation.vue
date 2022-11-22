<template>
  <div class="navBox">
    <div class="btnGroup">
      <el-upload
        class="upload-demo"
        action="#"
        name="file"
        :on-change="uploadFile"
        :show-file-list="false"
        :file-list="fileList"
        :auto-upload="false"
        ref="uploadfile"
      >
        <el-button class="uploadBtn"
          ><i class="el-icon-upload" />上传</el-button
        >
      </el-upload>
      <el-button @click="createFolder" class="btnStyle"><i class="el-icon-plus" />新建</el-button>
      <!-- <el-button class="btnStyle"
        ><i class="el-icon-edit-outline" />全选</el-button
      > -->
      <!--上传进度条-->
      <ProgressDialog
        :uploadProgressList="uploadProgressList"
        :isUploadProgressShow="isUploadProgressShow"
        :tips="tips"
      >
      </ProgressDialog>
    </div>
  </div>
</template>

<script>
import { get, post } from "../../network/request";
import { GetFileType } from "../../plugins/utils";
import SparkMD5 from "spark-md5";
import ProgressDialog from "../progressDialog/ProgressDialog.vue";
const chunkSize = 4 * 1024 * 1024; //定义分片的大小 4M
export default {
  name: "TopNavigation",
  components: {
    ProgressDialog,
  },
  data() {
    return {
      fileList: [],
      loadingFile: true,
      isUploadProgressShow: false,
      uploadProgressList: [],
      tips: "",
    };
  },
  methods: {

    //创建新文件夹
    createFolder(){
      this.$store.commit("setIsCreateFolder",true);
    },
    //分片上传
    async uploadFile(File) {
      //打开上传进度框
      this.isUploadProgressShow = true;
      this.uploadProgressList.push({
        name: File.name,
        progress: 0,
      });
      this.tips = "准备开始上传文件";

      //获取文件信息，md5，创建uuid，分析文件
      const file = File.raw;
      const fileSize = File.size;
      const chunkCount = Math.ceil(fileSize / chunkSize);
      const fileMd5 = await this.getFileMd5(file, chunkCount);
      let uuid = require("uuid").v1();

      //获取文件扩展名
      const type = File.name.substring(File.name.lastIndexOf(".") + 1);
      let extension = GetFileType(type);

      //询问服务器是否可以秒传
      var askResult = await this.AskToUpload(fileMd5, extension, File.name);
      console.log("ask" + askResult);
      //可以秒传
      if (askResult) {
        this.tips = File.name + "上传完成";
        this.updateProgress(File.name, 100);
        setTimeout(() => {
          this.isUploadProgressShow = false;
          return;
        }, 3000);
        return;
      }

      this.tips = "开始上传，请不要离开该界面噢！";
      for (let i = 0; i < chunkCount; i++) {
        //分片位置
        let start = i * chunkSize;
        //结束位置
        let end = Math.min(fileSize, start + chunkSize);
        let _chunkFile = file.slice(start, end);
        let md5 = await this.getFileMd5(_chunkFile, chunkCount);
        console.log("开始上传第" + (i + 1) + "片文件");

        //构建表单
        let formdata = new FormData();
        formdata.append("File", _chunkFile);
        formdata.append("uuid", uuid);
        formdata.append("currentChunkNumber", i + 1);
        formdata.append("md5", md5);
        formdata.append("totalChunk", chunkCount);

        //上传
        var response = await post("Upload/Shard", formdata, 1);
        if (response.status == 200) {
          if (response.data.Code == 200) {
            this.updateProgress(File.name, response.data.data);
          }
        }
      }
      this.tips = "正在校验文件...";
      console.log("传输完成，开始合并文件");

      //请求合并文件
      var newFileName = await this.mergeFile(uuid, File.name, fileMd5);

      //添加文件信息
      var addInfoResult = this.AddFileInfo(
        File.name,
        newFileName,
        fileMd5,
        extension
      );
      if (!addInfoResult) this.$message.error("上传失败");

   
      setTimeout(() => {
        this.isUploadProgressShow = false;
      }, 3000);
      return;
    },

    //更新上传进度条
    updateProgress(fileName, progress) {
      for (let i = 0; i < this.uploadProgressList.length; i++) {
        if (this.uploadProgressList[i].name == fileName) {
          this.uploadProgressList[i].progress = progress;
          this.isUploadProgressShow = true;
        }
      }
    },

  

    //合并文件
    async mergeFile(uuid, Filename, fileMd5) {
      var mergeResponse = await post("Upload/MergeFile", {
        Uuid: uuid,
        Md5: fileMd5,
        FileName: Filename,
      });
      if (mergeResponse.status == 200) {
        if (mergeResponse.data.code == 20000) {
          this.tips = Filename + "上传完成";
          return mergeResponse.data.data;
        }
      }
      return null;
    },

    //保存文件上传信息
    async AddFileInfo(fileName, newFileName, md5, extension) {
      var result = await post("File/AddFileInfo", {
        FileName: fileName,
        NewFileName: newFileName,
        FilePath: "",
        Type: extension,
        IsDelete: 0,
        UserId: this.$store.state.UID,
        MD5: md5,
      });
      if (result.data == true && result.success == true) {
        return true;
      } else return false;
    },

    //询问服务器是否有相同的文件，有则妙传，无则上传
    async AskToUpload(fileMD5, extension, filename) {
      console.log(filename);
      var result = await post("Upload/ScanFileMD5", {
        UserId: this.$store.state.UID,
        MD5: fileMD5,
        Type: extension,
        FileName: filename,
      });
      console.log(result);
      if (result.data.success == true && result.data.data == true) {
        return true;
      } else return false;
    },

    //获取md5值
    getFileMd5(file, chunkCount) {
      return new Promise((resolve, reject) => {
        let blobSlice =
          File.prototype.slice ||
          File.prototype.mozSlice ||
          File.prototype.webkitSlice;
        let chunks = chunkCount;
        let currentChunk = 0;
        let spark = new SparkMD5.ArrayBuffer();
        let fileReader = new FileReader();

        fileReader.onload = function (e) {
          spark.append(e.target.result);
          currentChunk++;
          if (currentChunk < chunks) {
            loadNext();
          } else {
            let md5 = spark.end();
            resolve(md5);
          }
        };
        fileReader.onerror = function (e) {
          reject(e);
        };
        function loadNext() {
          let start = currentChunk * chunkSize;
          let end = start + chunkSize;
          if (end > file.size) {
            end = file.size;
          }
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext();
      });
    },
  },
  created() {},
};
</script>


<style scoped>
.el-notification.left {
  top: 15% !important;
  left: 45% !important;
  /* transform: translate(-50%, -50%) !important; */
}

.close_notify {
  color: #fff;
  cursor: pointer;
  width: 60px;
  height: 30px;
  line-height: 30px;
  background: rgb(64, 158, 255);
  text-align: center;
  position: absolute;
  bottom: 20px;
  right: 30px;
}

.navBox {
  width: 100%;
  height: 150%;
}
.btnGroup {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center; /*水平居中*/
   align-items: center;/*垂直居中 */
}
.btnStyle{
  margin-left: 15px;
}
.btnStyle:hover {
  background-color: rgb(133, 158, 247);
  background-color: rgb(133, 158, 247);
  border: 1px solid rgb(133, 158, 247);
  color: white;
}
.btnStyle:focus {
  color: black;
  background-color: white;
  border: 1px solid black;
}
.uploadBtn {
  background-color: rgb(133, 158, 247);
  border: 1px solid rgb(133, 158, 247);
  color: white;
}
.uploadBtn:hover {
  background-color: rgb(89, 91, 179);
  border: 1px solid rgb(89, 91, 179);
  color: white;
}
.uploadBtn:focus {
  background-color: rgb(89, 91, 179);
  border: 1px solid rgb(89, 91, 179);
  color: white;
}
</style>