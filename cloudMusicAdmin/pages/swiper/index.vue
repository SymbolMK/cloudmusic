<style lang='sass' scoped>
    .wrapper
        width: 100%
        height: 100%
        padding: 20px
        box-sizing: border-box
        overflow-y: scroll
        background: white
        .header
            margin-bottom: 20px
        .el-table
            .el-image
                width: 70px
        .upload
            width: 140px
            height: 140px
            border: 1px dashed #d9d9d9
            border-radius: 6px
            cursor: pointer
            position: relative
            overflow: hidden
            &:hover
                 border-color: #409EFF
            input
                position: absolute
                left: 0
                top: 0
                right: 0
                bottom: 0
                opacity: 0
            .el-icon-plus
                font-size: 28px
                color: #8c939d
                width: 140px
                height: 140px
                line-height: 140px
                text-align: center
            .imagebox
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                .delete
                    position: absolute
                    right: 0
                    top: 0
                    padding: 5px
                    z-index: 20
                    font-size: 15px
                    line-height: 1
                .el-image
                    position: absolute
                    left: 50%
                    top: 50%
                    width: 100%
                    height: 100%
                    transform: translate(-50%, -50%)
                    max-width: 100%
                    max-height: 100%


            
</style>
<template lang='pug'>
    div.wrapper
        .header
            el-button(size='normal', type='primary', icon='el-icon-circle-plus', @click='dialogVisible = true') 添加
        el-table(border,:data='tableData')
            el-table-column(type='index',align='center', label='序号', width='80px')
            el-table-column(prop='name',align='center', label='名称', width='')
            el-table-column(prop='url',align='center', label='专辑图片', width='')
                template(slot-scope='scope')
                    el-image(:src='scope.row.url',:preview-src-list="[scope.row.url]")
            el-table-column(prop='操作',align='center', label='', width='200')
                template(slot-scope='scope')
                    el-button(type='primary') 编辑
                    el-button() 删除
        el-dialog(title="详细内容", :model='form', :visible.sync="dialogVisible", width="640px")
            el-form(label-width='120px',:rules='rules',:model='form')
                el-form-item(prop='name',label='名称：')
                    el-input(maxlength='20',show-limit-count,clearable, v-model='form.name')
                //- el-form-item(prop='sort',label='序号：')
                //-     el-input-number(v-model="form.sort", :min="1",:max="10" label="优先级")
                el-form-item(prop='url',label='图片地址：')
                    //- el-upload()
                    .upload
                        .el-icon-plus.avatar-uploader-icon
                        input(v-show='!form.url',type='file', accept='image/*', ref='upload', @change='uploadChange')
                        .imagebox(v-if='form.url',)
                            span.delete(@click='deleteUrl')
                                i.icon.el-icon-error
                            el-image( :src='form.url', :preview-src-list='[form.url]')

            span(slot="footer" class="dialog-footer")
                el-button(type='primary', @click='submitData') 提交
                el-button(type='', @click='cancelEdit') 取消
                
</template>

<script>
    export default {
        middleware: 'auth',
        data() {
            return {
                rules: {

                },
                dialogVisible: true,
                form: {
                    name: '',
                    url: ''
                },
                files: [],
                tableData: []
            }
        },
        beforeCreate() {},
        created() {
            this.getData()
            // this.edit()
        },
        beforeMount() {},
        mounted() {},
        methods: {
            submitData() {
                
            },
            cancelEdit() {
                this.form = {}
                this.files = []
                if(this.$refs.upload) {
                    this.$refs.upload.value = null
                }
                this.dialogVisible = false
            },
            deleteUrl() {
                this.form.url = ''
                this.files = []
                if(this.$refs.upload) {
                    this.$refs.upload.value = null
                }
            },
            uploadChange(e) {
                const me = this
                this.files = e.target.files[0]
                const isLt2M = e.target.files[0].size / 1024 / 1024 < 2
                if (!isLt2M) {
                    this.$notify({
                        title: '上传提示',
                        message: '图片大小限制在2M以内',
                        type: 'warning'
                    })
                    return
                }
                let render = new FileReader()
                render.onload = function(res) {
                    me.form.url = res.target.result
                }
                render.readAsDataURL(e.target.files[0])
                // this.form.url = window.URL.createObjectURL(e.target.files[0])
                // console.log(window.URL.createObjectURL(e.target.files[0]), e.target.files[0])
            },
            // 编辑
            async edit() {
                let params = {
                    name: '岑石',
                    url: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'
                }
                let _res = await this.$store.dispatch('swiperEdit', params)

                console.log(_res)
            },
            async getData() {
                let _res = await this.$store.dispatch('swiper')
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