<template>
  <div class="header">
    <div class="back">
      <span @click="goBack">
        <svg class="icon icon-M fill-dark undefined">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-long-left">
            <svg id="icon-arrow-long-left" viewBox="0 0 32 32" width="100%" height="100%">
              <title>arrow-long-left</title>
              <path
                d="M26.667 14.667h-16.227l7.453-7.453-1.893-1.88-10.667 10.667 10.667 10.667 1.88-1.88-7.44-7.453h16.227v-2.667z"
              ></path>
            </svg>
          </use>
        </svg>
      </span>
    </div>
    <div class="operation">
      <template v-if="! isSelected">
        <div class="clear" @mouseenter="enter" @mouseleave="leave">
          <div class="theIcon" @click="clearCanvas">
            <svg class="icon icon-M fill-undefined undefined">
              <use xlink:href="#icon-delete-all">
                <svg id="icon-delete-all" viewBox="0 0 32 32" width="100%" height="100%">
                  <title>delete-all</title>
                  <path
                    :fill="svgColor"
                    d="M8 25.333c0 1.467 1.2 2.667 2.667 2.667h10.667c1.467 0 2.667-1.2 2.667-2.667v-16h-16v16zM25.333 5.333h-4.667l-1.333-1.333h-6.667l-1.333 1.333h-4.667v2.667h18.667v-2.667z"
                  ></path>
                </svg>
              </use>
            </svg>
          </div>
          <div class="text" @click="clearCanvas">全部删除</div>
        </div>
      </template>
      <template v-else-if="isSelected">
        <div class="clear" @mouseenter="enter" @mouseleave="leave">
          <div class="theIcon" @click="deleteObj">
            <svg class="icon icon-M fill-undefined undefined">
              <use
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:href="#icon-remove-circle-outline"
              >
                <svg id="icon-remove-circle-outline" viewBox="0 0 32 32" width="100%" height="100%">
                  <title>remove-circle-outline</title>
                  <path
                    :fill="svgColor"
                    d="M9.333 14.667v2.667h13.333v-2.667h-13.333zM16 2.667c-7.36 0-13.333 5.973-13.333 13.333s5.973 13.333 13.333 13.333 13.333-5.973 13.333-13.333-5.973-13.333-13.333-13.333zM16 26.667c-5.88 0-10.667-4.787-10.667-10.667s4.787-10.667 10.667-10.667 10.667 4.787 10.667 10.667-4.787 10.667-10.667 10.667z"
                  ></path>
                </svg>
              </use>
            </svg>
          </div>
          <div class="text" @click="deleteObj">删除</div>
        </div>
      </template>
    </div>
    <div class="save">
      <template v-if="isSelected">
        <span @click="download">保存</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "operation",
  data() {
    return {
      hasBorder: false,
      svgColor: "black"
    };
  },
  computed: {
    clearState() {
      return this.$store.state.clearState;
    },
    hasGrid() {
      return this.$store.state.hasGrid;
    },
    isSelected() {
      return this.$store.state.isSelected;
    },
    playerText() {
      return this.$store.state.playerText;
    },
    isLine() {
      return this.$store.state.isLine;
    },
    isPlayer() {
      return this.$store.state.isPlayer;
    },
    text: {
      get() {
        return this.$store.state.text;
      },
      set(value) {
        this.$store.commit("setText", value);
      }
    }
  },
  methods: {
    download() {
      this.$store.commit("changeDownloading");
    },
    clearCanvas() {
      this.$store.commit("changeToClear");
    },
    deleteObj() {
      this.$store.commit("changeToDelete");
    },
    changeGird() {
      this.$store.commit("changeGirdState");
    },
    rotateObj() {
      this.$store.commit("changeToRotate");
    },
    goBack() {
      this.$router.goBack();
      // this.$router.push("/uploadlist");
    },
    enter() {
      this.svgColor = "#d1495b";
    },
    leave() {
      this.svgColor = "black";
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  width: 24px;
  height: 24px;
}
.header {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .back {
    width: 54px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .operation {
    display: flex;
    .text {
      line-height: normal;
      font-size: 14px;
    }
    .clear {
      cursor: pointer;
      display: flex;
      align-items: center;
      text-align: center;
      background-color: #fff;
      border: 1px solid #e7eaef;
      border-radius: 2px;
      color: #2f313c;
      height: 36px;
      padding: 0 10px;
      margin-right: 10px;
      &:hover {
        border-color: #d1495b;
        color: #d1495b;
      }
      .icon {
        padding-right: 5px;
      }
    }
    .toggle {
      cursor: pointer;
      display: flex;
      align-items: center;
      text-align: center;
      background-color: #fff;
      border: 1px solid #e7eaef;
      border-radius: 2px;
      color: #2f313c;
      height: 36px;
      padding: 0 10px;
      .icon {
        padding-right: 5px;
      }
      &:hover {
        background-color: #fff;
        border-color: #2f313c;
        color: #2f313c;
      }
    }
  }
  .rotate {
    cursor: pointer;
    display: flex;
    align-items: center;
    text-align: center;
    background-color: #fff;
    border: 1px solid #e7eaef;
    border-radius: 2px;
    color: #2f313c;
    height: 36px;
    padding: 0 10px;
    .icon {
      padding-right: 5px;
    }
    &:hover {
      background-color: #fff;
      border-color: #2f313c;
      color: #2f313c;
    }
  }
  .playerText {
    display: flex;
    align-items: center;
    border: 1px solid #e7eaef;
    border-radius: 2px;
    color: #2f313c;
    width: 50px;
    height: 36px;
    margin-left: 10px;
    padding: 0 10px;
    background-color: #fafafa;
    outline: none;
    font-size: 15px;
    font-weight: 400;
    &:focus {
      border-color: #45d695;
    }
  }
  .save {
    cursor: pointer;
    display: flex;
    height: 100%;
    width: 92px;
    justify-content: center;
    align-items: center;
    span {
      text-decoration: none;
      color: #fff;
      padding: 8px 14px;
      background-color: #45d695;
      border: 1px solid transparent;
      display: inline-block;
      border-radius: 500px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      line-height: normal;
      &:hover {
        background-color: #2cc681;
        text-decoration: none;
      }
    }
  }
}
</style>
