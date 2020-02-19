
<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="title">{{paper.title}}</div>
        <div class="subTitle">{{paper.subTitle}}</div>
        <div class="author" v-if="paper.author">作者：{{paper.author}}</div>
      </el-col>
    </el-row>
    <el-row>
      <label class="gray_line" ></label>
      <!-- <el-divider></el-divider> -->
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="content" v-html="paper.content"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const conf = require("../config.js");

export default {
  data() {
    return {};
  },
  props:["paper"]
};
</script>

<style lang="stylus" scoped>
.title{
    font-size 24px;
    margin 5px;
    font-weight bold;
}
.subTitle{
    font-size 18px;
}
.author{
    font-size 16px;
}
.content{
    font-size 14px;
}
.gray_line{
  background #e5e5e5;
  width 100%;
  height 1px;
  float left;
  margin:5px;
}

</style>