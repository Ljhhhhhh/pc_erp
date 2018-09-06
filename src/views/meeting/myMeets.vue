<template>
  <div class="app-container calendar-list-container">

    <el-card>
      <el-row :gutter="10">
        <div style="float:left;">
          <el-button style="float:left;" type="success" icon="el-icon-circle-plus-outline" @click="proposalsEdit()" v-waves>新增</el-button>
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

            <el-table-column label="会议类型">
              <template slot-scope="scope">
                <span>{{meet_type_arr[scope.row.meet_type_id]}}</span>
              </template>
            </el-table-column>

            <el-table-column label="会议地址">
              <template slot-scope="scope">
                <span v-html="scope.row.meet_address"></span>
              </template>
            </el-table-column>

            <el-table-column label="申请人">
              <template slot-scope="scope">
                <span v-html="scope.row.apply_nickname"></span>
              </template>
            </el-table-column>

            <el-table-column label="会议开始时间">
              <template slot-scope="scope">
                <span>{{scope.row.start_time}}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="编辑" width="150px" fixed="right">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status === 0" size="mini" icon="el-icon-view" type="success" v-waves @click="proposalsEdit(scope.row.id, 0)">
                </el-button>
                <el-button v-if="scope.row.status === 0" size="mini" icon="el-icon-edit" type="primary" v-waves @click="proposalsEdit(scope.row.id)">
                </el-button>
                <el-button v-if="scope.row.status === 0" size="mini" icon="el-icon-delete" type="warning" v-waves @click="deleteProposal(scope.row)">
                </el-button>
                <span v-if="scope.row.status !== 0">流程中</span>
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
    myMeets
  } from '@/api/meeting/my_meets'
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
        meet_type_arr: ['党政班子会议', '三重一大会议', '党委会'],
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
        myMeets(this.listQuery).then(response => {
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
          name: 'meetingEdit',
          query
        })
      },
      handleSearch() {
        this.listQuery.page = 1
        this.getList()
      }
    }
    // watch: {
    //   $route(to, from) {
    //     if (from.name === 'meetingEdit') {
    //       this.getList()
    //     }
    //   }
    // }
  }
</script>
