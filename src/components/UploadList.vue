<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="block">
          <el-pagination
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next"
            :total="total"
            page-size=4
          ></el-pagination>
        </div>
      </el-col>
    </el-row>

    <el-table :data="list" stripe style="width: 100%">
      <el-table-column prop="imgName" label="名称" width="350"></el-table-column>
      <el-table-column prop="mtime" label="时间" width="250"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="primary" @click="handleClick(scope.row)">查看</el-button> -->
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div :class="{popShow:isShow}" :style="styleObj">
      <div>
        <el-row>
          <el-col :span="8" :offset="16">
            <el-button plain @click="noShow">关闭</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
const conf = require("../config.js");

export default {
  created() {
    this.getList();
  },
  data() {
    return {
      list: [],
      isShow: false,
      styleObj: {
        background: "",
        src: "",
        display: "none",
        height: "",
        width: ""
      },
      imgSrc: "",
      total: 0
    };
  },
  methods: {
    noShow() {
      this.styleObj.background = "";
      this.isShow = false;
      this.styleObj.display = "none";
    },
    handleClick(row) {
      let imgPath = row.path;
      // console.log(row);
      // this.getSize(`${conf.link}/${imgPath}`);
      this.styleObj.background = `url(${
        conf.link
      }/${imgPath}) no-repeat center`;
      this.isShow = true;
      this.styleObj.display = "";
    },
    handleEdit(index, row) {
      // console.log(index, row);
      this.$store.commit("setImgLink", row.path);
      this.$store.commit("setPaperIDState", row.id);
      this.$router.push("/edit");
    },
    handleDelete(index, row) {
      // console.log(index, row);
      this.$http
        .get(`${conf.link}/api/deleteupload/${row.id}`)
        .then(
          res => {
            if (res.status == 200) {
              this.$message({
                // 成功，显示提示语
                type: "success",
                message: "删除成功！"
              });
            this.handleCurrentChange();
            } else {
              this.$message.error("删除失败");
            }
          },
          err => {
            this.$message.error("删除失败");
            // console.log(err)
          }
        );
    },
    handleCurrentChange(currentPage) {
      this.getList(currentPage);
    },
    getList(currntPage = 1) {
      this.$http
        .get(`${conf.link}/api/uploadlist/?currentpage=${currntPage}`)
        .then(
          res => {
            if (res.status == 200) {
              this.total = res.data[0].total;
              this.list = res.data; // 将获取的信息塞入实例里的list
            } else {
              this.$message.error("获取列表失败！");
            }
          },
          err => {
            this.$message.error("获取列表失败！");
            // console.log(err)
          }
        );
    }
  }
};
</script>


<style lang="stylus" scoped>
.popShow {
  position: absolute;
  z-index: 999;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  width: 50%;
  height: 50%;
  color: #222;
}
</style>