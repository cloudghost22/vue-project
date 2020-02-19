<template>
  <div>
    <div>
      <el-container style="height: 100%; border: 1px solid #eee ;">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <!-- <el-menu :default-openeds="['1', '3']"> -->
          <el-menu :default-openeds="['1', '3']">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-message"></i>菜单
              </template>
              <el-menu-item-group>
                <el-menu-item index="1" @click="menuChange(1)">上传</el-menu-item>
                <el-menu-item index="2" @click="menuChange(2)">编辑</el-menu-item>
                <el-menu-item index="3" @click="menuChange(3)">排版</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-container>
          <el-header style="text-align: right; font-size: 12px">
            <el-dropdown>
              <i class="el-icon-setting" style="margin-right: 15px"></i>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item>查看</el-dropdown-item>
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
            <span>管理员</span>
          </el-header>

          <el-main style="min-height:80%">
            <component :is="currentComponent"></component>
          </el-main>
        </el-container>
      </el-container>
    </div> 
  </div>
</template>

<script>
import Upload from "./Upload";
import UploadList from "./UploadList";
import PressList from "./PressList";

export default {
  data() {
    return {
      currentComponent: "my-upload"
    };
  },
  components: {
    "my-upload": Upload,
    "my-uploadlist": UploadList,
    "my-presslist": PressList,
  },
  methods: {
    menuChange(val) {
      switch (val) {
        case 1:
          this.currentComponent = "my-upload";
          break;
        case 2:
          this.currentComponent = "my-uploadlist";
          break;
        case 3:
          this.currentComponent = "my-presslist";
          break;
        default:
          this.currentComponent = "my-upload";
      }
    },
  }
};
</script>

<style lang="stylus" scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}



</style>