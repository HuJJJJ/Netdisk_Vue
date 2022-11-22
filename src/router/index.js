import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import FileList from "../views/FileList"
import Test from "../views/Test2"
import found from '../views/404.vue'
import sharing from '../views/Sharing.vue'



import { BaseURL } from "../network/request";
import { get, post } from '../network/request'
import { DownLoadFile } from '../plugins/downloadUtils'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: "/FileList",
    children: [
      { path: '/FileList', component: FileList },
      { path: '/Test', component: Test },
    ]
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/sharing',
    name: 'sharing',
    component: sharing
  },
  {
    path: '/404',
    name: '404',
    component: found
  },
  {
    path: '/Test',
    name: 'Test',
    component: Test
  },

]

const router = new VueRouter({
  routes
})



//beforeEach每次进行路由跳转时都会执行
router.beforeEach(async (to, from, next) => {

  if (to.matched.length === 0) {
    var path = to.path;
    path = path.substring(1, path.length);

    var result = await post("Sharing/Check", path);
    if (result.status == 200) {
      if (result.data.success == false) { next({ path: '/404' }); } else {
        await DownLoadFile(result.data.data.Id, result.data.data.FileName);
        next({ path: '/' });
      }
    }

  } else {
    next()
  }
})


export default router
