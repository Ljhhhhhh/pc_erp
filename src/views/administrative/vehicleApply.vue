<template>
  <div class="app-container calendar-list-container">

    <el-card>
      <el-row :gutter="10">
        <div style="float:left;">
          <el-button style="float:left;" type="success" icon="el-icon-circle-plus-outline" @click="carApplyEdit()" v-waves>新增</el-button>
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
            <el-table-column label="用车类型">
              <template slot-scope="scope">
                <span>{{scope.row.use_car_type_name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="申请人">
              <template slot-scope="scope">
                <div class="content">{{scope.row.apply_nickname}}</div>
              </template>
            </el-table-column>

            <el-table-column label="联系人">
              <template slot-scope="scope">
                <span>{{scope.row.linkman}}</span>
              </template>
            </el-table-column>

            <el-table-column label="司机">
              <template slot-scope="scope">
                <div class="content">{{scope.row.driver}}</div>
              </template>
            </el-table-column>

            <el-table-column label="具体事由">
              <template slot-scope="scope">
                <span>{{scope.row.apply_reason}}</span>
              </template>
            </el-table-column>

            <el-table-column label="发车时间">
              <template slot-scope="scope">
                <span>{{scope.row.car_set_out_time}}</span>
              </template>
            </el-table-column>

            <el-table-column label="发车地点">
              <template slot-scope="scope">
                <span>{{scope.row.car_set_out_address}}</span>
              </template>
            </el-table-column>

            <el-table-column label="车型名称">
              <template slot-scope="scope">
                <span>{{scope.row.car_type_name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="车牌号">
              <template slot-scope="scope">
                <span>{{scope.row.car_no}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-view" type="success" v-waves @click="applyDetail(scope.row.id)">
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
    manageCarsList
  } from '@/api/administrative/vehicle_apply'
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
        manageCarsList(this.listQuery).then(response => {
          this.list = response.data
          console.log(this.list)
          this.total = parseInt(response.pager.total)
          this.listLoading = false
        })
      },
      applyDetail(id) {
        this.$router.push({
          name: 'carApplyDetail',
          query: {
            id
          }
        })
      },
      carApplyEdit(id) {
        let query = {}
        if (id) {
          query = {
            id
          }
        }
        this.$router.push({
          name: 'addCarApply',
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
