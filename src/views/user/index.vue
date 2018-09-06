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

            <el-table-column align="center" label="序号" type="index">
            </el-table-column>

            <el-table-column width="80px" label="用户头像">
              <template slot-scope="scope">
                <img :src="scope.row.avatar" width="50em" height="50em" alt="">
              </template>
            </el-table-column>

            <el-table-column label="用户名称">
              <template slot-scope="scope">
                <span>{{scope.row.username}}</span>
              </template>
            </el-table-column>

            <el-table-column label="部门">
              <template slot-scope="scope">
                <span>{{scope.row.group_name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="职位">
              <template slot-scope="scope">
                <span>{{scope.row.position_name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="性别">
              <template slot-scope="scope">
                <span>{{scope.row.sex_name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="QQ">
              <template slot-scope="scope">
                <span>{{scope.row.qq}}</span>
              </template>
            </el-table-column>

            <el-table-column label="手机">
              <template slot-scope="scope">
                <span>{{scope.row.phone}}</span>
              </template>
            </el-table-column>

            <el-table-column label="邮箱">
              <template slot-scope="scope">
                <span>{{scope.row.email}}</span>
              </template>
            </el-table-column>

            <el-table-column label="所属角色">
              <template slot-scope="scope">
                <span>{{scope.row.role_names}}</span>
              </template>
            </el-table-column>

            <el-table-column label="地址">
              <template slot-scope="scope">
                <span>{{scope.row.address}}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
              </template>
            </el-table-column>

            <el-table-column label="备注">
              <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="编辑" width="150px" fixed="right">
              <template slot-scope="scope">
                  <el-button v-if="scope.row.edit!=true" size="mini" icon="el-icon-edit" type="primary" v-waves @click="editUserDialog(scope.row)">
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

      <dialogSaveUser :edit-info="editInfo" :form-type="formType" :visible.sync="showUserDialog" @updateList="getList"></dialogSaveUser>

    </el-card>
  </div>
</template>

<script>
  import dialogSaveUser from './components/dialogSaveUser.vue'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {
    fetchList,
    deleteUser
  } from '@/api/user/user'
  import pagination from '@/components/Common/Pagination'

  export default {
    name: 'users',
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
          this.list = response.data.map(v => {
            this.$set(v, 'avatar', process.env.BASE_API + v.headimg)
            return v
          })
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
        this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(row.id).then(response => {
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
