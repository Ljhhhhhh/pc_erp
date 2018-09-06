<template>
  <div class="app-container calendar-list-container">

    <el-card>
      <el-row :gutter="10">
        <div style="float:left;">
          <el-button style="float:left;" type="success" icon="el-icon-circle-plus-outline" @click="proposalsEdit()"
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
          <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe border fit
            highlight-current-row style="width: 100%">

            <el-table-column align="center" label="序号" type="index">
            </el-table-column>

            <el-table-column label="事项名称">
              <template slot-scope="scope">
                <span>{{scope.row.proposal_title}}</span>
              </template>
            </el-table-column>

            <el-table-column label="事项内容">
              <template slot-scope="scope">
                <div class="content" v-html="scope.row.content"></div>
              </template>
            </el-table-column>

            <el-table-column label="所属会议">
              <template slot-scope="scope">
                <span>{{meet_type_arr[scope.row.meet_type_id]}}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>

            <el-table-column label="事项状态">
              <template slot-scope="scope">
                <span>{{meet_status_map[scope.row.status]}}</span>
              </template>
            </el-table-column>


            <el-table-column align="center" label="编辑" width="150px" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-view" type="success" v-waves @click="proposalsDetail(scope.row.id)">
                </el-button>
                <el-button v-if="scope.row.status === 0" size="mini" icon="el-icon-edit" type="primary" v-waves @click="proposalsEdit(scope.row.id)">
                </el-button>
                <el-button v-if="scope.row.status === 0" size="mini" icon="el-icon-delete" type="warning" v-waves
                  @click="deleteProposal(scope.row)">
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
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {
    proposalsList,
    deleteProposal
  } from '@/api/meeting/proposals'
  import pagination from '@/components/Common/Pagination'

  export default {
    name: 'proposals',
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
        meet_status_map: {
          0: '草稿',
          1: '流程中',
          10: '流程完成',
          11: '事项进行中',
          20: '事项'
        },
        listQuery: {
          page: 1,
          page_size: 10,
          search_key: ''
        },
        meet_type_arr: {
          1: '党政班子会议',
          2: '三重一大会议',
          3: '党委会'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        proposalsList(this.listQuery).then(response => {
          this.list = response.data
          this.total = parseInt(response.pager.total)
          this.listLoading = false
        })
      },
      proposalsEdit(id) {
        let query = {}
        if (id) {
          query = {
            id
          }
        }
        this.$router.push({
          name: 'proposalsEdit',
          query
        })
      },
      proposalsDetail(id) {
        let query = {}
        if (id) {
          query = {
            id
          }
        }
        this.$router.push({
          name: 'proposalsDetail',
          query
        })
      },
      deleteProposal(row) {
        this.$confirm('此操作将删除该事项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProposal(row.id).then(response => {
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
    },
    watch: {
      $route(to, from) {
        if (from.name === 'proposalsEdit') {
          this.getList()
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
  .content {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    height: 64px;
  }

</style>
