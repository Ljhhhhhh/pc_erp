<template>
  <div class="app-container calendar-list-container">
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8" style="margin-left:0px;">
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

            <el-table-column label="用户名">
              <template slot-scope="scope">
                <span>{{scope.row.username}}</span>
              </template>
            </el-table-column>

            <el-table-column label="事件">
              <template slot-scope="scope">
                <span>{{scope.row.login_info}}</span>
              </template>
            </el-table-column>

            <el-table-column label="ip地址">
              <template slot-scope="scope">
                <span>{{scope.row.ip}}</span>
              </template>
            </el-table-column>

            <el-table-column label="时间">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination @pagination="getList" :total="total" :currentPage.sync="listQuery.page" :page_size.sync="listQuery.page_size">
          </pagination>
        </el-col>

      </el-row>

    </el-card>
  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { fetchLoginLogList } from '@/api/admin'
  import pagination from '@/components/Common/Pagination'

  export default {
    name: 'users',
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
        fetchLoginLogList(this.listQuery).then(response => {
          this.list = response.data
          this.total = parseInt(response.pager.total)
          this.listLoading = false
        })
      },
      handleSearch() {
        this.listQuery.page = 1
        this.getList()
      }
    }
  }
</script>
