<template>
  <div class="app-container calendar-list-container">

    <el-card>
      <el-row :gutter="10">
        <div style="float:left;">
          <el-button style="float:left;" type="success" icon="el-icon-circle-plus-outline" @click="addUserDialog" v-waves>新增</el-button>
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

            <el-table-column align="center" label="ID">
              <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>

            <el-table-column label="职位名称">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="职位描述">
              <template slot-scope="scope">
                <span>{{scope.row.description}}</span>
              </template>
            </el-table-column>

            <el-table-column label="排序">
              <template slot-scope="scope">
                <span>{{scope.row.sort}}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.create_time | formatUnixDate}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="编辑" width="150px" fixed="right">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <el-button v-if="scope.row.edit!=true" size="mini" icon="el-icon-edit" type="primary" v-waves @click="editUserDialog(scope.row)">
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button v-if="scope.row.edit!=false" size="mini" icon="el-icon-delete" type="warning" v-waves @click="deleteUser(scope.row)">
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>

          </el-table>

          <pagination @pagination="getList" :total="total" :current_page.sync="listQuery.page" :page_size.sync="listQuery.page_size">
          </pagination>

        </el-col>

      </el-row>

      <dialogSaveUser :edit-info="editInfo" :form-type="formType" :visible.sync="showUserDialog" @updateList="getList"></dialogSaveUser>

    </el-card>
  </div>
</template>

<script>
  import dialogSaveUser from './components/dialogSaveUser.vue'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {
    fetchList,
    deletePosition
  } from '@/api/position'
  import pagination from '@/components/Common/Pagination'

  export default {
    name: 'position',
    directives: {
      waves
    },
    components: {
      dialogSaveUser,
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
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data
          this.total = parseInt(response.pager.total)
          this.listLoading = false
        })
      },
      addUserDialog() {
        this.formType = 'create'
        this.editInfo = {}
        this.showUserDialog = true
      },
      editUserDialog(row) {
        this.editInfo = Object.assign({}, row) // 这样就不会共用同一个对象(弹窗里的值修改，不会影响本行数据)
        this.formType = 'update'
        this.showUserDialog = true
      },
      deleteUser(row) {
        this.$confirm('此操作将删除该职位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePosition(row.id).then(response => {
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
