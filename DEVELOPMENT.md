# 匿名活动组织平台 - 开发文档

## 🎯 项目概述

这是一个基于 Web3 技术构建的去中心化匿名活动组织平台，用户可以创建、参与和管理各种匿名活动。

### 技术栈
- **前端框架**: Next.js 15 + React 19
- **Web3 工具**: OnchainKit (Coinbase)
- **区块链交互**: Wagmi + Viem
- **样式**: CSS Modules
- **类型安全**: TypeScript

---

## 📂 项目结构

```
my-onchainkit-app/
├── app/
│   ├── components/          # 共享组件
│   │   ├── Navigation.tsx   # 导航栏组件
│   │   └── Navigation.module.css
│   ├── rankings/            # 活动排行榜页面
│   │   ├── page.tsx
│   │   └── rankings.module.css
│   ├── page.tsx             # 首页
│   ├── layout.tsx           # 根布局
│   └── rootProvider.tsx     # OnchainKit Provider
├── public/                  # 静态资源
└── package.json
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd my-onchainkit-app
npm install
```

### 2. 配置环境变量（可选）

创建 `.env.local` 文件：

```env
# Coinbase Developer Platform API Key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here

# 项目名称
NEXT_PUBLIC_PROJECT_NAME=匿名活动组织平台
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

---

## 📄 已完成的页面

### 1. 首页 (`/`)
- ✅ 钱包连接功能
- ✅ 平台功能介绍
- ✅ 快速导航按钮
- ✅ 响应式设计

### 2. 活动排行榜 (`/rankings`)
- ✅ 多种排行榜类型：
  - 🔥 最热门
  - 🚀 即将开始
  - 👥 参与人数
  - ⏰ 最新发布
- ✅ 活动卡片展示
- ✅ 匿名等级标识（公开/半匿名/完全匿名）
- ✅ 统计信息面板
- ✅ 响应式设计

### 3. 全局导航栏
- ✅ Logo 和品牌标识
- ✅ 页面导航链接
- ✅ 当前页面高亮
- ✅ 移动端适配

---

## 🎨 核心功能说明

### 活动排行榜功能

#### 数据结构
```typescript
interface Event {
  id: string;              // 活动 ID
  name: string;            // 活动名称
  description: string;     // 活动描述
  participants: number;    // 参与人数
  startTime: Date;         // 开始时间
  category: string;        // 活动分类
  anonymousLevel: "low" | "medium" | "high"; // 匿名等级
  organizer?: string;      // 组织者（可选）
}
```

#### 排序逻辑
- **最热门**: 按参与人数降序
- **即将开始**: 过滤未来活动 + 按时间升序
- **参与人数**: 按参与人数降序
- **最新发布**: 按时间降序

---

## 🔧 后续开发计划

### 待实现页面

#### 1. 创建活动页面 (`/create`)
- [ ] 活动信息表单
- [ ] 匿名等级选择
- [ ] 链上发布功能
- [ ] 活动验证机制

#### 2. 我的活动页面 (`/my-events`)
- [ ] 已创建活动列表
- [ ] 已参与活动列表
- [ ] 活动管理功能

#### 3. 活动详情页面 (`/events/[id]`)
- [ ] 活动完整信息
- [ ] 参与按钮
- [ ] 评论/讨论区
- [ ] 签到功能

#### 4. 用户身份页面 (`/profile`)
- [ ] 匿名身份管理
- [ ] 信誉系统
- [ ] 参与历史

---

## 🔗 Web3 集成计划

### 智能合约开发（使用 Foundry）

#### 1. 初始化合约项目
```bash
# 在项目根目录
forge init contracts --no-git
cd contracts
```

#### 2. 核心合约功能
- **EventFactory.sol**: 活动创建和管理
- **EventRegistry.sol**: 活动注册表
- **AnonymousIdentity.sol**: 匿名身份管理
- **Reputation.sol**: 信誉系统

#### 3. 合约交互
```typescript
// 使用 Wagmi 和 Viem
import { useContractRead, useContractWrite } from 'wagmi';

// 读取活动数据
const { data: events } = useContractRead({
  address: '0x...',
  abi: EventFactoryABI,
  functionName: 'getEvents',
});

// 创建活动
const { write: createEvent } = useContractWrite({
  address: '0x...',
  abi: EventFactoryABI,
  functionName: 'createEvent',
});
```

---

## 📝 开发规范

### 代码风格
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码

### 组件规范
- 使用函数式组件和 Hooks
- CSS Modules 进行样式隔离
- 响应式设计优先

### Git 提交规范
```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 样式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具链相关
```

---

## 🧪 测试

```bash
# 运行测试
npm test

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

---

## 🏗️ 构建和部署

### 构建生产版本
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

### 部署到 Vercel（推荐）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

---

## 📚 相关文档

- [OnchainKit 文档](https://docs.base.org/onchainkit)
- [Next.js 文档](https://nextjs.org/docs)
- [Wagmi 文档](https://wagmi.sh)
- [Viem 文档](https://viem.sh)
- [Foundry 文档](https://book.getfoundry.sh)

---

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 License

MIT License

---

## 💡 后续优化建议

### 性能优化
- [ ] 实现虚拟滚动（活动列表较长时）
- [ ] 添加数据缓存机制
- [ ] 图片懒加载

### 用户体验
- [ ] 添加加载动画
- [ ] 实现骨架屏
- [ ] 添加错误边界
- [ ] 优化移动端体验

### 安全性
- [ ] 实现签名验证
- [ ] 添加速率限制
- [ ] 实施内容审核

### 可访问性
- [ ] ARIA 标签优化
- [ ] 键盘导航支持
- [ ] 色盲友好模式

---

**开发者**: Nora AI
**最后更新**: 2024
