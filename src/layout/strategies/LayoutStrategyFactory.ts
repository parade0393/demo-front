/**
 * 布局策略工厂
 * 根据布局模式返回对应的布局策略实例
 */
import type { LayoutStrategy } from './LayoutStrategy'
import { LeftSidebarStrategy } from './LeftSidebarStrategy'
import { RightSidebarStrategy } from './RightSidebarStrategy'
import { TopMenuStrategy } from './TopMenuStrategy'
import { MixedStrategy } from './MixedStrategy'
/**
 * 布局策略工厂类
 * 使用单例模式实现
 */
export class LayoutStrategyFactory {
  private static instance: LayoutStrategyFactory
  private strategies: Map<LayoutMode, LayoutStrategy>

  private constructor() {
    // 初始化策略映射
    this.strategies = new Map<LayoutMode, LayoutStrategy>()
    this.strategies.set('left-sidebar', new LeftSidebarStrategy())
    this.strategies.set('right-sidebar', new RightSidebarStrategy())
    this.strategies.set('top-menu', new TopMenuStrategy())
    this.strategies.set('mixed', new MixedStrategy())
  }

  /**
   * 获取工厂实例
   */
  public static getInstance(): LayoutStrategyFactory {
    if (!LayoutStrategyFactory.instance) {
      LayoutStrategyFactory.instance = new LayoutStrategyFactory()
    }
    return LayoutStrategyFactory.instance
  }

  /**
   * 根据布局模式获取对应的布局策略
   * @param layoutMode 布局模式
   * @returns 布局策略实例
   */
  public getStrategy(layoutMode: LayoutMode): LayoutStrategy {
    const strategy = this.strategies.get(layoutMode)
    if (!strategy) {
      // 如果没有找到对应的策略，返回默认的左侧菜单策略
      return this.strategies.get('left-sidebar')!
    }
    return strategy
  }

  /**
   * 注册新的布局策略
   * @param layoutMode 布局模式
   * @param strategy 布局策略实例
   */
  public registerStrategy(layoutMode: LayoutMode, strategy: LayoutStrategy): void {
    this.strategies.set(layoutMode, strategy)
  }
}
