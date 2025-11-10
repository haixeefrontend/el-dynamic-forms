# Element Plus 味动态表单

`el-dynamic-forms` 是一个基于 [Element Plus](https://element-plus.org/) 的动态表单生成库，旨在简化表单的创建和管理过程。通过配置化的方式，用户可以轻松定义复杂的表单结构和验证规则。

## 用法

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
