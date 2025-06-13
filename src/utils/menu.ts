import type { RouteRecordRaw } from 'vue-router'

/**
 * 获取可见的子节点
 */
export const getVisibleChildren = (menuItem: RouteRecordRaw): RouteRecordRaw[] => {
  if (!menuItem.children || menuItem.children.length === 0) {
    return []
  }
  return menuItem.children.filter((child) => !child.meta?.hidden)
}

/**
 * 判断是否应该显示子菜单
 */
export const shouldShowSubMenu = (menuItem: RouteRecordRaw): boolean => {
  const visibleChildren = getVisibleChildren(menuItem)

  // 如果没有子节点，不显示子菜单
  if (visibleChildren.length === 0) {
    return false
  }

  // 如果有多个子节点，显示子菜单
  if (visibleChildren.length > 1) {
    return true
  }

  // 如果只有一个子节点，根据 alwaysShow 决定是否显示子菜单
  return menuItem.meta?.alwaysShow === true
}

/**
 * 获取完整路径
 */
export const getFullPath = (path: string, basePath: string = ''): string => {
  // 如果路径以 / 开头，说明是绝对路径，直接返回
  if (path.startsWith('/')) {
    return path
  }
  // 否则拼接基础路径
  return `${basePath}/${path}`.replace(/\/+/g, '/')
}

/**
 * 处理菜单项路径
 * @param menuItem 菜单项
 * @param basePath 基础路径
 * @returns 处理后的菜单项
 */
export const processMenuItemPath = (
  menuItem: RouteRecordRaw,
  basePath: string = '',
): RouteRecordRaw => {
  // 计算完整路径
  const fullPath = getFullPath(menuItem.path, basePath)
  menuItem.path = fullPath
  return menuItem
}

/**
 * 解析query字符串为参数对象数组
 * @param queryString query字符串，格式如 '[{"key":"type","value":2},{"key":"status","value":"active"}]'
 * @returns 解析后的参数数组
 */
export const parseQueryString = (
  queryString?: string,
): Array<{ key: string; value: string | number }> => {
  if (!queryString) {
    return []
  }

  try {
    const parsed = JSON.parse(queryString)
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item) =>
          item &&
          typeof item === 'object' &&
          'key' in item &&
          'value' in item &&
          item.key &&
          item.value !== undefined &&
          item.value !== null,
      )
    }
  } catch (error) {
    console.warn('Failed to parse query string:', queryString, error)
  }

  return []
}

/**
 * 构建带query参数的完整路径
 * @param path 基础路径
 * @param queryParams query参数数组
 * @returns 带query参数的完整路径
 */
export const buildPathWithQuery = (
  path: string,
  queryParams?: Array<{ key: string; value: string | number }>,
): string => {
  const basePathPart = path.split('?')[0] // Get path without any existing query string

  if (!queryParams || queryParams.length === 0) {
    // If meta.query is empty or undefined, return the base path part without any query string.
    // This ensures that an empty meta.query effectively clears any previous query params from the path segment.
    return basePathPart
  }

  const searchParams = new URLSearchParams()
  // Use a Map to handle duplicate keys from queryParams, ensuring the last one wins (overwrite behavior).
  const paramsMap = new Map<string, string>()
  queryParams.forEach((param) => {
    if (param.key && param.value !== undefined && param.value !== null) {
      paramsMap.set(param.key, String(param.value)) // Last occurrence for a key will overwrite previous ones
    }
  })

  paramsMap.forEach((value, key) => {
    searchParams.append(key, value) // Append to searchParams; since keys in paramsMap are unique, this is fine.
    // Using .set would also work: searchParams.set(key, value)
  })

  const newQueryString = searchParams.toString()
  return newQueryString ? `${basePathPart}?${newQueryString}` : basePathPart
}

/**
 * 获取完整路径（包含query参数）
 */
export const getFullPathWithQuery = (
  pathSegment: string, // Renamed to clarify it's a segment, not a potentially full path
  currentBasePath: string = '', // This is the path accumulated so far, potentially with its own query params
  metaQueryString?: string, // The query string from the current segment's meta
): string => {
  // Step 1: Construct the full path without considering the new metaQueryString yet.
  // This `pathBeforeNewQuery` might or mightnot include query params from `currentBasePath`
  // depending on how `currentBasePath` was constructed in the recursive call.
  // For now, assume `getFullPath` just concatenates and normalizes slashes.
  const pathWithoutNewQuery = getFullPath(pathSegment, currentBasePath)

  // Step 2: Parse the metaQueryString of the current segment.
  const newQueryParams = parseQueryString(metaQueryString)

  // Step 3: Build the final path. buildPathWithQuery will take `pathWithoutNewQuery`,
  // extract its base part (stripping any existing queries it might have had),
  // and then append the `newQueryParams`.
  // This ensures that the current segment's `meta.query` takes precedence and overwrites.
  return buildPathWithQuery(pathWithoutNewQuery, newQueryParams)
}
