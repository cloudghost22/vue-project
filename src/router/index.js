import Vue from 'vue'
import VueRouter from 'vue-router';
import Login from '../components/Login';
import TodoList from '../components/TodoList';
import Background from '../components/BackGround';
import Upload from '../components/Upload'
import UploadList from '../components/UploadList';
import Edit from '../components/diagram';
import Front from '../components/Front';
import EditPress from '../components/EditPress'
import Magazine from '../components/Magazine'


VueRouter.prototype.goBack = function () {
  this.isBack = true;
  window.history.go(-1)
};
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      // component: Front
      component: Magazine
    },
    {
      path: '/magazine',
      component: Magazine
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/todolist',
      component: TodoList
    },
    {
      path: '/background',
      component: Background
    },
    {
      path: '/upload',
      component: Upload
    },
    {
      path: '/uploadlist',
      component: UploadList
    },
    {
      path: '/edit',
      component: Edit
    },
    {
      path: '/editpress',
      component: EditPress
    },
    {
      path: '*',
      // redirect: '/'
      redirect: '/magazine'
    }
  ]
});



router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('demo-token');
  if (to.path == '/' || to.path == '/login'|| to.path == '/magazine') { // 如果是跳转到登录页的
    if (token != 'null' && token != null) {
      next('/background') // 如果有token就转向background不返回登录页
    }
    next(); // 否则跳转回登录页
  } else {
    if (token != 'null' && token != null) {
      Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token; // 全局设定header的token验证，注意Bearer后有个空格
      next();
    } else {
      next('/');
    }
  }
})

export default router;

