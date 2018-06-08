<template>
  <div class="home">
    home
    <div>{{user}}</div>
    <div>{{num}}</div>
    <div>{{filterUser}}</div>
    <button @click="changeUser">修改user</button>
    <button @click="ADD_NUM">增加num</button>
    <img :src="imgUrl" alt="">
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations } from 'vuex'
  import { Static } from 'api/config'
  export default {
    props: {
      id: {
        type: String
      }
    },
    computed: {
      ...mapState([
        'user',
        'num'
      ]),
      ...mapGetters([
        'filterUser'
      ])
    },
    data () {
      return {
        imgUrl: `${Static}/img/bank.png`
      }
    },
    mounted () {
      console.log(this.id)
    },
    methods: {
      changeUser () {
        this.SET_USER('Zzc')
        // this.$store.state.user = 'Zzc'
      },
      ...mapMutations([
        'SET_USER',
        'ADD_NUM'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .home {
    color: green;
  }
</style>

