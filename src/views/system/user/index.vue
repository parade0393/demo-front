<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Plus, Edit, View } from '@element-plus/icons-vue'
import { deptApi, userApi, roleApi } from '@/api'
import type { DeptItem, UserItem, UserQueryParams, UserFormData, RoleItem } from '@/api'

// 部门树数据
const deptTreeData = ref<DeptItem[]>([])
// 当前选中的部门ID
const currentDeptId = ref<number | undefined>(undefined)
// 用户列表数据
const userTableData = ref<UserItem[]>([])
// 表格加载状态
const tableLoading = ref(false)
// 角色列表数据
const roleListData = ref<RoleItem[]>([])
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

// 用户表单对话框相关
const userFormDialogVisible = ref(false)
const userFormTitle = ref('新增用户')
const userFormLoading = ref(false)
const userForm = reactive<UserFormData>({
  username: '',
  name: '',
  phone: '',
  email: '',
  deptId: 0,
  avatar: null,
  status: 1,
  remark: null,
  roleIds: [],
})
const userFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email' as const, message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }],
}
const userFormRef = ref()

// 用户详情对话框相关
const userDetailDialogVisible = ref(false)
const userDetail = ref<UserItem | null>(null)
const userDetailLoading = ref(false)

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

// 获取角色列表数据
const fetchRoleList = async () => {
  try {
    const res = await roleApi.fetchRoleListApi()
    roleListData.value = res.filter((role) => role.status === 1) // 只显示正常状态的角色
  } catch (error) {
    console.error('获取角色列表失败', error)
    ElMessage.error('获取角色列表失败')
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

// 重置用户表单
const resetUserForm = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
  Object.assign(userForm, {
    username: '',
    name: '',
    phone: '',
    email: '',
    deptId: currentDeptId.value || 0,
    avatar: null,
    status: 1,
    remark: null,
    roleIds: [],
    password: '',
  })
}

// 打开新增用户对话框
const handleAddUser = () => {
  userFormTitle.value = '新增用户'
  resetUserForm()
  userFormDialogVisible.value = true
}

// 打开编辑用户对话框
const handleEditUser = async (row: UserItem) => {
  userFormTitle.value = '编辑用户'
  resetUserForm()
  userFormLoading.value = true
  try {
    const res = await userApi.getUserDetailApi(row.id)
    // 填充表单数据
    Object.assign(userForm, {
      id: res.id,
      username: res.username,
      name: res.name,
      phone: res.phone,
      email: res.email,
      deptId: res.deptId,
      avatar: res.avatar,
      status: res.status,
      remark: res.remark,
      roleIds: res.roleIds,
    })
    userFormDialogVisible.value = true
  } catch (error) {
    console.error('获取用户详情失败', error)
    ElMessage.error('获取用户详情失败')
  } finally {
    userFormLoading.value = false
  }
}

// 查看用户详情
const handleViewUser = async (row: UserItem) => {
  userDetailLoading.value = true
  try {
    const res = await userApi.getUserDetailApi(row.id)
    userDetail.value = res
    userDetailDialogVisible.value = true
  } catch (error) {
    console.error('获取用户详情失败', error)
    ElMessage.error('获取用户详情失败')
  } finally {
    userDetailLoading.value = false
  }
}

// 提交用户表单
const submitUserForm = async () => {
  if (!userFormRef.value) return

  await userFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    userFormLoading.value = true
    try {
      if (userForm.id) {
        // 编辑用户
        await userApi.updateUserApi(userForm)
        ElMessage.success('编辑用户成功')
      } else {
        // 新增用户
        await userApi.createUserApi(userForm)
        ElMessage.success('新增用户成功')
      }
      userFormDialogVisible.value = false
      fetchUserList()
    } catch (error) {
      console.error('保存用户失败', error)
      ElMessage.error('保存用户失败')
    } finally {
      userFormLoading.value = false
    }
  })
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
  fetchRoleList()
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
          :expand-on-click-node="false"
          :current-node-key="currentDeptId"
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
              <el-button type="primary" :icon="Plus" @click="handleAddUser">新增</el-button>
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
            <template #default="{ row }">
              <el-button type="primary" :icon="View" link @click="handleViewUser(row)"
                >查看</el-button
              >
              <el-button type="primary" :icon="Edit" link @click="handleEditUser(row)"
                >编辑</el-button
              >
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

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="userFormDialogVisible"
      :title="userFormTitle"
      width="600px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="80px"
        v-loading="userFormLoading"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!userForm.id">
          <el-input
            v-model="userForm.password"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-tree-select
            v-model="userForm.deptId"
            :data="deptTreeData"
            :props="{ label: 'name', children: 'children', value: 'id' }"
            placeholder="请选择部门"
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="userForm.roleIds"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="role in roleListData"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="userFormDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUserForm" :loading="userFormLoading"
          >确定</el-button
        >
      </template>
    </el-dialog>

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="userDetailDialogVisible"
      title="用户详情"
      width="600px"
      :destroy-on-close="true"
    >
      <el-descriptions :column="2" border v-loading="userDetailLoading">
        <el-descriptions-item label="用户名">{{ userDetail?.username }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ userDetail?.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ userDetail?.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ userDetail?.email }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ userDetail?.deptName }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="userDetail?.status === 1 ? 'success' : 'danger'">
            {{ userDetail?.statusName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="角色" :span="2">
          <el-tag v-for="role in userDetail?.roleNames" :key="role" class="role-tag">{{
            role
          }}</el-tag>
          <span v-if="!userDetail?.roleNames?.length">无</span>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{
          userDetail?.remark || '无'
        }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{
          userDetail?.createTime
        }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="userDetailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
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

  .role-tag {
    margin-right: 8px;
  }
}
</style>
