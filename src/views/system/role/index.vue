<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import { MoreFilled, Search, Plus } from '@element-plus/icons-vue'
import { roleApi } from '@/api/modules/system/role'
import { menuApi } from '@/api/modules/system/menu'
import type { FormInstance, FormRules } from 'element-plus'
import type { RoleItem } from '@/api/modules/system/role'
import type { MenuItem } from '@/api/modules/system/menu'
import type { UserItem } from '@/api'

// 角色列表数据
const roleList = ref<RoleItem[]>([])
const filteredRoleList = ref<RoleItem[]>([])
const loading = ref(false)
const searchKeyword = ref('')

// 当前选中的角色
const currentRole = ref<RoleItem | null>(null)
const currentRoleId = ref<number>(0)

// 获取角色列表
const fetchRoleList = async () => {
  loading.value = true
  try {
    const res = await roleApi.fetchRoleListApi()
    roleList.value = res
    filterRoles()
    // 默认选中第一个角色
    if (res.length > 0 && !currentRole.value) {
      currentRole.value = res[0]
      currentRoleId.value = res[0].id
      // 加载权限数据
      fetchRoleMenus(res[0].id)
    }
  } catch (error) {
    console.error('获取角色列表失败', error)
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 过滤角色列表
const filterRoles = () => {
  if (!searchKeyword.value) {
    filteredRoleList.value = roleList.value
    return
  }

  const keyword = searchKeyword.value.toLowerCase()
  filteredRoleList.value = roleList.value.filter(
    (role) =>
      role.name.toLowerCase().includes(keyword) || role.code.toLowerCase().includes(keyword),
  )
}

// 选择角色
const handleSelectRole = (role: RoleItem) => {
  currentRole.value = role
  currentRoleId.value = role.id
  // 加载权限数据
  fetchRoleMenus(role.id)
  // 如果在用户标签页，加载用户数据
  if (activeTab.value === 'users') {
    fetchRoleUsers(role.id)
  }
}

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加角色')
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<RoleItem>({
  id: 0,
  name: '',
  code: '',
  status: 1,
  remark: '',
  sort: 0,
  createTime: '',
})

// 表单校验规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { max: 64, message: '角色名称不能超过64个字符', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { max: 64, message: '角色编码不能超过64个字符', trigger: 'blur' },
  ],
  sort: [{ type: 'number', message: '排序值必须为数字', trigger: 'blur' }],
})

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(formData, {
    id: 0,
    name: '',
    code: '',
    status: 1,
    remark: '',
    sort: 0,
    createTime: '',
  })
}

// 打开添加角色对话框
const handleAdd = () => {
  resetForm()
  dialogTitle.value = '添加角色'
  dialogVisible.value = true
}

// 打开编辑角色对话框
const handleEdit = (row: RoleItem) => {
  resetForm()
  dialogTitle.value = '编辑角色'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      const api = formData.id ? roleApi.updateRoleApi : roleApi.addRoleApi
      api(formData)
        .then(() => {
          ElMessage.success(formData.id ? '修改成功' : '添加成功')
          fetchRoleList() // 重新加载数据
        })
        .catch((error) => {
          console.error('保存角色失败', error)
          ElMessage.error('保存角色失败')
        })
        .finally(() => {
          // 关闭对话框
          dialogVisible.value = false
        })
    }
  })
}

// 删除角色
const handleDelete = (row: RoleItem) => {
  ElMessageBox.confirm('确定要删除该角色吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      roleApi.deleteRoleApi(row.id).then(() => {
        ElMessage.success('删除成功')
        fetchRoleList() // 重新加载数据
      })
    })
    .catch(() => {
      // 取消删除
    })
}

// 权限分配相关
const menuTreeData = ref<MenuItem[]>([])
const checkedMenuIds = ref<number[]>([])
const defaultProps = {
  children: 'children',
  label: 'name',
}
const treeRef = ref<InstanceType<typeof ElTree>>()

// 获取菜单树数据
const fetchMenuTree = async () => {
  try {
    const res = await menuApi.fetchUserMenuListApi()
    menuTreeData.value = res
  } catch (error) {
    console.error('获取菜单列表失败', error)
    ElMessage.error('获取菜单列表失败')
  }
}

// 获取角色权限
const fetchRoleMenus = async (roleId: number) => {
  try {
    const res = await roleApi.getRoleMenusApi(roleId)
    checkedMenuIds.value = res

    // 使用nextTick确保DOM更新后再设置选中状态
    await nextTick()
    if (treeRef.value && checkedMenuIds.value.length > 0) {
      // 先清空选中状态
      treeRef.value.setCheckedKeys([])
      // 设置新的选中状态
      checkedMenuIds.value.forEach((id) => {
        treeRef.value!.setChecked(id, true, false)
      })
    }
  } catch (error) {
    console.error('获取角色权限失败', error)
    ElMessage.error('获取角色权限失败')
  }
}

// 保存权限分配
const saveRoleMenus = async () => {
  if (!currentRole.value) return

  try {
    // 获取选中的节点ID
    const checkedKeys = treeRef.value?.getCheckedKeys() || []
    const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
    const menuIds = [...checkedKeys, ...halfCheckedKeys] as number[]

    await roleApi.assignRoleMenusApi(currentRoleId.value, menuIds)
    ElMessage.success('权限分配成功')
  } catch (error) {
    console.error('权限分配失败', error)
    ElMessage.error('权限分配失败')
  }
}

// 角色用户相关
const roleUsers = ref<UserItem[]>([])
const userLoading = ref(false)
const userPagination = reactive({
  total: 0,
  current: 1,
  size: 10,
})

// 获取角色用户
const fetchRoleUsers = async (roleId: number) => {
  if (!roleId) return

  userLoading.value = true
  try {
    const res = await roleApi.fetchRoleUsersApi(roleId)
    roleUsers.value = res.records
    userPagination.total = res.total
    userPagination.current = res.current
    userPagination.size = res.size
  } catch (error) {
    console.error('获取角色用户失败', error)
    ElMessage.error('获取角色用户失败')
  } finally {
    userLoading.value = false
  }
}

// 标签页相关
const activeTab = ref('permissions')
const handleTabChange = (tab: string) => {
  activeTab.value = tab
  if (currentRole.value) {
    if (tab === 'users') {
      fetchRoleUsers(currentRole.value.id)
    } else if (tab === 'permissions') {
      // 切换回权限标签页时，重新加载权限数据
      fetchRoleMenus(currentRole.value.id)
    }
  }
}

// 操作菜单相关
const showOperationMenu = ref<number | null>(null)
const toggleOperationMenu = (roleId: number | null) => {
  showOperationMenu.value = roleId
}

onMounted(() => {
  fetchRoleList()
  fetchMenuTree()
})
</script>

<template>
  <div class="role-container">
    <!-- 左侧角色列表 -->
    <div class="role-list-container">
      <el-card class="role-list-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>角色列表</span>
          </div>
        </template>

        <div class="role-search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索角色"
            clearable
            @input="filterRoles"
            @clear="filterRoles"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" :icon="Plus" @click="handleAdd" v-permission="'system:role:add'"
            >添加角色</el-button
          >
        </div>

        <div class="role-list">
          <div
            v-for="role in filteredRoleList"
            :key="role.id"
            class="role-item"
            :class="{ 'role-item-active': currentRole?.id === role.id }"
            @click="handleSelectRole(role)"
          >
            <div class="role-info">
              <div class="role-name">{{ role.name }}</div>
              <div class="role-code">{{ role.code }}</div>
            </div>
            <div class="role-actions">
              <el-tag
                size="small"
                :type="role.status === 1 ? 'success' : 'info'"
                class="role-status"
              >
                {{ role.status === 1 ? '正常' : '停用' }}
              </el-tag>
              <el-popover
                placement="bottom"
                :width="100"
                trigger="click"
                :visible="showOperationMenu === role.id"
                @hide="toggleOperationMenu(null)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    link
                    :icon="MoreFilled"
                    @click.stop="toggleOperationMenu(role.id)"
                  />
                </template>
                <div class="operation-menu">
                  <div
                    class="operation-item"
                    @click="handleEdit(role)"
                    v-permission="'system:role:edit'"
                  >
                    编辑
                  </div>
                  <div
                    class="operation-item danger"
                    @click="handleDelete(role)"
                    v-permission="'system:role:delete'"
                  >
                    删除
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 右侧内容区 -->
    <div class="role-content-container">
      <el-card class="role-content-card" shadow="never" v-if="currentRole">
        <template #header>
          <div class="card-header">
            <div class="role-tabs">
              <div
                class="role-tab"
                :class="{ active: activeTab === 'permissions' }"
                @click="handleTabChange('permissions')"
              >
                功能权限
              </div>
              <div
                class="role-tab"
                :class="{ active: activeTab === 'users' }"
                @click="handleTabChange('users')"
              >
                角色用户
              </div>
            </div>
          </div>
        </template>

        <!-- 功能权限标签页 -->
        <div v-if="activeTab === 'permissions'" class="permissions-tab">
          <div class="permissions-header">
            <el-button type="primary" @click="saveRoleMenus">保存</el-button>
          </div>
          <el-tree
            ref="treeRef"
            :data="menuTreeData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            default-expand-all
          />
        </div>

        <!-- 角色用户标签页 -->
        <div v-if="activeTab === 'users'" class="users-tab">
          <el-table v-loading="userLoading" :data="roleUsers" style="width: 100%" border stripe>
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
          </el-table>

          <!-- 分页 -->
          <div class="pagination-container" v-if="userPagination.total > 0">
            <el-pagination
              v-model:current-page="userPagination.current"
              v-model:page-size="userPagination.size"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="userPagination.total"
            />
          </div>
        </div>
      </el-card>

      <el-empty v-else description="请选择一个角色" />
    </div>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" append-to-body>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入角色编码" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="999" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.role-container {
  display: flex;
  height: 100%;
  gap: 16px;

  .role-list-container {
    width: 280px;
    flex-shrink: 0;

    .role-list-card {
      height: 100%;
    }

    .role-search {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;

      .el-input {
        flex: 1;
      }
    }

    .role-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: calc(100vh - 220px);
      overflow-y: auto;
    }

    .role-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid #ebeef5;

      &:hover {
        background-color: #f5f7fa;
      }

      &-active {
        background-color: #ecf5ff;
        border-color: #d9ecff;
      }

      .role-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .role-name {
        font-weight: 500;
        font-size: 14px;
      }

      .role-code {
        font-size: 12px;
        color: #909399;
      }

      .role-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .role-status {
        font-size: 12px;
      }
    }
  }

  .role-content-container {
    flex: 1;
    overflow: hidden;

    .role-content-card {
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

    .role-tabs {
      display: flex;
      gap: 16px;
    }

    .role-tab {
      padding: 0 4px 8px 4px;
      cursor: pointer;
      position: relative;

      &.active {
        font-weight: 500;
        color: var(--el-color-primary);

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--el-color-primary);
        }
      }
    }
  }

  .operation-menu {
    display: flex;
    flex-direction: column;

    .operation-item {
      padding: 8px 12px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: #f5f7fa;
      }

      &.danger {
        color: #f56c6c;
      }
    }
  }

  .tab-footer {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .permissions-tab,
  .users-tab {
    height: calc(100% - 16px);
    overflow: auto;

    .permissions-header {
      display: flex;
      margin-bottom: 16px;
    }
  }
}
</style>
