/**
 * pinia-plugin-persistedstate的类型声明文件
 *
 * 作用：为pinia的persist选项提供类型支持
 * - 当persist设置为true时：整个store会被持久化
 * - 当设置具体配置时：可以控制存储key、使用的存储引擎、持久化的字段等
 *
 * 这个文件对TypeScript类型检查很重要，能帮助IDE提供正确的代码提示
 * 并在使用过程中避免类型错误
 */
import 'pinia'

declare module 'pinia' {
  // 为setup store添加persist选项
  export interface DefineSetupStoreOptions<_Id extends string, _S, _G, _A> {
    persist?:
      | boolean
      | {
          key?: string
          storage?: Storage
          pick?: string[]
        }
  }
}
