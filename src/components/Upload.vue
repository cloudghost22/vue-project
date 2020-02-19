<template>
  <el-upload
    class="upload-demo"
    :headers= "setHeader"
    :action="uploadPath"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    multiple
    :limit="4"
    :on-exceed="handleExceed"
    :file-list="fileList"
  >
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2m</div>
  </el-upload>
</template>



<script>
const conf = require("../config.js");

export default {
  created() {
    this.setHeader = {
      Authorization:'Bearer '+ sessionStorage.getItem('demo-token'),
    }
  },
  data() {
    return {
      uploadPath: conf.uploadPath,
      setHeader:{},
      fileList: []
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 4 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>