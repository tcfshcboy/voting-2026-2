# 2026 TCFSH 校園風雲人物票選

這是一個建構於 React + TypeScript + Vite 的校園投票系統前端網頁，並搭配 Google Apps Script (GAS) 與 Google Sheet 作為無伺服器 (Serverless) 後端。

## 環境變數設定

在執行或部署前，請先在專案根目錄建立 `.env` 檔案（可從 `.env.example` 複製出來改名為 `.env`），並填入以下內容：

```env
VITE_GOOGLE_CLIENT_ID="你的 Google Cloud Client ID"
VITE_GAS_URL="你的 Google Apps Script Web App 部署網址"
```

## 本地端開發

1. 安裝依賴套件：
   ```bash
   npm install
   ```
2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

## 關於 gas-script.js

**Q: `gas-script.js` 是否不用放到 GitHub 上？**
A: **正確！它不需要跟網頁一起被打包或部署。** 

`gas-script.js` 裡的程式碼是 Google Apps Script 的後端程式碼。您可以將它保留在 GitHub 的 repository 內當作**備份或團隊的原始碼控管**，但它在打包（`npm run build`）網頁與設定 GitHub Pages 部署時，都不會被執行。
*實際使用時，您只需把 `gas-script.js` 的內容「複製貼上」到 Google 試算表裡的 Apps Script 編輯器，然後發布部署即可。*

## 使用 GitHub Actions 部署至 GitHub Pages

我們已經為您建立好了 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 檔案，您可以照著以下步驟，在 Github 上直接發佈您的投票網頁：

### 部署教學：

1. **上傳至 GitHub:**
   將目前專案所有的程式碼（除了 `node_modules` 等被列於 gitignore 中的檔案）commit 並 push 到您的 GitHub repository，並確保您的主分支名稱為 `main`。

2. **設定 Secrets (環境變數):**
   因為 GitHub Pages 架設是公開的，為了不把 ID 直接寫死在程式碼中，請在 GitHub 的變數中心提供它：
   - 到您的 Repository -> 上方選單的 **Settings** -> 左側選單的 **Secrets and variables** -> **Actions**。
   - 點擊綠色按鈕 **New repository secret**。
   - 新增一個名為 `VITE_GOOGLE_CLIENT_ID` 的 Secret (內容填入您的 Google Client ID)
   - 新增一個名為 `VITE_GAS_URL` 的 Secret (內容填入您部署好的 GAS Web App URL)

3. **啟用 GitHub Pages 設定:**
   - 到 Repository -> **Settings** -> 左側選單的 **Pages**。
   - 在 **Build and deployment** 區塊的 **Source** 下拉選單中，請選擇 **GitHub Actions**。

4. **檢查並等待部署:**
   - 到 Repository 上方選單的 **Actions** 頁籤。
   - 如果您剛剛有 push 程式碼，應該會看到名為 "Deploy to GitHub Pages" 的工作正在進行。
   - 部署完成出現綠色勾勾後，即可在您的 `https://<您的帳號>.github.io/<專案名稱>/` 網址上看到投票頁面！

> **解決資源路徑問題 (已經預先設定)：**
> Vite 預設打包含為根目錄（`/`），但 Github Pages 大部分是附屬在專案名稱後（例如 `/tcfsh-vote/`）。為了避免發布後白畫面、找不到 CSS/JS 的狀況，我們已在 `vite.config.ts` 中補上了一行 `base: './'` 來相容這件事，所以您照著上述做即可順利發布！
