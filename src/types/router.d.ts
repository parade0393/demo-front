import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 菜单标题
     */
    title?: string
    /**
     * 是否隐藏菜单
     * true 隐藏, false 显示
     * @default false
     */
    hidden?: boolean
    /**
     * 菜单图标
     */
    icon?: string
    /**
     * 始终显示父级菜单，即使只有一个子菜单
     * true 显示父级菜单, false 隐藏父级菜单，显示唯一子节点
     * @default false
     */
    alwaysShow?: boolean
    /**
     * 是否缓存页面
     * true 缓存, false 不缓存
     * @default false
     */
    keepAlive?: boolean
    /**
     * 是否为外部链接
     * true 是外部链接, false 不是外部链接
     * @default false
     */
    isExternal?: boolean
    /**
     * 外部链接地址
     * 当isExternal为true时有效
     */
    externalLink?: string
  }
}
