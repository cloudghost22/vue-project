<template>
  <el-row class="content">
    <el-col span="8" offset="16"><el-button plain @click="logout">登出</el-button></el-col>
    <el-col :xs="{span:20,offset:2}" :sm="{span:8,offset:8}">
      <span>
        欢迎：{{name}}！你的待办事项是：
      </span>
      <el-input placeholder="请输入待办事项" v-model="todos" @keyup.enter.native="addTodos"></el-input>
      <el-tabs v-model="activeName">
        <el-tab-pane label="待办事项" name="first">
          <el-col :xs="24">
            <template v-if="!Done"> <!--v-if和v-for不能同时在一个元素内使用，因为Vue总会先执行v-for-->
              <template v-for="(item, index) in list">
                <div class="todo-list" v-if="item.status == 'false'" :key="index">
                  <span class="item">
                    {{ index + 1 }}. {{ item.content }}
                  </span>
                  <span class="pull-right">
                    <el-button size="small" type="primary" @click="update(index)">完成</el-button>
                    <el-button size="small" :plain="true" type="danger" @click="remove(index)">删除</el-button>
                  </span>
                </div>
              </template> 
            </template>
            <div v-else-if="Done">
              暂无待办事项
            </div>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="已完成事项" name="second">
          <template v-if="count > 0">
            <template v-for="(item, index) in list" >
              <div class="todo-list" v-if="item.status == 'true'" :key="index">

                <span class="item finished">
                  {{ index + 1 }}. {{ item.content }}
                </span>
                <span class="pull-right">
                  <el-button size="small" type="primary" @click="update(index)">还原</el-button>
                </span>
              </div>
            </template> 
          </template>
          <div v-else>
            暂无已完成事项
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import jwt from 'jsonwebtoken';
const conf = require('../config.js');

export default {
  created:function(){
    const userInfo = this.getUserInfo(); // 新增一个获取用户信息的方法
    if(userInfo != null){
      this.id = userInfo.id;
      this.name = userInfo.name;
    }else{
      this.id = '';
      this.name = ''
    }
    this.getTodolist(); // 新增：在组件创建时获取todolist
  },
  data () {
    return {
      name: '',
      id:'',
      todos: '',
      activeName: 'first',
      list:[],
      count: 0
    };
  },
  computed: { // 计算属性用于计算是否已经完成了所有任务
    Done(){
      let count = 0;
      let length = this.list.length;
      for(let i in this.list){
        this.list[i].status == 'true' ? count += 1 : '';
      }
      // this.count = count;
      this.updateCount(count);
      if(count == length || length == 0){
        return true
      }else{
        return false
      }
    }
  },

  methods: {
    logout(){
      this.$message.error("已退出"); 
      sessionStorage.setItem("demo-token", null); // 将token清空
      this.$router.push("/");
    },
    updateCount(val){
      this.count = val;
    },
    addTodos() {
      if(this.todos == '')
        return
      let obj = {
        status: false,
        content: this.todos,
        user_id:this.id
      }

      this.$http.post(`${conf.link}/api/todolist`, obj) // 新增创建请求
      .then((res) => {
        if(res.status == 200){ // 当返回的状态为200成功时
          this.$message({
            type: 'success',
            message: '创建成功！' 
          })
          this.getTodolist(); // 获得最新的todolist
        }else{
          this.$message.error('创建失败！') // 当返回不是200说明处理出问题
        }
      }, (err) => {
        this.$message.error('创建失败！') // 当没有返回值说明服务端错误或者请求没发送出去
        // console.log(err)
      })
    this.todos = ''; // 将当前todos清空
    },
    remove(index) {
      this.$http.delete(`${conf.link}/api/todolist/${this.id}/${this.list[index].id}`)
      .then((res) => {
          if(res.status == 200){
            this.$message({
              type: 'success',
              message: '任务删除成功！'
            })
            this.getTodolist();
          }else{
            this.$message.error('任务删除失败！')
          }
        }, (err) => {
          this.$message.error('任务删除失败！')
          // console.log(err)
        })
    },
    update(index) {
      this.$http.put(`${conf.link}/api/todolist/${this.id}/${this.list[index].id}/${this.list[index].status=='true'?1:0}`)
        .then((res) => {
          if(res.status == 200){
            this.$message({
              type: 'success',
              message: '任务状态更新成功！'
            })
            this.getTodolist();
          }else{
            this.$message.error('任务状态更新失败！')
          }
        }, (err) => {
          this.$message.error('任务状态更新失败！')
          console.log(err)
        })
    },
    getUserInfo(){ // 获取用户信息
      const token = sessionStorage.getItem('demo-token');
      if(token != null && token != 'null'){
        let decode = jwt.decode(token); // 解析token
        // console.log(decode);
        return decode // decode解析出来实际上就是{name: XXX,id: XXX}
      }else {
        return null
      }
    },
    getTodolist(){
    this.$http.get(`${conf.link}/api/todolist/${this.id}`) // 向后端发送获取todolist的请求
      .then((res) => {
        // console.log(res);
        if(res.status == 200){
          this.list = res.data // 将获取的信息塞入实例里的list
        }else{
          this.$message.error('获取列表失败！')
        }
      }, (err) => {
        this.$message.error('获取列表失败！')
        // console.log(err)
      })
  }
  }
};
</script>

<style lang="stylus" scoped>
  .el-input
    margin 20px auto
  .todo-list
    width 100%
    margin-top 8px
    padding-bottom 8px
    border-bottom 1px solid #eee
    overflow hidden
    text-align left
    .item
      font-size 20px
      &.finished
        text-decoration line-through
        color #ddd
  .pull-right
    float right
</style>