<template>
  <section>
    <div class="block">
      <el-pagination :style="{textAlign: 'center'}"
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="current_page"
               :page-sizes="page_sizes"
               :page-size="page_size"
               layout="total, sizes, prev, pager, next, jumper"
               :total="total">
      </el-pagination>
    </div>
  </section>
</template>
<script>
export default {
  props: ['total', 'page_size'],
  data() {
    return {
      page_sizes: [2, 5, 10, 15, 20],
      current_page: 1
    }
  },
  methods: {
    handleSizeChange(page_size) {
      this.$emit('update:page_size', page_size)
      this.$emit('pagination')
    },
    handleCurrentChange(current_page) {
      this.current_page = current_page
      this.$emit('update:current_page', current_page)
      this.$emit('pagination')
    }
  },
  watch: {
  }
}
</script>
<style scoped>
</style>