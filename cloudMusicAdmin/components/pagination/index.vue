<style lang="sass" scoped>
  .el-pagination
    padding: 10px 5px
    text-align: right
</style>
<template>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 40, 60, 80,100]"
      :page-size="pageSize"
      layout="sizes, total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    total: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleSizeChange(val) {
      const me = this;
      me.$emit("handleChange", {type: 'size', value: val});
      return false;
    },
    handleCurrentChange(val) {
      const me = this;
      me.$emit("handleChange", {type: 'page', value: val});
      return false;
    }
  }
};
</script>

