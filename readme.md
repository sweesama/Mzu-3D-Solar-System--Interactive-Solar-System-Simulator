# 🌌 Mzu 3D Solar System - Interactive Solar System Simulator

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)](https://www.khronos.org/webgl/)

> 🚀 An advanced 3d solar system simulator with realistic planets, relaxing music, and therapeutic space visualization built with Three.js

**Language / 语言**: [English](#english) | [中文](#中文)

![Solar System Preview]https://www.3dsolarsystem.net/

---

## ⚠️ Important Disclaimer

**This is an artistic and educational visualization, not a real-time astronomical simulation.**

- 🎨 **Artistic Processing**: Some celestial data has been modified for visual appeal and educational purposes
- 📏 **Scale Adjustments**: Sizes, distances, and orbital periods are not to scale for better viewing experience
- 🚫 **Not Real-Time**: This is not a live astronomical tracker or professional astronomy tool
- 🎓 **Educational Purpose**: Designed for learning and entertainment, not scientific research

---

# English

## �?Key Features

### 🪐 Complete Celestial System
- **8 Major Planets** + **5 Dwarf Planets**: From Mercury to Neptune, including Pluto, Ceres, etc.
- **Moon Systems**: Earth's Moon, Jupiter's moons, Saturn's moons, and other major satellites
- **Small Bodies**: Asteroid Belt, Kuiper Belt, comets
- **Solar System**: Solar flares and corona effects

### 🎨 Visual Effects
- **Procedural Textures**: Each celestial body has unique surface textures
- **Atmospheric Effects**: Atmospheric rendering for Earth, Venus, Mars, and other planets
- **Lighting System**: Realistic solar lighting and shadow effects
- **Particle Systems**: Stardust, comet tails, planetary rings

### 🎵 Immersive Experience
- **Background Music**: Beethoven's "Moonlight Sonata" creates cosmic atmosphere
- **Orbit Glow**: Toggleable glowing orbit line effects
- **Info Cards**: Click on celestial bodies to view detailed information
- **Smooth Animation**: Celestial motion and camera controls

### 📱 Modern Interaction
- **Responsive Design**: Perfect adaptation for desktop and mobile devices
- **Touch Optimized**: Mobile-friendly operation experience
- **Real-time Rendering**: Smooth 60FPS performance
- **No Installation**: Pure web technology, ready to use

---

## 🚀 Quick Start

### Method 1: Local Running
1. **Clone the Project**
   ```bash
   git clone https://github.com/yourusername/mzu-solar-system.git
   cd mzu-solar-system
   ```

2. **Start Local Server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Python 2
   python -m SimpleHTTPServer 8000
   
   # Or using Node.js
   npx serve .
   ```

3. **Open Browser**
   ```
   http://localhost:8000/待修版本.html
   ```

### Method 2: GitHub Pages
Direct access to online demo: `https://yourusername.github.io/mzu-solar-system`

## 🎮 User Guide

### Basic Operations
- **Rotate View**: Left mouse drag
- **Zoom**: Mouse wheel or pinch gesture
- **Pan**: Right mouse drag (desktop)

### Function Buttons
- **🎵 Music**: Control background music play/pause
- **🪐 Orbit**: Toggle orbit line glow effects

### Information Viewing
- Click on any celestial body to view detailed information
- Info panel displays: Name, Type, Radius, Orbital parameters, etc.
- Click the �?in the top-right corner of the panel to close

## 🛠�?Tech Stack

### Core Technologies
- **Three.js r128** - 3D graphics rendering engine
- **WebGL** - Hardware-accelerated 3D graphics
- **Canvas 2D API** - Procedural texture generation
- **Web Audio API** - Background music playback

### External Dependencies
```html
<!-- Three.js Core Library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- Orbit Controls -->
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>

<!-- Lens Flare Effects -->
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/objects/Lensflare.js"></script>
```

### Audio Resources
- **Primary Source**: Archive.org - Beethoven's "Moonlight Sonata"
- **Fallback Sources**: Multiple CDNs ensure availability

## 📊 Celestial Data

### Planetary System
| Body | Radius (km) | Orbit Radius (AU) | Eccentricity | Moons |
|------|-------------|-------------------|--------------|-------|
| Mercury | 2,439.7 | 0.387 | 0.2056 | 0 |
| Venus | 6,051.8 | 0.723 | 0.0067 | 0 |
| Earth | 6,371.0 | 1.000 | 0.0167 | 1 |
| Mars | 3,389.5 | 1.524 | 0.0934 | 2 |
| Jupiter | 69,911 | 5.204 | 0.0489 | 4+ |
| Saturn | 58,232 | 9.583 | 0.0565 | 3+ |
| Uranus | 25,362 | 19.218 | 0.0457 | 5 |
| Neptune | 24,622 | 30.110 | 0.0113 | 2 |

### Dwarf Planets
- **Pluto System**: Pluto + 5 moons
- **Ceres**: Largest asteroid belt object
- **Eris, Haumea, Makemake**: Kuiper Belt objects

## 🎨 Visual Effects Details

### Procedural Textures
- **Earth**: Land-sea distribution, clouds, atmosphere
- **Jupiter**: Banded structure, Great Red Spot
- **Saturn**: Ring system, Cassini Division
- **Sun**: Dynamic surface texture, flare effects

### Orbital System
- **Elliptical Orbits**: Real orbital calculations based on Kepler's laws
- **Orbital Inclination**: Considers orbital plane tilt
- **Eccentricity**: True elliptical orbit shapes

## 📱 Mobile Optimization

### Responsive Design
```css
/* Tablet devices (�?68px) */
@media (max-width: 768px) {
    /* Button size and spacing optimization */
}

/* Mobile devices (�?80px) */
@media (max-width: 480px) {
    /* More compact layout */
}
```

### Touch Optimization
- Touch drag rotation
- Pinch-to-zoom
- Button sizes adapted for finger tapping

## 🔧 Customization

### Adding New Celestial Bodies
```javascript
const newPlanet = {
    name: 'CustomPlanet',
    displayName: 'Custom Planet',
    type: "Planet",
    radius: 1.0,
    radiusMetric: 6371.0,
    orbitRadius: 50,
    orbitSemiMajorAxisAU: 2.0,
    e: 0.05,
    speed: 0.02,
    color: 0xff6b6b
};
```

### Modifying Orbit Colors
```javascript
// Planet orbits: Purple glow
orbitLine.material.color.setHex(0x9966ff);

// Moon orbits: Blue glow
orbitLine.material.color.setHex(0x66aaff);
```

## 🐛 Known Issues

- **Audio Autoplay**: Limited by browser policies, requires user interaction
- **Mobile Performance**: May experience frame drops on low-end devices
- **CDN Dependencies**: External audio CDNs may occasionally be unavailable

## 🤝 Contributing

Contributions are welcome! Please feel free to submit Issues and Pull Requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **Three.js** - Powerful 3D graphics library
- **NASA** - Astrophysical data sources
- **Archive.org** - Free audio resources
- **Beethoven** - "Moonlight Sonata"

## 📞 Contact

- Project Link: [https://github.com/yourusername/mzu-solar-system](https://github.com/yourusername/mzu-solar-system)
- Live Demo: [https://yourusername.github.io/mzu-solar-system](https://yourusername.github.io/mzu-solar-system)

---

�?If this project helps you, please give it a star!

---

# 中文

## �?主要特�?

### 🪐 完整天体系统
- **8大行�?* + **5颗矮行星**：从水星到海王星，包括冥王星、谷神星�?
- **卫星系统**：月球、木星卫星、土星卫星等主要卫星
- **小天�?*：小行星带、柯伊伯带、彗�?
- **太阳系统**：太阳耀斑和日冕效果

### 🎨 视觉效果
- **程序化纹�?*：每个天体都有独特的表面纹理
- **大气效果**：地球、金星、火星等行星的大气层渲染
- **光照系统**：真实的太阳光照和阴影效�?
- **粒子系统**：星尘、彗星尾巴、行星环

### 🎵 沉浸式体�?
- **背景音乐**：贝多芬《月光奏鸣曲》营造宇宙氛�?
- **轨道发光**：可切换的轨道线发光效果
- **信息卡片**：点击天体查看详细信�?
- **流畅动画**：天体运动和相机控制

### 📱 现代化交�?
- **响应式设�?*：完美适配桌面和移动设�?
- **触摸优化**：移动端友好的操作体�?
- **实时渲染**：流畅的60FPS性能
- **无需安装**：纯Web技术，即开即用

---

## 🚀 快速开�?

### 方法一：本地运�?
1. **克隆项目**
   ```bash
   git clone https://github.com/yourusername/mzu-solar-system.git
   cd mzu-solar-system
   ```

2. **启动本地服务�?*
   ```bash
   # Python 3
   python -m http.server 8000
   
   # 或�?Python 2
   python -m SimpleHTTPServer 8000
   
   # 或者使�?Node.js
   npx serve .
   ```

3. **打开浏览�?*
   ```
   http://localhost:8000/待修版本.html
   ```

### 方法二：GitHub Pages
直接访问在线演示：`https://yourusername.github.io/mzu-solar-system`

## 🎮 使用指南

### 基本操作
- **旋转视角**：鼠标左键拖�?
- **缩放**：鼠标滚轮或双指缩放
- **平移**：鼠标右键拖拽（桌面端）

### 功能按钮
- **🎵 Music**：控制背景音乐播�?暂停
- **🪐 Orbit**：切换轨道线发光效果

### 信息查看
- 点击任意天体查看详细信息
- 信息面板显示：名称、类型、半径、轨道参数等
- 点击面板右上�?�?关闭

## 🛠�?技术栈

### 核心技�?
- **Three.js r128** - 3D图形渲染引擎
- **WebGL** - 硬件加�?D图形
- **Canvas 2D API** - 程序化纹理生�?
- **Web Audio API** - 背景音乐播放

### 外部依赖
```html
<!-- Three.js 核心�?-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- 轨道控制�?-->
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>

<!-- 镜头光晕效果 -->
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/objects/Lensflare.js"></script>
```

### 音频资源
- **主音�?*：Archive.org - 贝多芬《月光奏鸣曲�?
- **备用音源**：多个CDN确保可用�?

## 📊 天体数据

### 行星系统
| 天体 | 半径(km) | 轨道半径(AU) | 偏心�?| 卫星�?|
|------|----------|--------------|--------|--------|
| 水星 | 2,439.7 | 0.387 | 0.2056 | 0 |
| 金星 | 6,051.8 | 0.723 | 0.0067 | 0 |
| 地球 | 6,371.0 | 1.000 | 0.0167 | 1 |
| 火星 | 3,389.5 | 1.524 | 0.0934 | 2 |
| 木星 | 69,911 | 5.204 | 0.0489 | 4+ |
| 土星 | 58,232 | 9.583 | 0.0565 | 3+ |
| 天王�?| 25,362 | 19.218 | 0.0457 | 5 |
| 海王�?| 24,622 | 30.110 | 0.0113 | 2 |

### 矮行�?
- **冥王星系�?*：冥王星 + 5颗卫�?
- **谷神�?*：小行星带最大天�?
- **阋神星、妊神星、鸟神星**：柯伊伯带天�?

## 🎨 视觉特效详解

### 程序化纹�?
- **地球**：海陆分布、云层、大气层
- **木星**：条纹结构、大红斑
- **土星**：环系统、卡西尼缝隙
- **太阳**：动态表面纹理、耀斑效�?

### 轨道系统
- **椭圆轨道**：基于开普勒定律的真实轨道计�?
- **轨道倾角**：考虑轨道平面倾斜
- **偏心�?*：椭圆轨道的真实形状

## 📱 移动端优�?

### 响应式设�?
```css
/* 平板设备 (�?68px) */
@media (max-width: 768px) {
    /* 按钮大小和间距优�?*/
}

/* 手机设备 (�?80px) */
@media (max-width: 480px) {
    /* 更紧凑的布局 */
}
```

### 触摸优化
- 触摸拖拽旋转
- 双指缩放
- 按钮大小适配手指点击

## 🔧 自定义配�?

### 添加新天�?
```javascript
const newPlanet = {
    name: 'CustomPlanet',
    displayName: 'Custom Planet',
    type: "Planet",
    radius: 1.0,
    radiusMetric: 6371.0,
    orbitRadius: 50,
    orbitSemiMajorAxisAU: 2.0,
    e: 0.05,
    speed: 0.02,
    color: 0xff6b6b
};
```

### 修改轨道颜色
```javascript
// 行星轨道：紫色发�?
orbitLine.material.color.setHex(0x9966ff);

// 卫星轨道：蓝色发�?
orbitLine.material.color.setHex(0x66aaff);
```

## 🐛 已知问题

- **音频自动播放**：受浏览器政策限制，需用户手动点击开�?
- **移动端性能**：在低端设备上可能出现帧率下�?
- **CDN依赖**：外部音频CDN可能偶尔不可�?

## 🤝 贡献指南

欢迎提交Issue和Pull Request�?

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开�?Pull Request

## 📄 许可�?

本项目采�?MIT 许可�?- 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- **Three.js** - 强大�?D图形�?
- **NASA** - 天体物理学数据来�?
- **Archive.org** - 免费音频资源
- **贝多�?* - 《月光奏鸣曲�?

## 📞 联系方式

- 项目链接：[https://github.com/yourusername/mzu-solar-system](https://github.com/yourusername/mzu-solar-system)
- 在线演示：[https://yourusername.github.io/mzu-solar-system](https://yourusername.github.io/mzu-solar-system)

---

�?如果这个项目对你有帮助，请给它一个星标！

