# Element Plus 暗色模式样式规范指南

## 基本原则

1. **使用 CSS 变量**

   - 优先使用 Element Plus 提供的 CSS 变量
   - 避免直接使用固定的颜色值
   - 所有颜色相关的样式都应该使用 CSS 变量

2. **遵循层次结构**
   - 背景色从深到浅
   - 文字颜色从浅到深
   - 保持适当的对比度

## 常用的 CSS 变量

### 背景色系列

```scss
// 从深到浅排列
--el-bg-color-overlay    // 最深的背景色，用于弹出层
--el-bg-color           // 基础背景色
--el-bg-color-page      // 页面背景色
```

### 文字颜色系列

```scss
--el-text-color-primary   // 主要文字颜色
--el-text-color-regular   // 常规文字颜色
--el-text-color-secondary // 次要文字颜色
--el-text-color-placeholder // 占位符文字颜色
```

### 边框颜色系列

```scss
--el-border-color        // 基础边框颜色
--el-border-color-light  // 浅色边框
--el-border-color-extra-light // 特别浅的边框
```

### 填充颜色系列

```scss
--el-fill-color         // 基础填充色
--el-fill-color-light   // 浅色填充色
--el-fill-color-blank   // 空白填充色
```

## 最佳实践

### 1. 背景色使用

```scss
// ✅ 推荐
.container {
  background-color: var(--el-bg-color);
}

// ❌ 不推荐
.container {
  background-color: #ffffff;
}
```

### 2. 文字颜色使用

```scss
// ✅ 推荐
.text {
  color: var(--el-text-color-primary);
}

.description {
  color: var(--el-text-color-secondary);
}

// ❌ 不推荐
.text {
  color: #303133;
}
```

### 3. 边框样式

```scss
// ✅ 推荐
.card {
  border: 1px solid var(--el-border-color-light);
}

// ❌ 不推荐
.card {
  border: 1px solid #dcdfe6;
}
```

### 4. 阴影效果

```scss
// ✅ 推荐
.popup {
  box-shadow: var(--el-box-shadow-light);
}

// ❌ 不推荐
.popup {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
```

## 常见问题及解决方案

### 1. 自定义组件的背景透明问题

当组件需要透明背景时，不要使用 `transparent`，而应该继承父元素的背景色：

```scss
// ✅ 推荐
.custom-component {
  background-color: inherit;
}

// ❌ 不推荐
.custom-component {
  background-color: transparent;
}
```

### 2. 图标颜色适配

对于 SVG 图标，使用 `currentColor` 来继承文字颜色：

```scss
// ✅ 推荐
.icon {
  fill: currentColor;
  color: var(--el-text-color-primary);
}

// ❌ 不推荐
.icon {
  fill: #303133;
}
```

### 3. 渐变背景适配

使用 CSS 变量构建渐变背景：

```scss
// ✅ 推荐
.gradient-bg {
  background-image: linear-gradient(
    to right,
    var(--el-color-primary),
    var(--el-color-primary-light-3)
  );
}

// ❌ 不推荐
.gradient-bg {
  background-image: linear-gradient(to right, #409eff, #79bbff);
}
```

## 主题色使用规范

### 1. 主题色变量

```scss
// 主题色系列
--el-color-primary       // 主题色
--el-color-primary-light-{i} // i 的范围是 1-9，色彩由深到浅
--el-color-primary-dark-{i}  // i 的范围是 1-2，色彩由浅到深
```

### 2. 使用场景

```scss
// ✅ 推荐
.button {
  background-color: var(--el-color-primary);
  &:hover {
    background-color: var(--el-color-primary-light-3);
  }
  &:active {
    background-color: var(--el-color-primary-dark-2);
  }
}

// ❌ 不推荐
.button {
  background-color: #409eff;
  &:hover {
    background-color: #79bbff;
  }
  &:active {
    background-color: #337ecc;
  }
}
```

### 3. 主题色透明度

```scss
// ✅ 推荐
.overlay {
  background-color: var(--el-color-primary-light-9);
}

// ❌ 不推荐
.overlay {
  background-color: rgba(64, 158, 255, 0.1);
}
```

## 色弱模式规范

### 1. 基本原则

- 增强颜色对比度
- 避免仅依赖颜色传递信息
- 添加图案、文字等辅助信息

### 2. 颜色选择

```scss
// ✅ 推荐
.status {
  // 使用高对比度的颜色组合
  &.success {
    background-color: var(--el-color-success);
    // 添加图标或文字说明
    &::before {
      content: '✓';
    }
  }
  &.error {
    background-color: var(--el-color-error);
    &::before {
      content: '✕';
    }
  }
}

// ❌ 不推荐
.status {
  &.success {
    background-color: #67c23a;
  }
  &.error {
    background-color: #f56c6c;
  }
}
```

### 3. 图表适配

```scss
// ✅ 推荐
.chart-item {
  // 使用纹理区分
  &.series-1 {
    background: repeating-linear-gradient(
      45deg,
      var(--el-color-primary),
      var(--el-color-primary) 10px,
      var(--el-color-primary-light-5) 10px,
      var(--el-color-primary-light-5) 20px
    );
  }
}

// ❌ 不推荐
.chart-item {
  &.series-1 {
    background-color: var(--el-color-primary);
  }
}
```

## 哀悼模式规范

### 1. 基本原则

- 将页面转换为灰度显示
- 保持必要的交互性
- 维持基本的可读性

### 2. 实现方式

```scss
// ✅ 推荐
// 在根元素上通过 CSS 变量控制
:root {
  &.mourning-mode {
    filter: grayscale(1);
  }
}

// ❌ 不推荐
// 直接在元素上应用灰度
.page {
  filter: grayscale(1);
}
```

### 3. 特殊元素处理

```scss
// ✅ 推荐
.important-notice {
  // 重要信息保持醒目
  filter: grayscale(0.8);
  font-weight: bold;
}

// ❌ 不推荐
.important-notice {
  color: red;
}
```

## 总结

1. 始终使用 Element Plus 提供的 CSS 变量
2. 保持颜色系统的一致性
3. 注意明暗对比度
4. 使用语义化的变量名
5. 定期检查暗色模式下的显示效果
6. 合理使用主题色变量及其衍生色
7. 为色弱用户提供足够的视觉辅助
8. 优雅地实现哀悼模式的灰度效果

遵循以上规范，可以确保项目在各种显示模式下保持良好的视觉效果和用户体验。
