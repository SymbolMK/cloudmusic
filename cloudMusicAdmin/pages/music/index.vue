<style lang='sass' scoped>
    .wrapper
        width: 100%
        height: 100%
        padding: 20px
        box-sizing: border-box
        overflow-y: scroll
        background: white
        .el-table
            // height: calc(100% - 100px)
            .el-image
                width: 100px
</style>
<template lang='pug'>
    div.wrapper
        el-table(border,:data='tableData')
            el-table-column(type='index',align='center', label='序号', width='80px')
            el-table-column(prop='name',align='center', label='名称', width='')
            el-table-column(prop='copywriter',align='center', label='描述信息', width='')
            el-table-column(prop='picUrl',align='center', label='专辑图片', width='')
                template(slot-scope='scope')
                    el-image(:src='scope.row.picUrl',:preview-src-list="[scope.row.picUrl]")
            el-table-column(prop='playCount',align='center', label='播放量', width='')
            el-table-column(prop='操作',align='center', label='', width='')
                template(slot-scope='scope')
                    el-button() 编辑
        pagination(:pageSize='pageSize',:page='page',:total='total',@handleChange='handleChange')
</template>

<script>
    export default {
        middleware: 'auth',
        data() {
            return {
                page: 1,
                pageSize: 30,
                total: 0,
                tableData: []
            }
        },
        beforeCreate() {},
        created() {},
        beforeMount() {
            this.getData()
        },
        mounted() {
            
        },
        methods: {
            handleChange(obj) {
                if (obj.type == 'size') {
                    this.pageSize = obj.value
                } else {
                    this.page = obj.value
                }
            },
            async getData() {
                let params = {
                    page: this.page,
                    pageSize: this.pageSize
                }
                let _res = await this.$store.dispatch('musicList', params)
                if (_res.code === 200) {
                    this.tableData = _res.data
                }
            }
        },

        components: {
            pagination: () => import('@/components/pagination/index.vue')
        }
    }
</script>