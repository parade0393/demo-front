<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Refresh } from '@element-plus/icons-vue'
import { deptApi } from '@/api/modules/system/dept'
import type { FormInstance, FormRules } from 'element-plus'
import type { DeptItem, DeptFormData } from '@/api/modules/system/dept'

// 表格数据
const tableData = ref<DeptItem[]>([])
const loading = ref(false)

// 获取部门列表
const fetchDeptTree = async () => {
  loading.value = true
  try {
    const res = await deptApi.fetchDeptTreeApi()
    tableData.value = res
  } catch (error) {
    console.error('获取部门列表失败', error)
    ElMessage.error('获取部门列表失败')
  } finally {
    loading.value = false
  }
}

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加部门')
const formRef = ref<FormInstance>()
const formLoading = ref(false)

// 表单数据
const formData = reactive<DeptFormData>({
  parentId: 0,
  name: '',
  leader: '',
  phone: '',
  email: '',
  status: 1,
  sort: 0,
})

// 表单校验规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { max: 50, message: '部门名称不能超过50个字符', trigger: 'blur' },
  ],
  leader: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
})

// 添加部门
const handleAdd = (row?: DeptItem) => {
  resetForm()
  dialogTitle.value = '添加部门'
  if (row) {
    formData.parentId = row.id
  } else {
    formData.parentId = 0
  }
  dialogVisible.value = true
}

// 编辑部门
const handleEdit = async (row: DeptItem) => {
  resetForm()
  dialogTitle.value = '编辑部门'
  formLoading.value = true
  try {
    const res = await deptApi.getDeptDetailApi(row.id)
    Object.assign(formData, res)
  } catch (error) {
    console.error('获取部门详情失败', error)
    ElMessage.error('获取部门详情失败')
  } finally {
    formLoading.value = false
  }
  dialogVisible.value = true
}

// 删除部门
const handleDelete = (row: DeptItem) => {
  ElMessageBox.confirm(`确认删除部门 ${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deptApi.deleteDeptApi(row.id)
        ElMessage.success('删除成功')
        fetchDeptTree()
      } catch (error) {
        console.error('删除部门失败', error)
        ElMessage.error('删除部门失败')
      }
    })
    .catch(() => {
      // 取消删除
    })
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.id = undefined
  formData.parentId = 0
  formData.name = ''
  formData.leader = ''
  formData.phone = ''
  formData.email = ''
  formData.status = 1
  formData.sort = 0
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (!valid) return

    formLoading.value = true
    try {
      if (formData.id) {
        // 编辑部门
        await deptApi.updateDeptApi(formData)
        ElMessage.success('编辑部门成功')
      } else {
        // 新增部门
        await deptApi.createDeptApi(formData)
        ElMessage.success('新增部门成功')
      }
      dialogVisible.value = false
      fetchDeptTree()
    } catch (error) {
      console.error('保存部门失败', error)
      ElMessage.error('保存部门失败')
    } finally {
      formLoading.value = false
    }
  })
}

// 格式化状态
const formatStatus = (row: DeptItem) => {
  return row.status === 1 ? '正常' : '停用'
}

// 刷新列表
const refreshList = () => {
  fetchDeptTree()
}

// 页面加载时获取数据
onMounted(() => {
  fetchDeptTree()
})
</script>

<template>
  <div class="dept-container">
    <div class="dept-header">
      <el-button type="primary" :icon="Plus" @click="handleAdd()" v-permission="'system:dept:add'"
        >新增部门</el-button
      >
      <el-button :icon="Refresh" circle @click="refreshList" />
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
      style="width: 100%"
    >
      <el-table-column prop="name" label="部门名称" min-width="180" />
      <el-table-column prop="leader" label="负责人" width="120" />
      <el-table-column prop="phone" label="联系电话" width="120" />
      <el-table-column prop="email" label="邮箱" min-width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ formatStatus(row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="createTime" label="创建时间" min-width="180" />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            link
            :icon="Plus"
            @click="handleAdd(row)"
            v-permission="'system:dept:add'"
            >添加子部门</el-button
          >
          <el-button
            type="primary"
            link
            :icon="Edit"
            @click="handleEdit(row)"
            v-permission="'system:deot:edit'"
            >编辑</el-button
          >
          <el-button
            type="danger"
            link
            :icon="Delete"
            @click="handleDelete(row)"
            v-permission="'system:deot:delete'"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑部门对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        v-loading="formLoading"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="[{ id: 0, name: '顶级部门' }, ...tableData]"
            :props="{ label: 'name', children: 'children', value: 'id' }"
            placeholder="请选择上级部门"
            check-strictly
            :render-after-expand="false"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门名称" />
        </el-form-item>

        <el-form-item label="负责人" prop="leader">
          <el-input v-model="formData.leader" placeholder="请输入负责人" />
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="999" style="width: 100%" />
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
.dept-container {
  padding: 20px;
}

.dept-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
</style>
