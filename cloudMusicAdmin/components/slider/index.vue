<style lang="sass" scoped>
    .wrapper
        color: #303133
        font-size: 0
        border: none
        height: 100%
        .el-menu-item
            .link
                color: #303133
                text-decoration: none
                width: 100%
                display: inline-block
                .icon
                    padding-right: 10px
                &.nuxt-link-exact-active
                    color: #409EFF
                    .icon
                        color: #409EFF
                .mini
                    font-size: 12px

</style>

<template lang="pug">
    el-menu.wrapper(:collapse='isCollapse')
        el-menu-item(v-for='(item,i) in adminRoute',:key='i', v-if='!item.hidden')
            nuxt-link.link(:to='item.path')
                i.icon(:class='item.meta.cls')
                span.mini {{item.name}}
</template>

<script>
import { mapState } from 'vuex'
export default {
    data:() => {
        return {
            adminRoute: [{
                name: '歌单列表',
                path: '/music',
                meta: {
                    cls: 'el-icon-platform-eleme'
                }
            }, {
                name: '博客列表',
                path: '/blog',
                meta: {
                    cls: 'el-icon-user-solid'
                }
            }, {
                name: '首页轮播',
                path: '/swiper',
                meta: {
                    cls: 'el-icon-s-shop'
                }
            }, {
                name: '歌单编辑',
                path: '/sys-music',
                meta: {
                    cls: 'el-icon-s-comment'
                },
                hidden: true
            }, {
                name: '博客编辑',
                path: '/sys-blog',
                meta: {
                    cls: 'el-icon-s-shop'
                },
                hidden: true
            }]
        }
    },
    computed: {
        ...mapState({
            isCollapse: state => state.isCollapse
        })
    },
    mounted() {
        console.log(this.isCollapse)
    }
}
</script>
