<template>
  <div class="container-water-fall">
    <!-- <h1 style="position: fixed;left: 0;top: 100px;font-style: 15px;color:blue;z-index: 1000;">{{loadstatus}}</h1> -->
    <div>
      <!-- <button @click="loadmore">loadmore</button>
      <button @click="switchCol(5)">5列</button>
      <button @click="switchCol(8)">8列</button>
      <button @click="switchCol(10)">10列</button>
      <button @click="reset">重置</button>
      <b style="color:blue">滚动至底部可触发loadmore</b>-->
      <waterfall
        :col="col"
        :data="data"
        :width="itemWidth"
        :gutterWidth="gutterWidth"
        @loadmore="loadmore"
      >
        <template>
          <div class="cell-item" v-for="(item,index) in data" :key="index">
            <img
              :style="imgStyle"
              v-if="item.img"
              :lazy-src="item.img"
              alt="加载错误"
              @click="handleClick(item.href)"
            />
            <div class="item-body">
              <div class="item-desc">{{item.title}}</div>
              <!-- <div class="item-footer">
                <div
                  v-if="item.avatar"
                  class="avatar"
                  :style="{backgroundImage : `url(${item.avatar})` }"
                ></div>
                <div class="name">{{item.user}}</div>
                <div class="like" :class="item.liked?'active':''">
                  <i></i>
                  <div class="like-total">{{item.like}}</div>
                </div>
              </div>-->
            </div>
          </div>
        </template>
      </waterfall>
      <!-- <loading :show="loading" /> -->
    </div>
  </div>
</template>

<script>
/*
  注意:
  1.itemWidth需要与gutterWidth一起使用才会生效，否则会进行自适应宽度
  2.使用了waterfall的组件不允许使用scoped,否则样式会有问题
*/
const conf = require("../config.js");

export default {
  props: {
    title: String
  },
  data() {
    return {
      totalData: [],
      data: [],
      col: 5,
      pages: 0,
      imgStyle: {}
    };
  },
  computed: {
    itemWidth() {
      return 133 * 0.5 * (document.documentElement.clientWidth / 375);
    },
    gutterWidth() {
      return 10 * 0.5 * (document.documentElement.clientWidth / 375);
    }
  },
  methods: {
    handleClick(href) {
      // let routeUrl = this.$router.resolve({
      //   // path: "../static/FlipBook/index.html"
      //   path: href
      // });
      // window.open(routeUrl.href, "_blank");
      window.open(href, "_blank");
    },
    reset() {
      this.data = [];
    },

    switchCol(col) {
      this.col = col;
      // console.log(this.col)
    },
    loadmore(num, setTime = 500) {
      // Vue.set(this.data[index],'liked',true)
      // const obj = {c:123,d:456}
      // const {c:a,d:b} = obj
      // console.log("loadmore");
      if (
        this.totalData.length < this.pages * 10 ||
        this.totalData.length < 10
      ) {
        this.$message.success("没有更多内容了");
        return;
      }
      this.loading = true;
      setTimeout(() => {
        this.data = this.data.concat(
          this.totalData.slice(this.pages * 10, (this.pages + 1) * 10)
        );
        this.loading = false;
        // console.log(this.data.length)
      }, setTime);
      // this.$waterfall.resize()
    },
    getMagazine(pages = 1, pageNumber = 10) {
      if (pages < 1 || pageNumber < 0) {
        return;
      }

      // let w = this.itemWidth/12;
      let link = `${conf.link}/ftpapi/getlist`;
      
      // console.log(link);
      this.$http.get(link).then(
        res => {
          if (res.status == 200) {
            // console.log(res);
            for (let i of res.data.data) {
              this.totalData.push({
                img: `${conf.link}/${i.src}`,
                title: i.info,
                href: `${conf.link}/${i.href}`
              });
            }
            
            if (this.totalData.length > 10) {
              this.data = this.totalData.slice(0, 10);
              this.pages++;
            } else {
              this.data = this.totalData;
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
    this.getMagazine();
  }
};
</script>

<style lang="scss" scoped>
.cell-item {
  width: 100%;
  margin-bottom: 18px;
  background: #ffffff;
  border: 2px solid #f0f0f0;
  border-radius: 12px 12px 12px 12px;
  overflow: hidden;
  box-sizing: border-box;
  img {
    // border-radius: 12px 12px 0 0;
    width: 100%;
    height: auto;
    display: block;
  }
  .item-body {
    // border: 1px solid #F0F0F0;
    padding: 12px;
    .item-desc {
      font-size: 15px;
      color: #333333;
      line-height: 15px;
      font-weight: bold;
    }
    .item-footer {
      margin-top: 22px;
      position: relative;
      display: flex;
      align-items: center;
      .avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-size: contain;
      }
      .name {
        max-width: 150px;
        margin-left: 10px;
        font-size: 14px;
        color: #999999;
      }
      .like {
        position: absolute;
        right: 0;
        display: flex;
        align-items: center;
        &.active {
          i {
          }
          .like-total {
            color: #ff4479;
          }
        }
        i {
          width: 28px;
          display: block;
        }
        .like-total {
          margin-left: 10px;
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }
}
</style>
