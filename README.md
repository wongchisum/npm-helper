# npm helper

npm helper 是一个 Chrome 扩展程序，旨在增强 npmjs.com 的包查看体验。它能帮助开发者更好地了解 npm 包的质量、相似包以及包体积等信息。

DeepWiki: https://deepwiki.com/wongchisum/npm-helper

## 效果图

![效果图](https://github.com/wongchisum/npm-helper/blob/release/TinySnap-2025-06-27-16.45.55.png?raw=true)


## 功能特性

- 📊 展示包的评分信息
  - 综合得分
  - 流行度
  - 代码质量
  - 维护性
- 📦 推荐相似的 npm 包
- 📈 快速访问包体积分析
- 🔄 支持多个包的对比功能
- 📝 展示包的中文详细描述

## 使用场景

1. **选择依赖包时**

   - 通过评分快速判断包的质量
   - 查看相似包进行横向对比
   - 分析包体积避免引入过大依赖

2. **调研技术方案时**
   - 了解同类型的技术方案
   - 评估不同包的维护状况
   - 对比多个包的优劣

## 开发指南

### 技术栈

- TypeScript

- Vite

- Chrome Extension Manifest V3

- CRXJS

## 安装使用

1. 克隆项目到本地

```bash
git clone [repository-url]
cd npm-helper
```

2. 安装依赖

```bash
npm install
```

3. 开发项目

```bash
npm run dev
```

4. 打包项目

```bash
npm run build
```
