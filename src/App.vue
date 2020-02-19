<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <Login msg="Welcome to Your Vue.js App"/> -->
    <router-view></router-view>
    <!-- <background></background> -->
    <!-- <BackGround /> -->
  </div>
</template>

<script>
import BackGround from './components/BackGround'

export default {
  name: 'app',
  components:{
    "background":BackGround
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
.content p{
  text-align:left ;
  margin-block-start:0.3em;
  margin-block-end:0.3em;
  font-size: 1.2em;
  text-indent: 2em;
}
</style>
