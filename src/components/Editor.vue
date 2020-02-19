<template>
  <div>
    <el-row>
      <el-col :span="3" :offset="2">
        <div>标题：</div>
      </el-col>
      <el-col :span="19">
        <el-input v-model="titleInput" placeholder="请输入标题" ref="title"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3" :offset="2">
        <div>副标题：</div>
      </el-col>
      <el-col :span="19">
        <el-input v-model="subTitleInput" placeholder="请输入副标题" ref="subTitle"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3" :offset="2">
        <div>作者：</div>
      </el-col>
      <el-col :span="19">
        <el-input v-model="authorInput" placeholder="请输入作者" ref="author"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>
          <div class="toolbar" ref="toolbar"></div>
          <div class="editor" ref="editor"></div>
        </div>
      </el-col>
    </el-row>

    <!-- <button v-on:click="showContent">查看内容</button> -->
  </div>
</template>

<script>
import E from "wangeditor";
const conf = require("../config.js");

export default {
  name: "editor",
  data() {
    return {
      editorContent: "",
      editor: "",
      titleInput:"",
      subTitleInput:"",
      authorInput:"",
      contentObj:{},
    };
  },
  computed: {
    toSave() {
      return this.$store.state.downloading;
    },
    areaID() {
      return this.$store.state.areaID;
    },
    clearArea() {
      return this.$store.state.editorClear;
    }
  },
  watch: {
    toSave() {
      this.getContent();
    },
    areaID() {
      this.loadPaper();
    },
    clearArea() {
      this.titleInput= "",
      this.subTitleInput= "",
      this.authorInput= "",
      this.editor.txt.clear();
    }
  },
  methods: {
    showContent:function(){
      // console.log(this.editor.txt.text());
    },
    getContent: function() {
      // alert(this.editorContent);
      if(!this.titleInput){
        this.$message.error("请填写标题！");
      }
      if(!this.authorInput){
        this.$message.error("请填写作者！");
      }
      this.contentObj= {
        title:this.titleInput,
        subTitle:this.subTitleInput,
        author:this.authorInput,
        editorContent:this.editorContent,
      };
      // console.log(this.editorContent);
      this.$store.dispatch("saveAction", this.contentObj);
    },
    loadPaper() {
      this.titleInput= "",
      this.authorInput= "",
      this.editor.txt.clear();
      this.$http
        .get(`${conf.link}/api/loadarea/${this.areaID}`) // 将信息发送给后端
        .then(
          res => {
            // axios返回的数据都在res.data里
            console.log(res);
            if (res.status == 200) {
              // console.log(res.data.data[0].content);
              this.titleInput = res.data.data[0].title;
              this.authorInput= res.data.data[0].author;
              this.subTitleInput = res.data.data[0].subTitle;
              this.editor.txt.html(res.data.data[0].content);
            } else {
              this.$message.error("请求错误！"); // 登录失败，显示提示语
            }
          },
          err => {
            this.$message.error("请求错误！");
          }
        );
    }
  },
  mounted() {
    var editor = new E(this.$refs.toolbar, this.$refs.editor);
    editor.customConfig.onchange = html => {
      this.editorContent = html;
    };
    editor.customConfig.uploadImgServer = conf.potoUploadPath;
    editor.customConfig.uploadFileName = "file";
    editor.customConfig.uploadImgMaxLength = 1;
    editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;
    editor.customConfig.uploadImgHeaders = {
      Accept: "*/*",
      Authorization: "Bearer " + sessionStorage.getItem("demo-token") //头部token
    };
    editor.customConfig.menus = [
      //菜单配置
      "head",
      "list", // 列表
      "justify", // 对齐方式
      "bold",
      "fontSize", // 字号
      "italic",
      "underline",
      "image", // 插入图片
      "foreColor", // 文字颜色
      "undo", // 撤销
      "redo" // 重复
    ];
    //下面是最重要的的方法
    editor.customConfig.uploadImgHooks = {
      before: function(xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
      },
      success: function(xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        this.imgUrl = Object.values(result.data).toString();
      },
      fail: function(xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function(xhr, editor) {
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      timeout: function(xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },

      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function(insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：

        // let url = Object.values(result.data); //result.data就是服务器返回的图片名字和链接

        result.data[0] = `${conf.link}/${result.data[0]}`;
        // console.log(JSON.stringify(result));
        insertImg(result.data[0]);
      }
    };
    editor.create();
    this.editor = editor;
  }
};
</script>

<style scoped>
.editor {
  border: 1px solid #ccc;
  text-align: left;
  height: 480px;
  width: 600px;
  margin-left: 3em;
}
.toolbar {
  border: 1px solid #ccc;
  margin-left: 3em;
  width: 600px;
}
.el-row {
    margin-bottom: 5px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>