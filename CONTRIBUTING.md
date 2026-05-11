# Contributing / 贡献指南

## 中文

感谢你为 Selector 做贡献。

### 本地准备

1. 克隆仓库
2. 打开 Chromium 浏览器的扩展页面
3. 开启 **开发者模式**
4. 使用 **加载已解压的扩展程序** 选择当前仓库
5. 每次修改后重新加载扩展

### 开发说明

- 当前没有构建步骤
- 页面运行时逻辑在 [assets/runtime.js](assets/runtime.js)
- popup 入口在 [popup](popup)
- 激活流程在 [background.js](background.js)

### Pull Request

- 改动范围尽量聚焦在当前问题
- 行为变化时同步更新文档
- 涉及 UI 行为时，附带明确的复现和验证说明
- 不要提交本地浏览器配置、临时文件或调试产物

### Issue 建议包含的信息

- 浏览器名称和版本
- 目标页面类型
- 期望行为
- 实际行为
- 与问题相关的 Selector 输出

## English

Thanks for contributing to Selector.

### Local setup

1. Clone the repository
2. Open your Chromium browser's extensions page
3. Turn on **Developer mode**
4. Use **Load unpacked** and select this repository
5. Reload the extension after each change

### Development notes

- There is no build step
- The runtime lives in [assets/runtime.js](assets/runtime.js)
- The popup entry lives in [popup](popup)
- The activation flow lives in [background.js](background.js)

### Pull requests

- Keep changes scoped to the problem being solved
- Update documentation when behavior changes
- Include clear reproduction and verification notes for UI behavior changes
- Avoid committing local browser profiles, temp files, or generated scratch files

### Suggested issue details

- browser name and version
- target page type
- expected behavior
- actual behavior
- copied Selector output when relevant
