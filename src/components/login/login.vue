<template>
  <div class="login">
    login
    <img :src="imgUrl" alt="">
  </div>
</template>

<script>
  import { Static } from 'api/config'
  export default {
    data () {
      return {
        imgUrl: `${Static}/img/bank.png`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login {
    display: flex;
  }
</style>

