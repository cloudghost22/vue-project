<template>
  <div id="ground" ref="ground" :class="type === 'coach' ? 'coachBg' : 'standardBg'">
    <div class="field" ref="field">
      <canvas
        id="canvas"
        ref="canvas"
        width="406px"
        height="580px"
        @mousedown="canvasDown($event)"
        @mousemove="canvasMove($event)"
        @mouseup="canvasUp($event)"
        @dragover="dragOver($event)"
        @drop="dragFinished($event)"
      ></canvas>
      <input
        type="text"
        id="inputText"
        :class="type === 'coach' ? 'coachInputBorder' : 'standardInputBorder'"
        ref="inputText"
      >
    </div>
    <div class="editorField">
      <editor></editor>
    </div>
  </div>
</template>

<script>
import Selection from "../tool/selection";
import Polygon from "../tool/polygon";
import Line from "../tool/line";
import Graph from "../tool/graph";
import Icon from "../tool/icon";
import Text from "../tool/text";
import Editor from "./Editor";

const conf = require("../config.js");

export default {
  name: "ground",
  data() {
    return {
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: 0
      },
      mouseDown: false,
      mouseEnter: false,
      playerStack: [],
      otherStack: [],
      imgWrap: [],
      obj: {},
      selectObj: {},
      imgArr: [],
      bgImg: {},
      polygonObj: {},
      edgeColor: ""
    };
  },
  props: ["type", "index"],
  components: {
    editor: Editor
  },
  computed: {
    tool() {
      return this.$store.state.tool;
      // return "rectangle";
    },
    hasGrid() {
      return this.$store.state.hasGrid;
    },
    canvas() {
      return this.$refs.canvas;
    },
    field() {
      return this.$refs.field;
    },
    inputText() {
      return this.$refs.inputText;
    },
    width() {
      return this.$refs.canvas.width;
    },
    height() {
      return this.$refs.canvas.height;
    },
    shapesColor() {
      return this.$store.state.shapesColor;
    },
    equipmentColor() {
      return this.$store.state.equipmentColor;
    },
    playersColor() {
      return this.$store.state.playersColor;
    },
    linesColor() {
      return this.$store.state.linesColor;
    },
    color() {
      return this.$store.state.color;
    },
    downloading() {
      // return this.$store.state.downloading;
      return this.$store.state.readySave;
    },
    toClear() {
      return this.$store.state.toClear;
    },
    toDelete() {
      return this.$store.state.toDelete;
    },
    toRotate() {
      return this.$store.state.toRotate;
    },
    text() {
      return this.$store.state.text;
    },
    isSelected() {
      return this.$store.state.isSelected;
    }
  },
  methods: {
    canvasDown(event) {
      let canvas = this.canvas;
      this.start = this.end = this.canvasMousePos(canvas, event);
      this.mouseDown = true;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, this.width, this.height);
      if (this.tool === "polygon") {
        if (JSON.stringify(this.polygonObj) === "{}") {
          let selectionColor = this.color[this.shapesColor];
          this.polygonObj = new Polygon(
            ctx,
            [[this.start.x, this.start.y]],
            [],
            selectionColor,
            this.edgeColor
          );
        }
      } else {
        this.polygonObj = {};
      }
      let arr = [];
      for (let obj of this.otherStack) {
        obj.draw();
        if (obj.inRange(this.start.x, this.start.y)) {
          arr.push(obj);
        }
      }
      for (let obj of this.playerStack) {
        obj.draw();
        if (obj.inRange(this.start.x, this.start.y)) {
          arr.push(obj);
        }
      }
      let thisObj = {};
      if (arr.length === 1) {
        thisObj = arr[0];
      } else if (arr.length > 1) {
        let selectionArr = [];
        let othersArr = [];
        for (let obj of arr) {
          if (obj instanceof Selection) {
            selectionArr.push(obj);
          } else {
            othersArr.push(obj);
          }
        }
        if (selectionArr.length !== 0 && othersArr.length === 1) {
          thisObj = othersArr[0];
        } else if (othersArr.length === 0) {
          let widthSortedArr = selectionArr.sort(function(a, b) {
            return a.width - b.width;
          });
          let heightSortedArr = selectionArr.sort(function(a, b) {
            return a.height - b.height;
          });
          if (widthSortedArr[0] === heightSortedArr[0]) {
            thisObj = widthSortedArr[0];
          }
        }
      }
      if (JSON.stringify(thisObj) === "{}") {
        this.selectObj = {};
        this.$store.commit("changeSelectState", false);
        this.$store.commit("changePlayerTextState", false);
        this.$store.commit("changeIsLineState", false);
      } else {
        this.$store.commit("changeSelectState", true);
        thisObj.drawEdges();
        this.selectObj = thisObj;
        if (thisObj instanceof Selection) {
          thisObj.diffStartX = this.start.x - thisObj.start.x;
          thisObj.diffStartY = this.start.y - thisObj.start.y;
          thisObj.diffEndX = thisObj.end.x - this.start.x;
          thisObj.diffEndY = thisObj.end.y - this.start.y;
          this.$store.commit("changePlayerTextState", false);
          this.$store.commit("changeIsLineState", false);
          //为每个区域增加一个编号，根据时间戳生成
          if (!this.selectObj.objID) {
            this.selectObj.objID = new Date().valueOf();
            this.$store.commit("changeEditorClear");
          } else {
            this.$store.commit("setAreaID", this.selectObj.objID);
          }
          // this.selectObj.objID = this.selectObj.objID?this.selectObj.objID:(new Date()).valueOf();
        }
      }
    },
    canvasMove(event) {
      let mouseDown = this.mouseDown;
      let tool = this.tool;
      let canvas = this.canvas;
      let ctx = canvas.getContext("2d");
      if (mouseDown) {
        if (this.tool) {
          this.end = this.canvasMousePos(canvas, event);
          ctx.clearRect(0, 0, this.width, this.height);
          if (
            tool === "square" ||
            tool === "rectangle" ||
            tool === "circular" ||
            tool === "reTriangle"
          ) {
            let selectionColor = this.color[this.shapesColor];
            this.obj = new Selection(
              ctx,
              tool,
              this.start,
              this.end,
              selectionColor,
              this.edgeColor
            );
            this.reDraw();
            this.obj.draw();
            this.obj.drawEdges();
          } else if (tool === "ruler") {
            let selectionColor = this.color[this.shapesColor];
            this.obj = new Line(
              ctx,
              tool,
              this.start,
              this.end,
              selectionColor,
              this.edgeColor
            );
            this.reDraw();
            this.obj.draw();
            this.obj.drawEdges();
          } else if (
            tool === "solidArrowLine" ||
            tool === "dottedArrowLine" ||
            tool === "waveLine" ||
            tool === "dottedLine"
          ) {
            let lineColor = this.color[this.linesColor];
            this.obj = new Line(
              ctx,
              tool,
              this.start,
              this.end,
              lineColor,
              this.edgeColor
            );
            this.reDraw();
            this.obj.draw();
            this.obj.drawEdges();
          } else if (tool === "polygon") {
            this.polygonObj.next = [this.end.x, this.end.y];
            this.reDraw();
            this.polygonObj.draw();
          }
        } else if (JSON.stringify(this.selectObj) !== "{}") {
          this.end = this.canvasMousePos(canvas, event);
          if (this.selectObj instanceof Line) {
            this.selectObj.move(
              this.end.x - this.start.x,
              this.end.y - this.start.y
            );
          } else {
            this.selectObj.move(this.end.x, this.end.y);
          }
          ctx.clearRect(0, 0, this.width, this.height);
          this.reDraw();
          this.selectObj.drawEdges();
        }
      }
    },
    canvasUp() {
      this.mouseDown = false;
      if (JSON.stringify(this.obj) !== "{}") {
        let diffX = Math.abs(this.end.x - this.start.x);
        let diffY = Math.abs(this.end.y - this.start.y);
        let len = Math.sqrt(diffX * diffX + diffY * diffY);
        if (
          ((this.obj.type === "rectangle" || this.obj.type === "circular") &&
            (diffX > 40 || diffY > 40)) ||
          ((this.obj.type === "square" || this.obj.type === "reTriangle") &&
            (diffX > 40 && diffY > 40)) ||
          (this.obj instanceof Line && len > 60)
        ) {
          this.otherStack.push(this.obj);
        } else {
          this.canvas.getContext("2d").clearRect(0, 0, this.width, this.height);
          this.reDraw();
        }
        this.obj = {};
        this.start = {
          x: 0,
          y: 0
        };
        this.end = {
          x: 0,
          y: 0
        };
      } else if (JSON.stringify(this.polygonObj) !== "{}") {
        let len = Math.sqrt(
          Math.pow(this.polygonObj.next[0] - this.polygonObj.points[0][0], 2) +
            Math.pow(this.polygonObj.next[1] - this.polygonObj.points[0][1], 2)
        );
        if (len < 10) {
          this.polygonObj.finish = true;
          this.otherStack.push(this.polygonObj);
          this.canvas.getContext("2d").clearRect(0, 0, this.width, this.height);
          this.reDraw();
          this.polygonObj.drawEdges();
          this.polygonObj = {};
        } else {
          this.polygonObj.points.push(this.polygonObj.next);
        }
        this.start = {
          x: 0,
          y: 0
        };
        this.end = {
          x: 0,
          y: 0
        };
      } else if (this.end.x !== this.start.x || this.end.y !== this.start.y) {
        if (this.selectObj instanceof Line) {
          this.selectObj.cache.start.x = this.selectObj.start.x;
          this.selectObj.cache.start.y = this.selectObj.start.y;
          this.selectObj.cache.end.x = this.selectObj.end.x;
          this.selectObj.cache.end.y = this.selectObj.end.y;
        }
      }
    },
    getScrollTop() {
      let scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop;
    },
    canvasMousePos(canvas, event) {
      let x =
        (document.documentElement.scrollLeft || document.body.scrollLeft) +
        (event.clientX || event.pageX);
      let y = (event.clientY || event.pageY) + this.getScrollTop();
      return {
        x: x - canvas.offsetLeft,
        y: y - canvas.offsetTop
      };
    },
    dragOver(event) {
      event.preventDefault();
    },
    dragFinished(event) {
      event.preventDefault();
      let canvas = this.canvas;
      let ctx = canvas.getContext("2d");
      let tool = this.tool;
      let allGraph = "ball bigGate smallGate wheel railing stool column";
      let allIcon = "point triangle ring halfRing halfTriangle halfCircular";
      this.end = this.canvasMousePos(canvas, event);
      if (allGraph.indexOf(tool) > -1) {
        let img;
        switch (tool) {
          case "ball":
            img = this.imgArr[0];
            break;
          case "bigGate":
            img = this.imgArr[1];
            break;
          case "smallGate":
            img = this.imgArr[2];
            break;
          case "wheel":
            img = this.imgArr[3];
            break;
          case "railing":
            img = this.imgArr[4];
            break;
          case "stool":
            img = this.imgArr[5];
            break;
          case "column":
            img = this.imgArr[6];
            break;
        }
        this.obj = new Graph(ctx, tool, img, this.end, this.edgeColor);
        ctx.clearRect(0, 0, this.width, this.height);
        this.reDraw();
        this.obj.draw();
        this.obj.drawEdges();
        this.otherStack.push(this.obj);
        this.selectObj = this.obj;
        this.$store.commit("changeSelectState", true);
        this.$store.commit("changePlayerTextState", false);
        this.obj = {};
        this.$store.commit("setTool", "");
      } else if (allIcon.indexOf(tool) > -1) {
        let color = "";
        if (tool === "point" || tool === "triangle") {
          color = this.color[this.equipmentColor];
          this.$store.commit("changePlayerTextState", false);
        } else if (
          tool === "ring" ||
          tool === "halfRing" ||
          tool === "halfTriangle" ||
          tool === "halfCircular"
        ) {
          color = this.color[this.playersColor];
          this.$store.commit("changePlayerTextState", true);
        }
        this.obj = new Icon(ctx, tool, this.end, color, this.edgeColor);
        if (this.tool === "halfRing") {
          this.$store.commit("changeIsPlayerState", true);
          this.$store.commit("setText", "GK");
        } else {
          this.$store.commit("changeIsPlayerState", false);
          this.$store.commit("setText", "");
        }
        ctx.clearRect(0, 0, this.width, this.height);
        this.reDraw();
        this.obj.draw();
        this.obj.drawEdges();
        this.playerStack.push(this.obj);
        this.selectObj = this.obj;
        this.$store.commit("changeSelectState", true);
        this.obj = {};
        this.$store.commit("setTool", "");
      } else if (tool == "text") {
        this.inputText.style.display = "block";
        this.inputText.parentNode.style.position = "relative";
        this.inputText.style.top = this.end.y + "px";
        this.inputText.style.left = this.end.x - 100 + "px";
        this.inputText.focus();
        document.onkeydown = e => {
          if (e.keyCode === 13) {
            let text = this.inputText.value;
            this.inputText.style.display = "none";
            this.inputText.value = "";
            this.inputText.parentNode.style.position = "";
            this.obj = new Text(ctx, text, this.end, this.edgeColor);
            ctx.clearRect(0, 0, this.width, this.height);
            this.reDraw();
            this.obj.draw();
            this.obj.drawEdges();
            this.otherStack.push(this.obj);
            this.selectObj = this.obj;
            this.$store.commit("changeSelectState", true);
            this.$store.commit("changePlayerTextState", false);
            this.obj = {};
            this.$store.commit("setTool", "");
          }
        };
      }
    },
    reDraw() {
      for (let obj of this.otherStack) {
        obj.draw();
      }
      for (let obj of this.playerStack) {
        obj.draw();
      }
    },
    //保存数据
    downImg() {
      let obj = {
        paperID: this.$store.state.paperID,
        areaID: this.selectObj.objID,
        content: this.$store.state.content,
        area: JSON.stringify(this.selectObj)
      };
      this.$http
        .post(`${conf.link}/api/savepaper`, obj) // 将信息发送给后端
        .then(
          res => {
            // axios返回的数据都在res.data里
            if (!res.data.errno) {
              // 如果成功
              this.$message({
                // 登录成功，显示提示语
                type: "success",
                message: "保存成功！"
              });
            } else {
              this.$message.error("请求错误！"); // 登录失败，显示提示语
            }
          },
          err => {
            this.$message.error("请求错误！");
          }
        );
      // this.$store.commit('changeSaveState');
    }
  },
  watch: {
    downloading() {
      this.downImg();
    },
    toClear() {
      this.otherStack = [];
      this.playerStack = [];
      this.canvas.getContext("2d").clearRect(0, 0, this.width, this.height);
      this.reDraw();
    },
    toDelete() {
      // console.log("todelete");
      // console.log(`${conf.link}/api/deletepaper/${this.selectObj.objID}`);
      //清空编辑框
      this.$store.commit("changeEditorClear");
      //删除后台保存的数据
      this.$http
        .get(`${conf.link}/api/deletepaper/${this.selectObj.objID}`) // 将信息发送给后端
        .then(
          res => {
            // axios返回的数据都在res.data里
            if (!res.data.errno) {
              // 如果成功
              this.$message({
                // 登录成功，显示提示语
                type: "success",
                message: "删除成功！"
              });
            } else {
              this.$message.error("请求错误！"); // 登录失败，显示提示语
            }
          },
          err => {
            this.$message.error("请求错误！");
          }
        );

      let index1 = this.otherStack.indexOf(this.selectObj);
      let index2 = this.playerStack.indexOf(this.selectObj);
      if (index1 > -1) {
        this.otherStack.splice(index1, 1);
      } else if (index2 > -1) {
        this.playerStack.splice(index2, 1);
      }
      this.selectObj = {};
      this.canvas.getContext("2d").clearRect(0, 0, this.width, this.height);
      this.reDraw();
    }
  },
  mounted() {
    let imgLink = this.$store.state.imgLink;
    this.edgeColor = this.type === "coach" ? "rgb(69, 214, 149)" : "white";
    this.$refs.field.style.backgroundImage = `url(${conf.link}/${imgLink})`;
    this.$refs.field.style.backgroundSize = "406px 580px";
    this.$refs.field.style.backgroundPosition = "0px 0px";

    //加载已有区域
    this.$http
      .get(`${conf.link}/api/loadallarea/${this.$store.state.paperID}`) // 将信息发送给后端
      .then(
        res => {
          // axios返回的数据都在res.data里
          if (!res.data.errno) {
            if (res.data) {
              // console.log(res.data.data);
              let ctx = canvas.getContext("2d");
              for (let i of res.data.data) {
                let tempObj = JSON.parse(i.detail);
                this.obj = new Selection(
                  ctx,
                  tempObj.type,
                  tempObj.start,
                  tempObj.end,
                  tempObj.color,
                  tempObj.edgeColor,
                  tempObj.objID
                );
                // this.reDraw();
                // this.obj.draw();
                // this.obj.drawEdges();

                this.otherStack.push(this.obj);
              }
              this.reDraw();
              this.obj = {};
              this.start = {
                x: 0,
                y: 0
              };
              this.end = {
                x: 0,
                y: 0
              };
            
            }
          } else {
            this.$message.error("请求错误！"); // 登录失败，显示提示语
          }
        },
        err => {
          this.$message.error("请求错误！");
        }
      );
  }
};
</script>

<style lang="scss" scoped>
#ground {
  margin-left: 2em;
  background-repeat: repeat;
  // display: flex;
  justify-content: center;
}
#inputText {
  display: none;
  position: absolute;
  outline: none;
  opacity: 0.5;
  width: 200px;
  height: 20px;
  filter: alpha(opacity=50);
  padding-left: 10px;
  line-height: 20px;
}
.coachInputBorder {
  border: solid 2px rgb(69, 214, 149);
}
.standardInputBorder {
  border: solid 2px white;
}
.field {
  // margin-top: 50px;
  // width: 1000px;
  // height: 563px;
  width: 406px;
  height: 580px;
  background-repeat: no-repeat;
  background-size: auto;
  float: left;
}
.coachFieldBorder {
  border: dashed 2px rgb(69, 214, 149);
}
.standardFieldBorder {
  border: dashed 2px white;
}
#canvas {
  width: 406px;
  height: 580px;
}

.editorField {
  float: left;
}
</style>
