<template>
  <div>
    <el-dialog :title="title" :visible="visible" :before-close="handleClose" width="80%">
      <div class="app-container calendar-list-container">

        <el-card>
          <el-row :gutter="10">
            <el-col :span="8" style="margin-left:50px;">
              <el-input placeholder="请输入内容" v-model="listQuery.search_key" @keyup.enter.native="handleSearch">
                <el-button slot="append" icon="el-icon-search" v-waves @click="handleSearch">搜索</el-button>
              </el-input>
            </el-col>
          </el-row>

          <el-row :gutter="10" style="margin-top:10px;">
            <el-col :span="24">
              <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%" @current-change="handleCurrentChange">

                <el-table-column align="center" label="序号">
                  <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                  </template>
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

                <el-table-column label="真实姓名">
                  <template slot-scope="scope">
                    <span>{{scope.row.realname}}</span>
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

              </el-table>

              <pagination @pagination="getUserList" :total="total" :current_page.sync="listQuery.page" :page_size.sync="listQuery.page_size">
              </pagination>

            </el-col>

          </el-row>

        </el-card>
      </div>
      <div slot="footer" class="dialog-footer" style="width:100%;margin:auto;text-align: center;">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="setLeader()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList } from '@/api/user/user'
import pagination from '@/components/Common/Pagination'
import waves from '@/directive/waves/index.js'

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  directives: {
    waves
  },
  data() {
    return {
      checkedLeader: {},
      title: '选择负责人',
      listLoading: true,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        page_size: 10,
        search_key: ''
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    setLeader() {
      const leader = {
        manager_uid: this.checkedLeader.id,
        manager_realname: this.checkedLeader.realname
      }
      this.$emit('setLeader', leader)
      this.$emit('update:visible', false)
    },
    handleCurrentChange(val) {
      console.log(val)
      this.checkedLeader = val
    },
    handleSearch() {
      this.listQuery.page = 1
      this.getUserList()
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    getUserList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.map(v => {
          this.$set(v, 'avatar', process.env.BASE_API + v.headimg)
          return v
        })
        this.total = parseInt(response.pager.total)
        this.listLoading = false
      })
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>

</style>
