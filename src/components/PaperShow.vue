
<template>
  <div>
    <el-row>
      <el-col :span="10" :offset="2">
        <div class="press-info">
          <span>
            期刊号：
            <el-dropdown :hide-on-click="false" @command="handleCommand">
              <span class="el-dropdown-link">{{pressInfoArray.NO}}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in pressNOArray"
                  :key="item.ID"
                  :command="item.pressID"
                >{{item.pressNo}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
      </el-col>
      <el-col :span="10">
        <div>
          <span>出版日期：{{pressInfoArray.pressDate}}</span>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple map-area" v-if="mapShow">
          <map name="pressMap" id="pressMap" v-html="rawHtml"></map>
          <img ref="paperImg" class="map-area" usemap="#pressMap">
          <!-- <div class="field" ref="field"></div> -->
        </div>
        <div class="grid-content bg-purple map-area" v-if="!mapShow">
          <div class="field" ref="field">
            <div v-for="(item,index) in paperList" :key="index">
              <div
                :ref="'paper'+index"
                :style="{'width':item.width+'px','height':item.height+'px','top':item.startY+'px','left':item.startX+'px',}"
                @mouseenter="paperMouserEnter('paper'+index)"
                @mouseleave="paperMouserLeave('paper'+index)"
                @click="paperClick(item)"
              ></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="pressnoclass">
      <el-col :span="6">
        <el-button type="primary" @click="handlePressNo(1)">第一版</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="handlePressNo(2)">第二版</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="handlePressNo(3)">第三版</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="handlePressNo(4)">第四版</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const conf = require("../config.js");
import Paper from "./Paper";

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
      pressNOArray: [],
      pressInfoArray: []
    };
  },
  methods: {
    handleCommand(command) {
      // console.log("click on item " + command);
      this.getPress(command);
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

      //   this.currentComponent = "my-paper";
      //   this.paper = val;
      this.$store.commit("setPaperShow", val);
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
            this.pressNOArray = res.data.data[2];
            this.pressInfoArray = res.data.data[0][0];
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
    this.getPress(0);
  }
};
</script>

<style lang="stylus" scoped>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
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

span {
  font-size: 0.8em;
}

.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size:1.2em;
  }
.press-info{
  margin-bottom 0.5em;
}
</style>