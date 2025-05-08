import type { Directive, DirectiveBinding } from 'vue'
import { usePermissionStore } from '@/stores/permission'

/**
 * 按钮权限指令
 * 用法：
 * 1. 单个权限：v-permission="'system:user:add'"
 * 2. 多个权限(默认必须同时满足)：v-permission="['system:user:add', 'system:user:edit']"
 * 3. 多个权限(满足其中一个即可)：v-permission.or="['system:user:add', 'system:user:edit']"
 * 4. 如果用户没有所需权限，按钮将被隐藏
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding.value, binding.modifiers)
  },

  // 当指令的值更新时，重新检查权限
  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 如果值没有变化，则不需要更新
    if (binding.value === binding.oldValue) return

    checkPermission(el, binding.value, binding.modifiers)
  },
}

/**
 * 检查权限
 * @param el DOM元素
 * @param value 权限值
 * @param modifiers 指令修饰符对象
 */
function checkPermission(
  el: HTMLElement,
  value: string | string[],
  modifiers: Record<string, boolean>,
) {
  // 获取用户权限列表
  const permissionStore = usePermissionStore()
  const { userInfo } = permissionStore

  // 如果没有传递权限标识或者用户没有权限信息，则隐藏元素
  if (!value || !userInfo?.permissions) {
    el.style.display = 'none'
    return
  }

  // 判断是否有权限
  let hasPermission = false

  if (typeof value === 'string') {
    // 单个权限
    hasPermission = userInfo.permissions.includes(value)
  } else if (Array.isArray(value)) {
    if (modifiers.or) {
      // 多个权限(满足其中一个即可)
      hasPermission = value.some((perm) => userInfo.permissions?.includes(perm))
    } else {
      // 多个权限(必须同时满足)
      hasPermission = value.every((perm) => userInfo.permissions?.includes(perm))
    }
  }

  // 根据权限更新元素的显示状态
  el.style.display = hasPermission ? '' : 'none'
}
