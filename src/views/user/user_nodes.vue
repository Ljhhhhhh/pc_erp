<template>
  <div class="app-container calendar-list-container">

    <el-card>
      <el-row :gutter="10">
        <div style="float:left;">
          <el-button style="float:left;" type="success" icon="el-icon-circle-plus-outline" @click="addNodeDialog" v-waves>新增</el-button>
        </div>
      </el-row>

      <el-row :gutter="10" style="margin-top:10px;">
        <el-col :span="24">
          <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="序号" type="index">
            </el-table-column>

            <el-table-column label="节点名称">
              <template slot-scope="scope">
                <div v-html="scope.row.name_format"></div>
              </template>
            </el-table-column>
            <el-table-column label="Module">
              <template slot-scope="scope">
                <div>{{scope.row.module_name}}</div>
              </template>
            </el-table-column>
            <el-table-column label="Controller">
              <template slot-scope="scope">
                <div>{{scope.row.controller_name}}</div>
              </template>
            </el-table-column>
            <el-table-column label="Action">
              <template slot-scope="scope">
                <div>{{scope.row.action_name}}</div>
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <div>{{scope.row.remark}}</div>
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.create_time | formatUnixDate}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="编辑" width="150px" fixed="right">
              <template slot-scope="scope">
                  <el-button v-if="scope.row.edit!=true" size="mini" icon="el-icon-edit" type="primary" v-waves @click="editNodeDialog(scope.row)">
                  </el-button>
                  <el-button v-if="scope.row.edit!=false" size="mini" icon="el-icon-delete" type="warning" v-waves @click="deleteNode(scope.row)">
                  </el-button>
              </template>
            </el-table-column>

          </el-table>


        </el-col>

      </el-row>

      <dialogSaveNode :parent-node="list" :edit-info="editInfo" :form-type="formType" :visible.sync="showNodeDialog" @updateList="getList"></dialogSaveNode>

    </el-card>
  </div>
</template>

<script>
  import dialogSaveNode from './components/dialogSaveNode.vue'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {
    nodesList,
    deleteNode
  } from '@/api/user/user_nodes.js'
  import pagination from '@/components/Common/Pagination'

  export default {
    name: 'users_nodes',
    directives: {
      waves
    },
    components: {
      dialogSaveNode,
      pagination
    },
    data() {
      return {
        formType: 'create',
        list: null,
        listLoading: true,
        listQuery: {
          page: 1,
          page_size: 10,
          search_key: ''
        },
        showNodeDialog: false,
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
        nodesList(this.listQuery).then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      addNodeDialog() {
        this.formType = 'create'
        this.editInfo = {}
        this.showNodeDialog = true
      },
      editNodeDialog(row) {
        this.editInfo = Object.assign({}, row)
        console.log('editinfo:', this.editInfo) // 这样就不会共用同一个对象(弹窗里的值修改，不会影响本行数据)
        this.formType = 'update'
        this.showNodeDialog = true
      },
      deleteNode(row) {
        this.$confirm('此操作将删除该节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteNode(row.id).then(response => {
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
