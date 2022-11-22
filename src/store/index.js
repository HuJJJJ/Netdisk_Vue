import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function storeLocalStore(state) {
  sessionStorage.setItem("userMsg", JSON.stringify(state));
}

const store = new Vuex.Store({

  state: {

    //用户信息
    UID: '',
    token: '',
    nickname: '未登录',
    navindex: 0,
    username: '未登录',

    //音乐播放器
    isMusicPlayerShow: false,
    musicPlayState: false,
    currentMusicInfo: {},

    //视频播放器
    isVideoPlayerShow: false,
    currentVideoInfo: {},

    //用户菜单
    // isUserInfoCardMenuShow: false,

    //当前文件类型
    fileListShowType: 0,

    //是否正在创建新文件夹
    isCreateFolder: false
  },
  mutations: {
    setNickname(state, nickname) {
      state.nickname = nickname;
      storeLocalStore(state);
    },
    setToken(state, newtoken) {
      state.token = newtoken;
      storeLocalStore(state);
    },
    setUsername(state, newusername) {
      state.username = newusername;
      storeLocalStore(state);
    },
    setUID(state, UID) {
      state.UID = UID;
      storeLocalStore(state);
    },

    //视频播放器
    setIsVideoPlayerShow(state, isShow) {
      state.isVideoPlayerShow = isShow;
    },
    setIsCurrentVideoInfo(state, info) {
      state.currentVideoInfo = info;
    },
    setFileListShowType(state, type) {
      state.fileListShowType = type;
    },

    //音乐播放器
    setMusicPlayState(state, value) {
      state.musicPlayState = value;
    },
    setIsMusicPlayerShow(state, isShow) {
      state.isMusicPlayerShow = isShow;
    },
    setCurrentMusicInfo(state, info) {
      state.currentMusicInfo = info;
    },
    setIsCreateFolder(state, value) {
      state.isCreateFolder = value;
    },
    // setIsUserInfoCardMenuShow(state, value) {
    //   state.isUserInfoCardMenuShow = value;
    // }
  }

})
export default store