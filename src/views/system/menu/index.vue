<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { menuApi } from '@/api/modules/system/menu'
import IconSelector from '@/components/IconSelector/index.vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { MenuItem } from '@/api/modules/system/menu'

// 菜单类型选项
const menuTypeOptions = [
  { label: '目录', value: 1 },
  { label: '菜单', value: 2 },
  { label: '按钮', value: 3 },
  { label: '外链', value: 4 },
]

// 表格数据
const tableData = ref<MenuItem[]>([])
const loading = ref(false)

// 获取菜单列表
const fetchMenuList = async () => {
  loading.value = true
  try {
    const res = await menuApi.fetchUserMenuListApi()
    tableData.value = res
  } catch (error) {
    console.error('获取菜单列表失败', error)
    ElMessage.error('获取菜单列表失败')
  } finally {
    loading.value = false
  }
}

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加菜单')
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<MenuItem>({
  id: 0,
  parentId: 0,
  treePath: null,
  name: '',
  type: 1,
  routeName: null,
  routePath: null,
  component: null,
  perm: null,
  alwaysShow: 0,
  keepAlive: 0,
  visible: 1,
  sort: 0,
  icon: null,
  redirect: null,
  createTime: '',
  updateTime: null,
  params: null,
})

// 表单校验规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { max: 64, message: '菜单名称不能超过64个字符', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  route_path: [{ max: 128, message: '路由路径不能超过128个字符', trigger: 'blur' }],
  component: [{ max: 128, message: '组件路径不能超过128个字符', trigger: 'blur' }],
  icon: [{ max: 64, message: '图标不能超过64个字符', trigger: 'blur' }],
  sort: [{ type: 'number', message: '排序值必须为数字', trigger: 'blur' }],
})

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(formData, {
    id: 0,
    parentId: 0,
    treePath: null,
    name: '',
    type: 1,
    routeName: null,
    routePath: null,
    component: null,
    perm: null,
    alwaysShow: 0,
    keepAlive: 0,
    visible: 1,
    sort: 0,
    icon: null,
    redirect: null,
    createTime: '',
    updateTime: null,
    params: null,
  })
}

// 打开添加菜单对话框
const handleAdd = (row?: MenuItem) => {
  resetForm()
  dialogTitle.value = '添加菜单'
  if (row) {
    formData.parentId = row.id
  }
  dialogVisible.value = true
}

// 打开编辑菜单对话框
const handleEdit = (row: MenuItem) => {
  resetForm()
  dialogTitle.value = '编辑菜单'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      console.log('提交表单', formData)
      const api = formData.id ? menuApi.updateMenuApi : menuApi.addMenuApi
      api(formData)
        .then(() => {
          ElMessage.success(formData.id ? '修改成功' : '添加成功')
          fetchMenuList() // 重新加载数据
        })
        .catch((error) => {
          console.error('保存菜单失败', error)
          ElMessage.error('保存菜单失败')
        })
        .finally(() => {
          // 关闭对话框
          dialogVisible.value = false
        })
    }
  })
}

// 删除菜单
const handleDelete = (_: MenuItem) => {
  ElMessageBox.confirm('确定要删除该菜单吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 这里应该调用删除API，目前模拟成功
      ElMessage.success('删除成功')
      fetchMenuList() // 重新加载数据
    })
    .catch(() => {
      // 取消删除
    })
}

// 格式化菜单类型
const formatMenuType = (row: MenuItem) => {
  const typeMap: Record<number, string> = {
    1: '目录',
    2: '菜单',
    3: '按钮',
    4: '外链',
  }
  return typeMap[row.type] || '未知'
}

onMounted(() => {
  fetchMenuList()
})
</script>

<template>
  <div class="menu-container">
    <div class="menu-header">
      <el-button type="primary" @click="handleAdd()" v-permission="'system:menu:add'"
        >添加菜单</el-button
      >
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
      style="width: 100%"
    >
      <el-table-column prop="name" label="菜单名称" min-width="180" />
      <el-table-column prop="type" label="菜单类型" width="100">
        <template #default="{ row }">
          <el-tag
            :type="
              row.type === 1
                ? 'primary'
                : row.type === 2
                  ? 'success'
                  : row.type === 3
                    ? 'warning'
                    : 'info'
            "
          >
            {{ formatMenuType(row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="visible" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.visible === 1 ? 'success' : 'info'">
            {{ row.visible === 1 ? '显示' : '隐藏' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="routeName" label="路由名称" width="180" />
      <el-table-column prop="routePath" label="路由路径" width="180" />
      <el-table-column prop="component" label="组件路径" width="180" />
      <el-table-column prop="perm" label="权限标识" width="180" />
      <el-table-column prop="sort" label="排序" width="80" />

      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleAdd(row)" v-permission="'system:menu:add'"
            >添加子菜单</el-button
          >
          <el-button type="primary" link @click="handleEdit(row)" v-permission="'system:menu:edit'"
            >编辑</el-button
          >
          <el-button
            type="danger"
            link
            @click="handleDelete(row)"
            v-permission="'system:menu:delete'"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑菜单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px" append-to-body>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type" :disabled="dialogTitle === '编辑菜单'">
            <el-radio-button
              v-for="item in menuTypeOptions"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="formData.parentId" placeholder="请选择上级菜单" style="width: 100%">
            <el-option :value="0" label="顶级菜单" />
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.type !== 3">
            <el-form-item label="菜单图标" prop="icon">
              <IconSelector v-model="formData.icon" placeholder="请选择图标" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="路由名称" prop="routeName">
              <el-input v-model="formData.routeName" placeholder="请输入路由名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由路径" prop="routePath">
              <el-input v-model="formData.routePath" placeholder="请输入路由路径" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="组件路径" prop="component" v-if="formData.type === 2">
          <el-input v-model="formData.component" placeholder="请输入组件路径" />
        </el-form-item>

        <el-form-item label="权限标识" prop="perm" v-if="formData.type === 3">
          <el-input v-model="formData.perm" placeholder="请输入权限标识" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="显示状态" prop="visible">
              <el-switch
                v-model="formData.visible"
                inline-prompt
                :active-value="1"
                :inactive-value="0"
                active-text="显示"
                inactive-text="隐藏"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.type === 1">
            <el-form-item label="总是显示" prop="alwaysShow">
              <el-switch
                v-model="formData.alwaysShow as number"
                inline-prompt
                :active-value="1"
                :inactive-value="0"
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="formData.sort" :min="0" :max="999" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="页面缓存" prop="keepAlive" v-if="formData.type === 2">
              <el-switch
                v-model="formData.keepAlive as number"
                :active-value="1"
                :inactive-value="0"
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="重定向" prop="redirect" v-if="formData.type === 1">
          <el-input v-model="formData.redirect" placeholder="请输入重定向路径" />
        </el-form-item>

        <el-form-item label="路由参数" prop="params">
          <el-input v-model="formData.params" placeholder="请输入路由参数" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.menu-container {
  padding: 20px;
}

.menu-header {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
