<template>
  <div class="app-container calendar-list-container">

    <el-card>
      <el-row :gutter="10">
        <!-- <div style="float:left;">
          <el-button style="float:left;" type="success" icon="el-icon-circle-plus-outline" @click="addUserDialog" v-waves>新增</el-button>
        </div> -->

      </el-row>

      <el-row :gutter="10" style="margin-top:10px;">
        <el-col :span="24">
          <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="文件名">
              <template slot-scope="scope">
                <span>{{scope.row.filename}}</span>
              </template>
            </el-table-column>

            <el-table-column width="80px" label="大小">
              <template slot-scope="scope">
                <span>{{scope.row.size}}</span>
              </template>
            </el-table-column>

            <el-table-column label="压缩方式">
              <template slot-scope="scope">
                <span>{{scope.row.compress}}</span>
              </template>
            </el-table-column>

            <el-table-column label="分卷数">
              <template slot-scope="scope">
                <span>{{scope.row.part}}</span>
              </template>
            </el-table-column>

            <el-table-column label="数据表数">
              <template slot-scope="scope">
                <span>{{scope.row.tables_num}}</span>
              </template>
            </el-table-column>

            <el-table-column label="备份时间">
              <template slot-scope="scope">
                <span>{{scope.row.time}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="150px" fixed="right">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="还原" placement="top">
                  <el-button  size="mini" icon="el-icon-back" type="warning" v-waves @click="handleRestore(scope.row)">
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>

          </el-table>

          <pagination @pagination="getList" :total="total" :current_page.sync="listQuery.page" :page_size.sync="listQuery.page_size">
          </pagination>


        </el-col>

      </el-row>

    </el-card>
  </div>
</template>

<script>
import waves from '@/directive/waves/index.js' // 水波纹指令
import { fetchBackupList, restoreDatabase } from '@/api/database'
import pagination from '@/components/Common/Pagination'

export default {
  name: 'users',
  directives: {
    waves
  },
  components: {
    // dialogSaveUser,
    pagination
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        search_key: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchBackupList(this.listQuery).then(response => {
        this.list = response.data
        this.total = parseInt(response.pager.total)
        this.listLoading = false
      })
    },
    handleRestore(row) {
      this.$confirm('还原过程中请勿离开页面, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        restoreDatabase({ filename: row.filename }).then(response => {
          if (response.code === 200) {
            this.$message.success(response.msg)
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
