<template>
  <div class="app-container calendar-list-container">

    <el-card>
      <el-row :gutter="10">
        <div style="float:left;">
          <el-button style="float:left;" type="success" icon="el-icon-circle-plus-outline" @click="goWorkflowEdit" v-waves>新增</el-button>
        </div>
        <el-col :span="8" style="margin-left:50px;">
          <el-input placeholder="请输入内容" v-model="listQuery.search_key" @keyup.enter.native="handleSearch">
            <el-button slot="append" icon="el-icon-search" v-waves @click="handleSearch">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-row :gutter="10" style="margin-top:10px;">
        <el-col :span="24">
          <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="序号" type="index">
            </el-table-column>

            <el-table-column label="流程标识">
              <template slot-scope="scope">
                <span>{{scope.row.sign}}</span>
              </template>
            </el-table-column>

            <el-table-column label="流程名称">
              <template slot-scope="scope">
                <span>{{scope.row.workflow_name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="流程描述">
              <template slot-scope="scope">
                <span>{{scope.row.description}}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.create_time | formatUnixDate}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="编辑" width="150px" fixed="right">
              <template slot-scope="scope">
                  <el-button v-if="scope.row.edit!=true" size="mini" icon="el-icon-edit" type="primary" v-waves @click="goWorkflowEdit(scope.row)">
                  </el-button>
                  <el-button v-if="scope.row.edit!=false" size="mini" icon="el-icon-delete" type="warning" v-waves @click="deleteUser(scope.row)">
                  </el-button>
              </template>
            </el-table-column>

          </el-table>

          <pagination @pagination="getList" :total="total" :current_page.sync="listQuery.page" :page_size.sync="listQuery.page_size">
          </pagination>

        </el-col>

      </el-row>

    </el-card>
    <router-view></router-view>
  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {
    fetchWorkflow,
    deleteWorkflow
  } from '@/api/user/workflow'
  import pagination from '@/components/Common/Pagination'

  export default {
    name: 'workflow',
    directives: {
      waves
    },
    components: {
      pagination
    },
    data() {
      return {
        formType: 'create',
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          page_size: 10,
          search_key: ''
        },
        showUserDialog: false,
        editInfo: {},
        importLoading: false,
        uploadUrl: '/upload/index?token=',
        downloadCustomerTemplateUrl: 'customer.xlsx'
      }
    },
    created() {
      this.getList()
    },
    watch: {
      $route(to, from) {
        if (from.name === 'workflowEdit') {
          this.getList()
        }
      }
    },
    methods: {
      goWorkflowEdit(row) {
        const query = {
          id: row.id || null
        }
        console.log(query)
        this.$router.push({
          path: 'workflow_edit',
          query: query
        })
      },
      getList() {
        this.listLoading = true
        fetchWorkflow(this.listQuery).then(response => {
          this.list = response.data.map(item => {
            this.$set(item, 'avatar', process.env.BASE_API + item.headimg)
            return item
          })
          this.total = parseInt(response.pager.total)
          this.listLoading = false
        })
      },
      deleteUser(row) {
        this.$confirm('此操作将删除该供应商, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteWorkflow(row.id).then(response => {
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
      handleSearch() {
        this.listQuery.page = 1
        this.getList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .avatar {
    width: 50px;
    height: 50px;
    display: block;
    margin: 0 auto;
  }
</style>
