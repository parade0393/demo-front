<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import { roleApi } from '@/api/modules/system/role'
import { menuApi } from '@/api/modules/system/menu'
import type { FormInstance, FormRules } from 'element-plus'
import type { RoleItem } from '@/api/modules/system/role'
import type { MenuItem } from '@/api/modules/system/menu'

// 表格数据
const tableData = ref<RoleItem[]>([])
const loading = ref(false)

// 获取角色列表
const fetchRoleList = async () => {
  loading.value = true
  try {
    const res = await roleApi.fetchRoleListApi()
    tableData.value = res
  } catch (error) {
    console.error('获取角色列表失败', error)
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
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
const permDialogVisible = ref(false)
const currentRoleId = ref<number>(0)
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

// 打开权限分配对话框
const handleAssignPerm = async (row: RoleItem) => {
  currentRoleId.value = row.id
  permDialogVisible.value = true

  // 获取菜单树数据
  if (menuTreeData.value.length === 0) {
    await fetchMenuTree()
  }

  // 先重置树形控件的选中状态
  if (treeRef.value) {
    treeRef.value.setCheckedKeys([])
  }

  // 获取角色已有权限
  try {
    const res = await roleApi.getRoleMenusApi(row.id)
    checkedMenuIds.value = res

    // 使用nextTick确保DOM更新后再设置选中状态
    await nextTick()
    if (treeRef.value && checkedMenuIds.value.length > 0) {
      // 设置新的选中状态
      // treeRef.value.setCheckedKeys(checkedMenuIds.value,true)
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
  try {
    // 获取选中的节点ID
    const checkedKeys = treeRef.value?.getCheckedKeys() || []
    const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
    const menuIds = [...checkedKeys, ...halfCheckedKeys] as number[]

    await roleApi.assignRoleMenusApi(currentRoleId.value, menuIds)
    ElMessage.success('权限分配成功')
    permDialogVisible.value = false
  } catch (error) {
    console.error('权限分配失败', error)
    ElMessage.error('权限分配失败')
  }
}

onMounted(() => {
  fetchRoleList()
})
</script>

<template>
  <div class="role-container">
    <div class="role-header">
      <el-button type="primary" @click="handleAdd" v-permission="'system:role:add'"
        >添加角色</el-button
      >
    </div>

    <el-table v-loading="loading" :data="tableData" row-key="id" border style="width: 100%">
      <el-table-column prop="name" label="角色名称" min-width="120" />
      <el-table-column prop="code" label="角色编码" min-width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="180" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="createTime" label="创建时间" min-width="180" />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            link
            @click="handleAssignPerm(row)"
            v-permission="['system:role:edit']"
            >分配权限</el-button
          >
          <el-button type="primary" link @click="handleEdit(row)" v-permission="'system:role:edit'"
            >编辑</el-button
          >
          <el-button
            type="danger"
            link
            @click="handleDelete(row)"
            v-permission="'system:role:delete'"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

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

    <!-- 分配权限对话框 -->
    <el-dialog v-model="permDialogVisible" title="分配权限" width="400px" append-to-body>
      <el-tree
        ref="treeRef"
        :data="menuTreeData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
      />

      <template #footer>
        <el-button @click="permDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRoleMenus">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.role-container {
  padding: 20px;
}

.role-header {
  margin-bottom: 20px;
}
</style>
