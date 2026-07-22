# Curator's Archive — PWA 部署設定

## 檔案放哪

```
你的專案/
├── vercel.json          ← 放專案根目錄
├── public/
│   ├── manifest.json    ← 放這裡(Expo 會把 public/ 原封不動複製到 dist/)
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       ├── icon-maskable-192.png
│       └── icon-maskable-512.png
└── app.json
```

Expo SDK 50+ 會自動把 `public/` 的內容複製到 `dist/` 根目錄。

---

## 1. app.json 要加的設定

```json
{
  "expo": {
    "name": "Curator's Archive",
    "slug": "curators-archive",
    "web": {
      "bundler": "metro",
      "output": "single",
      "favicon": "./assets/favicon.png"
    }
  }
}
```

`"output": "single"` = SPA 模式,配合 vercel.json 的 rewrites 讓 expo-router 的路由正常運作。
如果想要每個路由各自有靜態 HTML(SEO 較好、首屏較快),改成 `"output": "static"`,
並把 vercel.json 裡的 `rewrites` 整段刪掉。

---

## 2. 讓 manifest 被載入

Expo Router 需要自訂 HTML 才能塞 `<link rel="manifest">`。建立 `app/+html.tsx`:

```tsx
import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f0e0c" />

        {/* iOS 專用 — Safari 不完全吃 manifest,這幾行才是關鍵 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Archive" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**注意**:iOS Safari 對 `manifest.json` 的支援不完整。`apple-mobile-web-app-capable`
跟 `apple-touch-icon` 這兩行才是「加入主畫面後全螢幕 + 有正確圖示」的真正關鍵。

---

## 3. 圖示

需要 4 個 PNG。用你現有的 App icon 產:

```bash
npx @expo/image-utils  # 或直接用任何工具 resize
```

- `icon-192.png` / `icon-512.png`:一般圖示,整張都會顯示
- `icon-maskable-*.png`:Android 會裁切,主要內容要留在中央 80% 的安全區內

只做 iOS 展示的話,`icon-192.png` + `apple-touch-icon` 就夠了。

---

## 4. expo-sqlite 在 web

SDK 51+ 內建 web 支援(走 wa-sqlite + OPFS)。要確認:

```bash
npx expo install expo-sqlite
```

程式碼上,`openDatabaseAsync` 在 web 一樣可用。但要注意:

- **必須用 async API**(`openDatabaseAsync` / `execAsync` / `getAllAsync`)。
  同步版的 `openDatabaseSync` 在 web 需要 OPFS SyncAccessHandle,只在 Web Worker 裡可用。
- COEP/COOP headers 必須設好(vercel.json 已經處理),否則 OPFS 被擋。
- 本機測試時 `npx expo start --web` 的 dev server **不會**套用 vercel.json 的 headers。
  要驗證 SQLite,先 build 再用支援 headers 的 server 測(見下方)。

---

## 5. 本機驗證

```bash
# 1. build
npx expo export --platform web

# 2. 用帶 COEP headers 的 server 跑 dist/
npx serve dist --cors -l 3000
```

`serve` 不支援自訂 headers,所以用這個小腳本代替:

```js
// serve-test.js
const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

  let file = path.join(__dirname, 'dist', req.url.split('?')[0]);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(__dirname, 'dist', 'index.html');
  }
  const ext = path.extname(file);
  const types = {
    '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
    '.json': 'application/json', '.wasm': 'application/wasm',
    '.png': 'image/png', '.svg': 'image/svg+xml',
  };
  res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(3000, () => console.log('http://localhost:3000'));
```

```bash
node serve-test.js
```

在瀏覽器 console 執行 `crossOriginIsolated` — 回傳 `true` 就對了。

---

## 6. 部署

```bash
npm i -g vercel
vercel          # 預覽
vercel --prod   # 正式
```

或直接把 repo 推 GitHub,在 vercel.com 連上,之後每次 push 自動部署。

拿到網址後,QR code 用 qr-code-generator.com 之類的產一張就行。

---

## 7. 使用者那邊的流程

1. 掃 QR code
2. **Safari** 開啟(其他瀏覽器也可以,但 Safari 最穩)
3. 分享鍵 → 「加入主畫面」
4. 桌面出現 Archive 圖示,點開全螢幕

第 3 步沒辦法自動化,建議在網頁上放一行提示引導。

---

## 最後,再講一次資料的事

iOS Safari 有 **7 天未使用清除網站資料** 的政策。加入主畫面的 PWA 通常不受影響,
但 Apple 沒有正式保證,而且使用者清 Safari 快取時可能一併清掉。

你這是創作記錄工具 — 資料沒了會很痛。**強烈建議在上線前先做匯出功能**:

```ts
// 大致長這樣
const rows = await db.getAllAsync('SELECT * FROM works');
const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `curators-archive-${Date.now()}.json`;
a.click();
```

有了匯出,PWA 就從「不能長期用」變成「可以長期用,只是要偶爾備份」。
