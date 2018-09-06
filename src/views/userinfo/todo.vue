<template>
  <div class="app-container calendar-list-container">

    <el-card>

      <el-row :gutter="10" style="margin-top:10px;">
        <el-col :span="24">
          <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="序号" type="index"></el-table-column>

            <el-table-column label="事件名称">
              <template slot-scope="scope">
                <span>{{scope.row.apply_title}}</span>
              </template>
            </el-table-column>

            <el-table-column label="流程名称">
              <template slot-scope="scope">
                <span>{{scope.row.workflow_name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="申请人">
              <template slot-scope="scope">
                <span>{{scope.row.apply_nickname}}</span>
              </template>
            </el-table-column>

            <el-table-column label="接受时间">
              <template slot-scope="scope">
                <span>{{scope.row.receive_time}}</span>
              </template>
            </el-table-column>

            <el-table-column label="申请时间">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>

            <el-table-column label="待办分类">
              <template slot-scope="scope">
                <span>{{scope.row.apply_process_type_name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="当前状态">
              <template slot-scope="scope">
                <span>{{getStausName(scope.row)}}</span>
              </template>
            </el-table-column>

            <el-table-column label="查看" width="100px" align="center">
              <template slot-scope="scope">
                  <el-button v-if="scope.row.edit!=true" size="mini" icon="el-icon-view" type="success" v-waves @click="getDetail(scope.row)">
                  </el-button>
              </template>
            </el-table-column>

          </el-table>

          <pagination @pagination="getList" :total="total" :current_page.sync="listQuery.page" :page_size.sync="listQuery.page_size">
          </pagination>


        </el-col>

      </el-row>

      <dialogTodo :applyId="applyId" :applyType="applyType" :visible.sync="showDetail" @updateList="getList"></dialogTodo>

    </el-card>
  </div>
</template>

<script>
  import dialogTodo from './components/dialogTodo.vue'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {
    todoList,
    doneList
  } from '@/api/user/todo'
  import pagination from '@/components/Common/Pagination'
  import {
    mapGetters
  } from 'vuex'
  import moment from 'moment'
  import statusConfig from './status_config'

  export default {
    name: 'users',
    directives: {
      waves
    },
    components: {
      dialogTodo,
      pagination
    },
    data() {
      return {
        applyId: -1,
        list: null,
        total: null,
        listLoading: true,
        applyType: -1,
        listQuery: {
          page: 1,
          page_size: 10,
          search_key: ''
        },
        showDetail: false,
        importLoading: false
      }
    },
    created() {
      this.getList()
      moment.locale('en', {
        relativeTime: {
          future: '之后 %s',
          past: '%s之前',
          s: '秒',
          m: '一分钟',
          mm: '%d分钟',
          h: '一小时',
          hh: '%d小时',
          d: 'a天',
          dd: '%d天',
          M: '一个月',
          MM: '%d月',
          y: '一年',
          yy: '%d年'
        }
      })
    },
    methods: {
      getStausName(row) {
        return statusConfig[row.is_master][row.status]
      },
      getDetail(row) {
        this.applyId = row.workflow_apply_id
        this.applyType = row.apply_process_type
        this.showDetail = true
      },
      getList() {
        let workflow_type = null
        if (this.$route.name === 'done') {
          workflow_type = doneList
        }
        if (this.$route.name === 'todo') {
          workflow_type = todoList
        }
        this.listLoading = true
        workflow_type().then(response => {
          this.list = response.data
          this.list.forEach(item => {
            item.receive_time = moment(item.create_time).fromNow()
          })
          this.total = parseInt(response.pager.total)
          this.listLoading = false
        })
      }
    },
    computed: {
      ...mapGetters([
        'userinfo'
      ])
    }
  }

</script>
