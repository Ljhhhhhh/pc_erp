<template>
  <div class="app-container calendar-list-container">

    <el-card>
      <el-row :gutter="10">
        <div style="float:left;">
          <el-button style="float:left;" type="success" icon="el-icon-circle-plus-outline" @click="createLeave()"
            v-waves>新增</el-button>
        </div>
        <el-col :span="8" style="margin-left:50px;">
          <el-input placeholder="请输入内容" v-model="listQuery.search_key" @keyup.enter.native="handleSearch">
            <el-button slot="append" icon="el-icon-search" v-waves @click="handleSearch">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-row :gutter="10" style="margin-top:10px;">
        <el-col :span="24">
          <el-table :data="list" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%">

            <el-table-column label="姓名">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="职务">
              <template slot-scope="scope">
                <span>{{scope.row.duty}}</span>
              </template>
            </el-table-column>

            <el-table-column label="请假开始时间">
              <template slot-scope="scope">
                <span>{{scope.row.start_leave_time}}</span>
              </template>
            </el-table-column>

            <el-table-column label="请假结束时间">
              <template slot-scope="scope">
                <span>{{scope.row.end_leave_time}}</span>
              </template>
            </el-table-column>

            <el-table-column label="请假天数">
              <template slot-scope="scope">
                <span>{{scope.row.leave_days}}</span>
              </template>
            </el-table-column>

            <el-table-column label="请假类型">
              <template slot-scope="scope">
                <span>{{scope.row.leave_type_name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="状态">
              <template slot-scope="scope">
                <span>{{leave_status[scope.row.status]}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-view" type="success" v-waves @click="leaveDetail(scope.row.id)">
                </el-button>
                <el-button v-if="scope.row.status === 0" size="mini" icon="el-icon-edit" type="primary" v-waves @click="leaveEdit(scope.row.id)">
                </el-button>
                <el-button v-if="scope.row.status === 0" size="mini" icon="el-icon-delete" type="warning" v-waves
                  @click="manageDeleteLeave(scope.row)">
                </el-button>
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
  import pagination from '@/components/Common/Pagination'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {
    manageLeaveList,
    deleteLeave
  } from '@/api/administrative/leave'
  export default {
    name: 'proposalsDate',
    directives: {
      waves
    },
    components: {
      pagination
    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        leave_status: {
          0: '草稿',
          1: '流程中',
          10: '完成'
        },
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
        manageLeaveList(this.listQuery).then(response => {
          this.list = response.data
          console.log(this.list)
          this.total = parseInt(response.pager.total)
          this.listLoading = false
        })
      },
      createLeave(id) {
        let query = {}
        if (id) {
          query = {
            id
          }
        }
        this.$router.push({
          name: 'editLeave',
          query
        })
      },
      manageDeleteLeave(row) {
        this.$confirm('此操作将删除该会议, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLeave(row.id).then(response => {
            if (response.code === 200) {
              this.getList()
              this.$message.success('删除成功')
            } else {
              this.$message.error(response.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      leaveDetail(id) {
        this.$router.push({
          name: 'leaveDetail',
          query: {
            id
          }
        })
      },
      leaveEdit(id) {
        let query = {}
        if (id) {
          query = {
            id
          }
        }
        this.$router.push({
          name: 'editLeave',
          query
        })
      },
      handleSearch() {
        this.listQuery.page = 1
        this.getList()
      }
    }
  }

</script>
