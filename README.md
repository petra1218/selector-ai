# Selector

Point at any element. Tell your AI what to change.

Selector is a Chromium extension that lets you visually select elements on any web page, add instructions, and copy a structured prompt to Claude Code, Codex, Cursor, or any other AI coding assistant.

## Install

1. Open your Chromium browser's extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this project folder.
5. Pin **Selector** to the toolbar if you want one-click access.

Primary entry: click the Selector toolbar icon to activate it on the current page.

Secondary entry: open the popup with the keyboard shortcut:

- `Alt+Shift+S` on Windows / Linux
- `Command+Shift+S` on macOS

The popup lets you start Selector without using the toolbar click, but it is not the default activation path.

## Usage

Open any supported web page, then click the **Selector** toolbar icon.

| Action | What it does |
|---|---|
| **Click** | Select an element |
| **Shift + Click** | Add to selection |
| **Drag** | Marquee select multiple elements |
| **Left / Right*** | Navigate to parent / child element |
| **Up / Down*** | Navigate to previous / next sibling |
| **Annotate button** | Add per-element instruction |
| **Cmd/Ctrl+C** | Copy prompt to clipboard |
| **Cmd/Ctrl+Z** | Undo last selection change |
| **Space** | Pause / resume selecting |
| **Esc** | Clear selection |

The copied prompt includes element metadata (tag, selector, text, React component info) plus any per-element instructions you added.

## Example output

```
Page: /dashboard

1. .hero-title <h1>
   selector: body > main > section > h1
   source: src/components/Hero.tsx:12
   react: Layout -> Hero
   text: "Welcome to the Dashboard"
   html: <h1 class="hero-title">Welcome to the Dashboard</h1>
   instruction: Make this red and larger

2. .sidebar <nav>
   selector: body > aside > nav
   text: "Home Settings Profile Logout"
   html: <nav class="sidebar">...</nav>
   instruction: Add an "Analytics" link after "Settings"
```

## How it works

The extension injects `assets/editor.css` and `assets/runtime.js` into the current page. Everything runs client-side; no data is sent anywhere.

Toolbar click starts Selector directly on the active tab. The popup is available as a secondary entry point and can also be opened with the command shortcut above.

## Development

```bash
git clone https://github.com/oil-oil/selector.git
cd selector
# Edit assets/runtime.js and assets/editor.css
# Load the unpacked extension in a Chromium browser for local testing
```

## License

MIT
