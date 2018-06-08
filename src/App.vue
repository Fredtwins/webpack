<template>
  <div class="app">
    {{text}}
    <div>
      <router-link to="/login">login</router-link>
      <router-link to="/home/123">home123</router-link>
      <router-link to="/home/456">home456</router-link>
    </div>
    <div>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    mounted () {
      console.log(Promise.resolve)
    },
    data () {
      return {
        text: 'Gykj_study'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app {
    color: red;
    transition: all .4s;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .4s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>

