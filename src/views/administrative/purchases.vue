<template>
  <div class="app-container calendar-list-container">

    <el-card>
      <el-row :gutter="10">
        <div style="float:left;">
          <el-button style="float:left;" type="success" icon="el-icon-circle-plus-outline" @click="createPurchases()"
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

            <el-table-column label="申请科室(工作片)">
              <template slot-scope="scope">
                <span>{{scope.row.apply_nickname}}</span>
              </template>
            </el-table-column>

            <el-table-column label="申请时间">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>

             <el-table-column label="物品清单">
              <template slot-scope="scope">
                <span>{{scope.row.goods_list}}</span>
              </template>
            </el-table-column>

             <el-table-column label="申请理由">
              <template slot-scope="scope">
                <span>{{scope.row.apply_reason}}</span>
              </template>
            </el-table-column>

            <el-table-column label="预算">
              <template slot-scope="scope">
                <span>{{scope.row.budget}}</span>
              </template>
            </el-table-column>

            <el-table-column label="状态">
              <template slot-scope="scope">
                <span></span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-view" type="success" v-waves @click="purchasesDetail(scope.row.id)">
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
    managePurchasesList
  } from '@/api/administrative/purchases'
  export default {
    name: 'purchases',
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
        managePurchasesList(this.listQuery).then(response => {
          this.list = response.data
          console.log(this.list)
          this.total = parseInt(response.pager.total)
          this.listLoading = false
        })
      },
      purchasesDetail(id) {
        this.$router.push({
          name: 'purchasesDetail',
          query: {
            id
          }
        })
      },
      createPurchases(id) {
        let query = {}
        if (id) {
          query = {
            id
          }
        }
        this.$router.push({
          name: 'addPurchases',
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
