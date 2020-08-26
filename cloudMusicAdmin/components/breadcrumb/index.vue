<style lang="sass" scoped>
  .breadcrumb-enter-active,
  .breadcrumb-leave-active
    transition: all .5s

  .breadcrumb-enter,
  .breadcrumb-leave-active
    opacity: 0
    transform: translateX(20px)

  .breadcrumb-move
    transition: (all 0.5s)

  .breadcrumb-leave-active
    position: absolute
    
  .el-breadcrumb 
    display: inline-block
    font-size: 12px
    margin-left: 10px
    min-width: 50px
    line-height: 48px
    .no-redirect
      cursor: text
</style>

<template lang="pug">
  el-breadcrumb.breadcrumb(separator='/')
    transition-group(name='breadcrumb')
      el-breadcrumb-item(v-for="(item, index) in list" v-if="item.name" :key="item.path")
        span.link.no-redirect(v-if="item.redirect === 'noredirect' || index === item.length - 1") {{item.name}}
        router-link.link(v-else :to="item.redirect || item.path") {{item.name}}
</template>

<script>
export default {
  name: 'breadcrumb',
  data() {
    return {
      list: null
    }
  },
  created() {
    this.getBreadcrumb()
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      if (matched[0] && matched[0].name !== '首页') {
        matched = [{ path: '/', name:'首页' }].concat(
          matched
        )
      }
      this.list = matched
    }
  }
}
</script>
