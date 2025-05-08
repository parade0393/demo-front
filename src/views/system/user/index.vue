<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Edit, Delete } from '@element-plus/icons-vue'
import { deptApi, userApi } from '@/api'
import type { DeptItem, UserItem, UserQueryParams } from '@/api'

// 部门树数据
const deptTreeData = ref<DeptItem[]>([])
// 当前选中的部门ID
const currentDeptId = ref<number | undefined>(undefined)
// 用户列表数据
const userTableData = ref<UserItem[]>([])
// 表格加载状态
const tableLoading = ref(false)
// 分页信息
const pagination = reactive({
  total: 0,
  current: 1,
  size: 10,
})

// 查询参数
const queryParams = reactive<UserQueryParams>({
  deptId: undefined,
  current: 1,
  size: 10,
})

// 获取部门树数据
const fetchDeptTree = async () => {
  try {
    const res = await deptApi.fetchDeptTreeApi()
    deptTreeData.value = res
    // 默认选中第一个部门
    if (res.length > 0) {
      currentDeptId.value = res[0].id
      queryParams.deptId = res[0].id
      fetchUserList()
    }
  } catch (error) {
    console.error('获取部门树失败', error)
    ElMessage.error('获取部门树失败')
  }
}

// 获取用户列表数据
const fetchUserList = async () => {
  tableLoading.value = true
  try {
    const res = await userApi.fetchUserPageApi(queryParams)
    userTableData.value = res.records
    pagination.total = res.total
    pagination.current = res.current
    pagination.size = res.size
  } catch (error) {
    console.error('获取用户列表失败', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    tableLoading.value = false
  }
}

// 处理部门点击事件
const handleDeptClick = (dept: DeptItem) => {
  currentDeptId.value = dept.id
  queryParams.deptId = dept.id
  queryParams.current = 1 // 重置页码
  fetchUserList()
}

// 处理分页变化
const handleCurrentChange = (current: number) => {
  queryParams.current = current
  fetchUserList()
}

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  queryParams.size = size
  queryParams.current = 1 // 重置页码
  fetchUserList()
}

// 刷新用户列表
const refreshUserList = () => {
  fetchUserList()
}

// 监听查询参数变化
watch(
  () => queryParams,
  () => {
    fetchUserList()
  },
  { deep: true },
)

// 页面加载时获取数据
onMounted(() => {
  fetchDeptTree()
})
</script>

<template>
  <div class="user-container">
    <!-- 左侧部门树 -->
    <div class="dept-tree-container">
      <el-card class="dept-tree-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>部门列表</span>
          </div>
        </template>
        <el-tree
          :data="deptTreeData"
          node-key="id"
          :props="{ label: 'name', children: 'children' }"
          :highlight-current="true"
          :default-expand-all="true"
          @node-click="handleDeptClick"
        >
          <template #default="{ node }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </el-card>
    </div>

    <!-- 右侧用户列表 -->
    <div class="user-list-container">
      <el-card class="user-list-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>用户列表</span>
            <div class="header-operations">
              <el-button :icon="Refresh" circle @click="refreshUserList" />
            </div>
          </div>
        </template>

        <!-- 用户表格 -->
        <el-table v-loading="tableLoading" :data="userTableData" style="width: 100%" border stripe>
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="username" label="用户名" min-width="100" />
          <el-table-column prop="name" label="姓名" min-width="100" />
          <el-table-column prop="deptName" label="所属部门" min-width="120" />
          <el-table-column prop="phone" label="手机号码" min-width="120" />
          <el-table-column prop="email" label="邮箱" min-width="150" />
          <el-table-column prop="statusName" label="状态" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.statusName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="160" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template>
              <el-button type="primary" :icon="Edit" link>编辑</el-button>
              <el-button type="danger" :icon="Delete" link>删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.size"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-container {
  display: flex;
  height: 100%;
  gap: 16px;

  .dept-tree-container {
    width: 280px;
    flex-shrink: 0;

    .dept-tree-card {
      height: 100%;
    }
  }

  .user-list-container {
    flex: 1;
    overflow: hidden;

    .user-list-card {
      height: 100%;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-operations {
      display: flex;
      gap: 8px;
    }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
