<template>
  <div class="app-container calendar-list-container">

    <el-card>
      <el-row :gutter="10">
        <div style="float:left;">
          <el-button style="float:left;" type="success" icon="el-icon-circle-plus-outline" @click="handleBackup" v-waves>备份</el-button>
        </div>
      </el-row>

      <el-row :gutter="10" style="margin-top:10px;">
        <el-col :span="24">
          <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%">

            <!-- <el-table-column align="center" label="序号">
              <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column> -->

            <el-table-column  label="表名">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="存储引擎">
              <template slot-scope="scope">
                <span>{{scope.row.engine}}</span>
              </template>
            </el-table-column>

            <el-table-column label="列数">
              <template slot-scope="scope">
                <span>{{scope.row.rows}}</span>
              </template>
            </el-table-column>

            <el-table-column label="大小">
              <template slot-scope="scope">
                <span>{{scope.row.data_length}}</span>
              </template>
            </el-table-column>

            <el-table-column label="排序规则">
              <template slot-scope="scope">
                <span>{{scope.row.collation}}</span>
              </template>
            </el-table-column>

          </el-table>

        </el-col>

      </el-row>

    </el-card>
  </div>
</template>

<script>
import waves from '@/directive/waves/index.js' // 水波纹指令
import { fetchList, databaseBackup } from '@/api/database'

export default {
  name: 'users',
  directives: {
    waves
  },
  components: {

  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = parseInt(response.pager.total)
        this.listLoading = false
      })
    },
    handleBackup() {
      this.$confirm('备份时请勿离开页面, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        databaseBackup({ tables: '' }).then(response => {
          if (response.code === 200) {
            this.$message.success(response.msg)
            this.$router.push({ path: '/admin/database_restore' })
          } else {
            this.$message.error(response.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消备份'
        })
      })
    }
  }
}
</script>
