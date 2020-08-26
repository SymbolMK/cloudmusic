<style lang='sass' scoped>
    .__page_wrapper
        width: 100%
        height: 100%
        overflow: hidden
        .header
            padding: 0
            height: 80rpx
            line-height: 80rpx
            display: flex
            align-items: center
            background: white
            box-sizing: border-box
            border-bottom: 1px solid #dcdfe6
        .container
            height: calc(100% - 80px)
            .slide
                width: 200px
                will-change: width
                transition: all 0.4s
                background: white
                border-right: 1px solid #dcdfe6
            .main
                padding: 10px
                box-sizing: border-box
</style>
<template lang='pug'>
    el-container.__page_wrapper
        el-header.header
            headerBar
        el-container.container
            el-aside(:style="{width: isCollapse ? '60px' : '200px' }")
                slideBar
            el-main.main
                nuxt

</template>

<script>
    import { mapState } from 'vuex' 
    export default {
        middleware: 'auth',
        head: {
            title: '云开发配置后台'
        },
        data() {
            return {
                
            }
        },
        computed: {
            ...mapState({
                isCollapse: state => state.isCollapse
            })
        },
        beforeCreate() {},
        created() {},
        beforeMount() {},
        mounted() {},
        methods: {},
        components: {
            slideBar: () => import('@/components/slider/index.vue'),
            headerBar: () => import('@/components/header/index.vue')
        }
    }
</script>