# Element Plus 味动态表单

`el-dynamic-forms` 是一个基于 [Element Plus](https://element-plus.org/) 的动态表单生成库，旨在简化表单的创建和管理过程。通过配置化的方式，用户可以轻松定义复杂的表单结构和验证规则。

## 引用方式

此项目可以通过多种方式引用：

### 直接引用

编译或下载打包后的文件，提取 `dist/el-dynamic-forms.umd.js`，并在 HTML 文件中通过 `<script>` 标签引入：

```html
<script src="path/to/el-dynamic-forms.umd.js"></script>
```

### 通过 yarn / npm 安装

下载打包的 `.tgz` 包，然后通过以下命令安装：

```bash
yarn add path/to/el-dynamic-forms-x.y.z.tgz
# 或者使用 npm
npm install path/to/el-dynamic-forms-x.y.z.tgz
```

### 源码编译并安装到 yarn / npm 项目中

克隆本项目到需安装的项目目录下（如 `external/el-dynamic-forms`）

```bash
git clone https://github.com/haixeefrontend/el-dynamic-forms.git external/el-dynamic-forms
```

然后运行以下命令：

```bash
yarn add el-dynamic-forms@file:./external/el-dynamic-forms
# 或者使用 npm
npm install el-dynamic-forms@file:./external/el-dynamic-forms
```

## 用法

```vue
<script setup lang="ts">
import type { BaseField } from 'el-dynamic-forms'

const fields = ref<BaseField[]>([])
</script>

<template>
  <edf-designer v-model="fields" />
</template>
```

### 国际化支持

`el-dynamic-forms` 通过 Element Plus 的国际化接口 useLocale 提供多语言支持。请确保在应用中正确配置 Element Plus 的国际化设置，以便 `el-dynamic-forms` 能够显示相应的语言内容。

要覆盖默认的翻译文本，可以在安装 `el-dynamic-forms` 时传入自定义的语言包：

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn' // 引入 Element Plus 中文包
import ElDynamicForms from 'el-dynamic-forms'

createApp(App)
  .use(ElementPlus, { locale: zhCn }) // 配置 Element Plus 语言
  .use(ElDynamicForms, {
    locales: {
      'zh-cn': {
        'edf.designer.ui.appendField': '添加字段自定义',
        // ^ 注意这里是点号分隔的路径
        // 其他可以覆盖的文本可以参考 TypeScript 类型或者 src/locales 目录下的文件
      },
    },
  })
  .mount('#app')
```

### 组件属性

#### `v-model / modelValue`

- 类型: `BaseField[]`
- 默认值: `[]`
- 描述: 用于绑定和管理表单字段的数组。未定义时组件无法正常运行。

#### `show-buttons`

- 类型: `boolean | 'hover'`
- 默认值: `true`
- 描述: 控制操作按钮的显示方式。`true` 表示始终显示，`false` 表示隐藏，`'hover'` 表示仅在鼠标悬停时显示。
