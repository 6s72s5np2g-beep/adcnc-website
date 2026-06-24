# 實績案例頁 x4 上線 + 照片美化流程 — 2026-06-25

## 主軸
延續流量改善（見 [[2026-06-24-analytics]]），新增 4 個實績案例詳細頁（中英日三語共 12 頁），用傑哥提供的真實加工件照片，2026-06-25 用 wrangler 部署上線 adcnc.com.tw（三頁 curl 200 確認）。

## 新增 4 頁（slug + 重點）
- `/works/brass-charging-tray` 黃銅精密載盤（全孔位±0.02mm、光澤鍍、充電器相關）
- `/works/brass-thin-plate` 黃銅超薄板（1.6mm、平面度0.02mm、**自製真空吸盤治具=主打亮點**）
- `/works/machine-tool-seal-gland` 碳鋼1018油封座（內外徑切槽 Ra32µin、同軸0.001"）
- `/works/titanium-gear-case` 純鈦Gr.2齒輪箱殼（雙向螺紋 1"-14 + M28×1.0、噴砂、難加工材）
每頁三語：`works/<slug>.astro` + `en/works/` + `ja/works/`；列表 `works.astro`×3語加卡片（排最前）。

## ⚠️ NDA 匿名化原則（重要，務必沿用）
客戶真名一律**不上官網、不寫進 memory**（memory 會 push 到 GitHub）。只記匿名講法：
- 終端客戶用「美商工具機大廠」「國際氣動工具品牌」「電子產業客戶」帶過
- 不寫圖號、機型、零件上的品牌雷雕字樣
- 有客戶 logo / 圖面的照片**不上站**（要先去 logo / 裁背景才行）
- 傑哥同意用「供應國際大廠」不點名暗示實力 → 已加在 works 列表 section-sub + C/D 應用欄

## 照片美化流程（可重用）
這台**沒有 ImageMagick**（`convert` 是 Windows 磁碟工具，別碰）；但 Astro 專案內建 **sharp**（node 依賴）可用。
從 Downloads 原圖 → 美化 → 輸出 `public/images/works/`：
```
node -e 'sharp(input).rotate().resize({width:1500,withoutEnlargement:true})
  .modulate({brightness:1.05~1.06,saturation:1.05~1.12}).sharpen()
  .jpeg({quality:82,mozjpeg:true}).toFile(out)'
```
效果：2MB → 100~300KB（小 10 倍+），提亮+飽和+銳化。⚠️ node 要 **Windows 路徑**（`C:/Users/joine/Downloads/...`）不是 Git Bash 的 `/c/`。黃銅件 saturation 用 1.12（金色更亮），鋼/鈦用 1.05（中性）。

## 部署（沿用記憶）
`npm run build && npx wrangler pages deploy dist --project-name=adcnc-website --branch=main --commit-dirty=true`，不走 Cloudflare UI。

## 待辦（下一步）
1. **GSC 手動催索引**：傑哥 2026-06-25 要去 GSC 網址審查逐一「要求建立索引」（含新 4 頁），一天配額約 10 個。原因：18 頁多為「已找到-尚未索引」排隊中。
2. ✅ **Formspree 詢價表單已接好上線**（2026-06-25）。form「銨東官網詢價」→ joineve0913@gmail.com，endpoint `https://formspree.io/f/mjgqgaza`（非機密，公開在頁面 HTML）。三語 contact.astro 的 `FORMSPREE_ENDPOINT` 都已替換、部署。⚠️ Formspree 免費版需「首次提交後點確認信」才正式啟用——傑哥要去 adcnc.com.tw/contact 測送一次、到 Gmail 點確認連結。免費版每月 50 封。帳號用 Google 登入（密碼存 Google 密碼管理工具，未寫入任何檔案）。
3. 案例頁模板 = 複製 `works/<slug>.astro` + en/ja 版，`works.astro`×3語加卡片帶 `photo/photoAlt/href`。
4. samtec 那張照片有 logo + 背景圖面，未上站；要用得先去 logo。
