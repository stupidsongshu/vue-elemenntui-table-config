<template>
  <div class="block">
    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="total"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      default: 30
    },
    total: {
      type: Number,
      required: true
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.$emit('reloadResult', val)
    }
  }
}
</script>
