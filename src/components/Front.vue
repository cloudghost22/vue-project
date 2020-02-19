
<template>
  <el-container>
    <el-header style="height:100px;">
      <h1>电子京烟报</h1>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="9" :offset="2">
          <component :is="leftArea"></component>
        </el-col>
        <el-col :span="11" :offset="1">
          <div ref="paperInfo">
            <component :is="currentComponent" :paper="paper"></component>
          </div>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>上海烟草集团北京卷烟厂</el-footer>
  </el-container>
</template>

<script>
const conf = require("../config.js");
import Paper from "./Paper";
import PaperShow from "./PaperShow";

export default {
  data() {
    return {
      rawHtml: "",
      mapShow: false,
      paperList: [],
      currentComponent: "",
      paper: {},
      pressID: "",
      pressNoValue: "",
      preButtonDis: true,
      nextButtonDis: false,
      leftArea: "my-papershow"
    };
  },
  components: {
    "my-paper": Paper,
    "my-papershow": PaperShow
  },
  computed: {
    getPaperShow() {
      return this.$store.state.paperShow;
    }
  },
  watch: {
    getPaperShow() {
      this.currentComponent = "my-paper";
      this.paper = this.$store.state.paperShow;
    }
  },
  methods: {
    nextPressNo() {
      this.getPress(this.pressID, ++this.pressNoValue);
      if (this.pressNoValue == 4) {
        this.nextButtonDis = true;
      } else {
        this.nextButtonDis = false;
      }
    },
    prePressNo() {
      this.getPress(this.pressID, --this.pressNoValue);
      if (this.pressNoValue == 1) {
        this.preButtonDis = true;
      } else {
        this.preButtonDis = false;
      }
    },
    handlePressNo(val) {
      this.getPress(this.pressID, val);
    },
    paperMouserEnter(val) {
      let temp = this.$refs[val];
      temp[0].style.border = "1px solid #F00";
    },
    paperMouserLeave(val) {
      let temp = this.$refs[val];
      temp[0].style.border = "0px";
    },
    paperClick(val) {
      // console.log(val);

      this.$http
        .post(`${conf.link}/api/showpaper/papercount`, { paperID: val.id })
        .then(
          res => {
            // console.log(res);
            if (res.status == 200) {
            } else {
              this.$message.error("请求失败");
            }
          },
          err => {
            this.$message.error("请求失败");
            // console.log(err)
          }
        );

      this.currentComponent = "my-paper";
      this.paper = val;
    },
    getPress(pressID = 0, pressNoValue = 1) {
      if (pressNoValue > 4 || pressNoValue < 1) {
        return;
      }
      let link = ``;
      if (pressID) {
        link = `${
          conf.link
        }/api/showpress/${pressID}?pressNoValue=${pressNoValue}`;
      } else {
        link = `${conf.link}/api/showpress/`;
      }
      this.$http.get(link).then(
        res => {
          if (res.status == 200) {
            // console.log(res.data);
            let imgLink = res.data.data[0][0].path;
            this.$refs.field.style.backgroundImage = `url(${
              conf.link
            }/${imgLink})`;
            this.$refs.field.style.backgroundSize = "406px 580px";
            this.$refs.field.style.backgroundPosition = "0px 0px";
            this.pressID = res.data.data[0][0].pressID;
            this.pressNoValue = res.data.data[0][0].pressNoValue;
            this.paperList = [];
            for (let a of res.data.data[1]) {
              a.width = a.endX - a.startX;
              a.height = a.endY - a.startY;
              this.paperList.push(a);
            }
          } else {
            this.$message.error("请求失败");
          }
        },
        err => {
          this.$message.error("请求失败");
          // console.log(err)
        }
      );
    }
  },
  mounted() {
    // this.getPress(0);
  }
};
</script>

<style lang="stylus" scoped>
.el-header, .el-footer {
  background-color: #B2DFEE;
  color: #333;
  text-align: center;
}

.el-header{
  // background-image:url(../assets/header.jpg);
  // opacity:0.7;
}

.el-footer {
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.bg-purple {
  background: #d3dce6;
}

.field {
  width: 406px;
  height: 580px;
  background-repeat: no-repeat;
  background-size: auto;
  position: relative;
}

.field div {
  position: absolute;
  color: red;
}

.map-area {
  width: 406px;
  height: 580px;
  float: right;
}

.pressnoclass {
  width: 406px;
  float: right;
  margin-top: 1em;
}

p{
  text-align left ;
  margin-block-start 0.3em;
  margin-block-end 0.3em;
}
</style>