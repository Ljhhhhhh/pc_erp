<template>
  <div class="app-container calendar-list-container">

    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="listQuery.search_key" @keyup.enter.native="handleSearch">
            <el-button slot="append" icon="el-icon-search" v-waves >搜索</el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-row :gutter="10" style="margin-top:10px;">
        <el-col :span="24">
          <el-table :data="list" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="序号" type="index">
            </el-table-column>

            <el-table-column label="交办日期">
              <template slot-scope="scope">
                <span>{{scope.row.designated_time === 0?'':scope.row.designated_time}}</span>
              </template>
            </el-table-column>

            <el-table-column label="事项名称">
              <template slot-scope="scope">
                <div class="content" v-html="scope.row.proposal_title"></div>
              </template>
            </el-table-column>

            <el-table-column label="负责人">
              <template slot-scope="scope">
                <span>{{scope.row.designated_uid_nickname}}</span>
              </template>
            </el-table-column>

            <el-table-column label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.designated_uid_nickname ===''?'未交办':'已交办'}}</span>
              </template>
            </el-table-column>

            <el-table-column label="结果">
              <template slot-scope="scope">
                <span>{{proposals_over_status[scope.row.designated_status]}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-view" type="success" v-waves @click="proposalsDateDetail(scope.row.id)">
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
  proposalsOverList
} from '@/api/meeting/proposals_date'
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
      proposals_over_status: {
        0: '进行中',
        1: '交办完成',
        2: '未完成'
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
      proposalsOverList(this.listQuery).then(response => {
        this.list = response.data
        this.total = parseInt(response.pager.total)
        this.listLoading = false
      })
    },
    proposalsDateDetail(id) {
      let query = {}
      if (id) {
        query = {
          id
        }
      }
      this.$router.push({
        name: 'proposalsDateDetail',
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
