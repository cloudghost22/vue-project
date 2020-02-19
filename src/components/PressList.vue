<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" @click="addPress">添加报纸</el-button>
      </el-col>
    </el-row>

    <el-table :data="list" stripe style="width: 100%">
      <el-table-column prop="pressName" label="名称" width="150"></el-table-column>
      <el-table-column prop="pressNo" label="期号" width="150"></el-table-column>
      <el-table-column prop="pressDate" label="日期"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="primary" @click="handleClick(scope.row)">查看</el-button> -->
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-dialog title="设置版面" :visible.sync="outerVisible">
        <el-dialog width="40%" title="选择版面" :visible.sync="innerVisible" append-to-body>
          <span>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </span>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleInnerSave">保 存</el-button>
          </div>
        </el-dialog>

        <span>
          <my-editypress></my-editypress>
        </span>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleOuterSave">确 定</el-button>
        </div>-->
      </el-dialog>
    </div>
  </div>
</template>

<script>
const conf = require("../config.js");
import EditPress from "./EditPress";

export default {
  created() {
    this.getPressList();
    this.options = [];
    this.getList();
  },
  data() {
    return {
      list: [],
      total: 0,
      outerVisible: false,
      innerVisible: false,
      options: [],
      value: "",
    };
  },
  components: {
    "my-editypress": EditPress
  },
  computed: {
    innerShow() {
      return this.$store.state.paperSelect;
    },
    outerShow() {
      return this.$store.state.pressOuterShow;
    }
  },
  watch: {
    innerShow() {
      this.value = "";
      this.innerVisible = true;
    },
    outerShow() {
      this.outerVisible = !this.outerVisible;
      if(!this.outerVisible){
        this.getPressList();
      }
    }
  },
  methods: {
    handleInnerSave() {
      this.$store.commit("setpaperSelect", this.value);
      this.innerVisible = false;
    },
    handleOuterSave() {
      this.innerVisible = false;
    },
    handleClose(done) {
      // this.$confirm("确认关闭？")
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
      console.log("closse");
    },
    handleClick(row) {
      //   let imgPath = row.path;
      // console.log(row);
      // this.getSize(`${conf.link}/${imgPath}`);
      //   this.styleObj.background = `url(${
      //     conf.link
      //   }/${imgPath}) no-repeat center`;
      //   this.isShow = true;
      //   this.styleObj.display = "";
    },
    handleEdit(index, row) {
      // console.log(index, row);
      //   this.$router.push("/edit");
      this.$http.get(`${conf.link}/api/loadpress/${row.pressID}`).then(
        res => {
          if (res.status == 200) {
            this.$store.dispatch("editPressAction", res.data);
          } else {
            this.$message.error("请求失败");
          }
        },
        err => {
          this.$message.error("请求失败");
          // console.log(err)
        }
      );
    },
    handleDelete(index, row) {
      this.$http.get(`${conf.link}/api/deletepress/${row.ID}`).then(
        res => {
          if (res.status == 200) {
            this.$message({
              // 成功，显示提示语
              type: "success",
              message: "删除成功！"
            });
            this.getPressList();
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
      this.getPressList(currentPage);
    },
    addPress() {
      //   this.$router.push("/editpress");
      this.outerVisible = true;
      // this.options = [];
      // this.getList();
    },
    getList(currntPage = 1) {
      this.$http
        .get(`${conf.link}/api/uploadlist/?currentpage=${currntPage}`)
        .then(
          res => {
            if (res.status == 200) {
              // this.list = res.data; // 将获取的信息塞入实例里的list
              for (let i of res.data) {
                this.options.push({
                  value: `${i.id}|${i.imgName}`,
                  label: i.imgName
                });
              }
            } else {
              this.$message.error("获取列表失败！");
            }
          },
          err => {
            this.$message.error("获取列表失败！");
            // console.log(err)
          }
        );
    },
    getPressList(currntPage = 1) {
      this.$http
        .get(`${conf.link}/api/loadpress/?currentpage=${currntPage}`)
        .then(
          res => {
            if (res.status == 200) {
              // console.log(res);
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