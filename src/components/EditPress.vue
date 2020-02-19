<template>
  <div>
    <el-row>
      <el-col :span="8" offset="16">
        <el-button type="success" @click="handleSave">保存</el-button>
        <el-button type="info" @click="resetAll">全部重置</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">报纸名称：</el-col>
      <el-col :span="12">
        <el-input v-model="pressName" placeholder="请输入报纸名称"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">期刊号：</el-col>
      <el-col :span="12">
        <el-input v-model="pressNo" placeholder="请输入期刊号"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">发布日期:</el-col>
      <el-col :span="12">
        <div class="block">
          <el-date-picker
            v-model="pressDate"
            type="date"
            placeholder="选择日期:"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-table :data="list" stripe style="width: 100%">
      <el-table-column prop="pressNo" label="版号" width="100"></el-table-column>
      <el-table-column prop="paperName" label="版面" width="300"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="info" @click="resetOne(scope.$index, scope.row)">重置版面</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const conf = require("../config.js");

export default {
  name: "editpress",
  data() {
    return {
      pressName: "京烟报",
      pressNo: "",
      pressDate: "",
      index: "",
      pressID:"",
      list: [
        {
          pressNo: "第一版",
          pressNoValue:1,
          paperName: "",
          ID: "",
          paperID:"",
        },
        {
          pressNo: "第二版",
          pressNoValue:2,
          paperName: "",
          ID: "",
          paperID:"",
        },
        {
          pressNo: "第三版",
          pressNoValue:3,
          paperName: "",
          ID: "",
          paperID:"",
        },
        {
          pressNo: "第四版",
          pressNoValue:4,
          paperName: "",
          ID: "",
          paperID:"",
        }
      ]
    };
  },
  computed: {
    pressValue() {
      return this.$store.state.pressValue;
    },
    editPress() {
      return this.$store.state.editPress;
    }
  },
  watch: {
    pressValue() {
      let pressValue = this.$store.state.pressValue;
      let value = pressValue.split("|");
      this.list[this.index].ID = value[0];
      this.list[this.index].paperName = value[1];
    },
    editPress() {
      let editValue = this.$store.state.editPress;
      if (editValue) {
        this.pressName = editValue.press[0].pressName;
        this.pressNo = editValue.press[0].pressNo;
        this.pressDate = editValue.press[0].pressDate;
        this.pressID = editValue.press[0].pressID;
        this.list = editValue.subPress;
      }
    }
  },
  methods: {
    resetAll() {
      this.pressName = "";
      this.pressNo = "";
      this.pressDate = "";
      this.pressID = "";
      for (let i of this.list) {
        i.paperName = "";
        i.ID = "";
      }
    },
    resetOne(index, row) {
      this.list[index].paperName = "";
      this.list[index].ID = "";
    },
    handleEdit(index, row) {
      this.$store.commit("changepaperSelect");
      this.index = index;
    },
    handleSave() {
      let obj = {
        pressName: this.pressName,
        pressNo: this.pressNo,
        pressDate: this.pressDate,
        pressID: new Date().valueOf(),
        subPress: this.list,
        pressIDOld:this.pressID,
      };
      this.$http
        .post(`${conf.link}/api/savepress`, obj) // 将信息发送给后端
        .then(
          res => {
            // console.log(res);
            // axios返回的数据都在res.data里
            if (res.status == 200) {
              //关闭
              this.$store.commit("changePressOuterShow");
              this.$message({
                type: "success",
                message: "保存成功！"
              });
            } else {
              this.$message.error(res.data.info); // 登录失败，显示提示语
            }
          },
          err => {
            this.$message.error("请求错误！");
          }
        );
    }
  }
};
</script>

<style scoped>
</style>
