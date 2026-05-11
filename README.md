# Selector

[中文](#中文) | [English](#english)

## 中文

Point at any element. Tell your AI what to change.

Selector 是一个 Chromium 浏览器扩展，用来在真实页面上直接选择元素、为每个元素补充修改说明，并复制一段可直接交给 AI 编程助手处理的结构化 prompt。

### 上游来源

本项目基于原始项目 [oil-oil/selector](https://github.com/oil-oil/selector) 演化而来，并在此基础上调整为 Chromium 浏览器扩展激活方式，补充了扩展入口、popup 流程和面向 AI 修改场景的 prompt 输出优化。

### 功能

- 从浏览器工具栏一键激活
- 通过 `Alt+Shift+S`（Windows/Linux）或 `Command+Shift+S`（macOS）打开次级 popup 入口
- 在页面上直接选择一个或多个元素
- 为每个选中元素添加单独说明
- 复制包含页面标识、DOM 路径、邻近上下文文本和 HTML 证据的 prompt
- 在页面支持的开发环境下附带 React 调试信息

### 安装

当前通过“加载已解压的扩展程序”方式安装。

1. 打开浏览器扩展页面：
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
2. 打开 **开发者模式**
3. 点击 **加载已解压的扩展程序**
4. 选择当前仓库目录
5. 将 **Selector** 固定到工具栏，便于快速使用

### 使用方式

1. 打开目标页面
2. 点击 **Selector** 工具栏图标
3. 点击一个元素进行选择
4. 使用 `Shift + Click` 追加选择
5. 如有需要，在浮层面板中添加备注
6. 按 `Cmd/Ctrl+C` 或点击 **Copy Prompt**
7. 将结果粘贴给 Claude Code、Codex、Cursor 或其他 AI 编程助手

popup 是次级入口，可通过以下快捷键打开：

- Windows / Linux: `Alt+Shift+S`
- macOS: `Command+Shift+S`

### 快捷键

| 操作 | 作用 |
|---|---|
| `Click` | 选择元素 |
| `Shift + Click` | 追加选择 |
| `Drag` | 框选多个元素 |
| `Left / Right` | 切换到父元素 / 子元素 |
| `Up / Down` | 切换到上一个 / 下一个同级元素 |
| `Cmd/Ctrl+C` | 复制 prompt |
| `Cmd/Ctrl+Z` | 撤销上一次选择变化 |
| `Space` | 暂停 / 继续选择 |
| `Esc` | 清空当前选择 |

### Prompt 输出

Selector 的目标只有一个：给 AI 足够的信息，让它能追溯到页面上的真实位置并据此改代码。

复制出的 prompt 包含：

- `Page`：业务页面标识，支持 hash 路由
- `selector`：选中节点的运行时 DOM 路径
- `text`：选中节点的标准化文本
- `context`：邻近同级文本，用来区分重复按钮或相似控件
- `html`：截断后的 HTML 片段
- `instruction`：你为当前元素补充的说明

示例：

```text
Page: #/pages/fun/edit?mode=edit&groupId=123

1. span "Delete" <span>
   selector: #app > uni-app > uni-page > uni-page-wrapper > uni-page-body > uni-view > uni-view:nth-of-type(1) > uni-view > uni-text:nth-of-type(3) > span
   text: "Delete"
   context: Edit | Delete | Save
   html: <span>Delete</span>
   instruction: Turn this into a destructive action button and add a confirmation flow
```

### 支持页面

Selector 适用于 Chromium 允许注入脚本和样式的普通网页。

以下页面通常无法运行：

- `chrome://*`
- 扩展自身页面
- 浏览器内部页面
- 其他被浏览器扩展安全模型限制的页面

### 隐私

- 所有逻辑都在本地页面和扩展上下文中运行
- Selector 不会把页面内容发送到远端服务
- 复制结果只会写入你的本地剪贴板

### 仓库结构

- [manifest.json](manifest.json)：MV3 扩展清单
- [background.js](background.js)：激活和注入流程
- [assets/runtime.js](assets/runtime.js)：页面内运行时逻辑
- [assets/editor.css](assets/editor.css)：注入的界面样式
- [popup/popup.html](popup/popup.html)：次级 popup 入口
- [docs/superpowers/specs](docs/superpowers/specs)：扩展改造设计文档
- [docs/superpowers/plans](docs/superpowers/plans)：实施计划归档

### 开发

```bash
git clone git@github.com:petra1218/selector-ai.git
cd selector
```

本地迭代方式：

1. 修改仓库中的源文件
2. 在浏览器扩展页重新加载该扩展
3. 刷新目标页面后重新激活 Selector

当前没有构建步骤。

### 贡献

参见 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 安全

参见 [SECURITY.md](SECURITY.md)。

### 许可证

MIT，见 [LICENSE](LICENSE)。

## English

Point at any element. Tell your AI what to change.

Selector is a Chromium extension for visually selecting elements on a live page, attaching per-element instructions, and copying a prompt that an AI coding assistant can act on.

### Upstream

This project is derived from [oil-oil/selector](https://github.com/oil-oil/selector) and extends it with a Chromium extension activation flow, popup entry support, and prompt output improvements for AI-assisted UI changes.

### Features

- Activate from the browser toolbar with one click
- Open a secondary popup entry with `Alt+Shift+S` on Windows/Linux or `Command+Shift+S` on macOS
- Select one or many elements directly on the page
- Add an instruction to each selected element
- Copy a structured prompt with page identity, DOM selector, nearby context text, and HTML evidence
- Include React debug info when the page exposes it in development

### Installation

Selector is currently installed as an unpacked extension.

1. Open your browser's extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
2. Turn on **Developer mode**
3. Click **Load unpacked**
4. Select this repository folder
5. Pin **Selector** to the toolbar for quick access

### Usage

1. Open the target page
2. Click the **Selector** toolbar icon
3. Click an element to select it
4. Use `Shift + Click` to add more elements
5. Add notes from the floating panel if needed
6. Press `Cmd/Ctrl+C` or click **Copy Prompt**
7. Paste the result into Claude Code, Codex, Cursor, or another coding assistant

The popup is a secondary entry. Open it with:

- Windows / Linux: `Alt+Shift+S`
- macOS: `Command+Shift+S`

### Shortcuts

| Action | Effect |
|---|---|
| `Click` | Select element |
| `Shift + Click` | Add to selection |
| `Drag` | Marquee select multiple elements |
| `Left / Right` | Move to parent / child element |
| `Up / Down` | Move to previous / next sibling |
| `Cmd/Ctrl+C` | Copy prompt |
| `Cmd/Ctrl+Z` | Undo last selection change |
| `Space` | Pause / resume selection |
| `Esc` | Clear selection |

### Prompt output

Selector is optimized for one job: give an AI enough information to trace the real page location of the selected element.

The copied prompt includes:

- `Page`: business page identity, including hash-based routes when present
- `selector`: runtime DOM path for the selected node
- `text`: normalized text from the selected node
- `context`: nearby sibling text to help disambiguate repeated controls
- `html`: a truncated HTML snapshot of the selected node
- `instruction`: your optional per-element note

Example:

```text
Page: #/pages/fun/edit?mode=edit&groupId=123

1. span "Delete" <span>
   selector: #app > uni-app > uni-page > uni-page-wrapper > uni-page-body > uni-view > uni-view:nth-of-type(1) > uni-view > uni-text:nth-of-type(3) > span
   text: "Delete"
   context: Edit | Delete | Save
   html: <span>Delete</span>
   instruction: Turn this into a destructive action button and add a confirmation flow
```

### Supported pages

Selector works on normal web pages where Chromium extensions are allowed to inject scripts and styles.

It does not run on restricted pages such as:

- `chrome://*`
- extension pages
- browser internal pages
- other pages blocked by the browser's extension security model

### Privacy

- Everything runs locally in the page and extension context
- Selector does not send page content to a remote service
- Copied output is only written to your clipboard

### Repository layout

- [manifest.json](manifest.json): MV3 extension manifest
- [background.js](background.js): activation and injection flow
- [assets/runtime.js](assets/runtime.js): page runtime used by the extension
- [assets/editor.css](assets/editor.css): injected UI styles
- [popup/popup.html](popup/popup.html): secondary popup entry
- [docs/superpowers/specs](docs/superpowers/specs): design notes for the extension migration
- [docs/superpowers/plans](docs/superpowers/plans): implementation plan archive

### Development

```bash
git clone git@github.com:petra1218/selector-ai.git
cd selector
```

For local iteration:

1. Edit the source files in this repository
2. Reload the unpacked extension from the browser extensions page
3. Reopen the target page and activate Selector again

There is no build step.

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

### Security

See [SECURITY.md](SECURITY.md).

### License

MIT. See [LICENSE](LICENSE).
