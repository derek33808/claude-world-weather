# 全球天气查询网站 - 设计文档

## 项目目标

创建一个视觉效果酷炫的全球天气查询网站，用户可以通过交互式地球查看全球各地的实时天气和温度。

## 功能描述

### 核心功能
- 🌍 3D 可旋转地球，显示全球视图
- 📍 点击任意位置查看当地天气
- 🌡️ 显示温度、天气状况、湿度、风速
- ✨ 酷炫的动画效果（粒子、光晕、过渡动画）

### 视觉效果
- 地球自动缓慢旋转
- 鼠标悬停时的光晕效果
- 点击时的涟漪动画
- 天气卡片滑入动画
- 根据天气状况变化的背景（晴天/雨天/雪天）

## 技术选型

| 类别 | 技术 | 原因 |
|------|------|------|
| 框架 | React + Vite | 快速开发，热更新 |
| 3D 地球 | Three.js + react-globe.gl | 强大的 3D 渲染能力 |
| 动画 | Framer Motion | React 生态，API 友好 |
| 样式 | Tailwind CSS | 快速构建 UI |
| 天气 API | Open-Meteo | 免费，无需 API Key |
| 地理编码 | Nominatim (OpenStreetMap) | 免费，坐标转城市名 |

## 架构设计

```
claude-world-weather/
├── DESIGN.md
├── PROGRESS.md
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── earth-texture.jpg      # 地球贴图
└── src/
    ├── main.jsx               # 入口
    ├── App.jsx                # 主组件
    ├── App.css                # 全局样式
    ├── components/
    │   ├── Globe.jsx          # 3D 地球组件
    │   ├── WeatherCard.jsx    # 天气信息卡片
    │   ├── WeatherBackground.jsx  # 动态背景
    │   └── LoadingSpinner.jsx # 加载动画
    ├── hooks/
    │   └── useWeather.js      # 天气数据 Hook
    ├── services/
    │   └── weatherApi.js      # API 调用
    └── utils/
        └── animations.js      # 动画配置
```

## 页面布局

```
┌─────────────────────────────────────────────┐
│  🌍 Global Weather Explorer          [主题] │
├─────────────────────────────────────────────┤
│                                             │
│              ┌─────────┐                    │
│              │         │                    │
│              │  3D     │    ┌────────────┐  │
│              │  地球   │    │ 天气卡片   │  │
│              │         │    │ 城市: 东京 │  │
│              │         │    │ 温度: 15°C │  │
│              └─────────┘    │ 状况: 晴   │  │
│                             └────────────┘  │
│                                             │
│  💡 点击地球上任意位置查看天气               │
└─────────────────────────────────────────────┘
```

## 动画效果详情

1. **地球动画**
   - 自动旋转（可暂停）
   - 鼠标拖拽旋转
   - 缩放支持

2. **点击反馈**
   - 点击位置出现脉冲涟漪
   - 标记点放大动画

3. **天气卡片**
   - 从右侧滑入
   - 数据更新时的数字翻转效果

4. **背景效果**
   - 晴天：温暖渐变 + 光点粒子
   - 雨天：蓝灰渐变 + 雨滴粒子
   - 雪天：冷色渐变 + 雪花粒子

## 实现计划

### 阶段一：基础框架 (Agent 1)
- 初始化 React + Vite 项目
- 安装依赖
- 创建基本文件结构

### 阶段二：3D 地球 (Agent 2)
- 实现 3D 地球渲染
- 添加旋转和交互
- 点击获取坐标

### 阶段三：天气功能 (Agent 3)
- 集成天气 API
- 实现坐标转城市名
- 创建天气卡片组件

### 阶段四：动画效果 (Agent 4)
- 添加背景动画
- 点击涟漪效果
- 卡片过渡动画

### 阶段五：优化完善 (Agent 5)
- 响应式适配
- 性能优化
- 测试和修复

## API 说明

### Open-Meteo 天气 API（免费）
```
GET https://api.open-meteo.com/v1/forecast
?latitude=35.6762&longitude=139.6503
&current_weather=true
&hourly=temperature_2m,relativehumidity_2m
```

### Nominatim 地理编码（免费）
```
GET https://nominatim.openstreetmap.org/reverse
?lat=35.6762&lon=139.6503&format=json
```

## 预期效果

一个视觉震撼的天气网站：
- 首次加载看到旋转的 3D 地球
- 点击任意位置，涟漪扩散
- 天气卡片优雅滑入
- 背景根据天气变化
- 整体流畅、现代、酷炫
