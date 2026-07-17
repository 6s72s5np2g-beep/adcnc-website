# 雙 CL 協作現況 + 重開機前存檔 — 2026-07-18

傑哥重開機前叫我記憶。重開後新 session 從這裡接。

## 雙 CL 分工（傑哥 7/7 告知有另一個 CL 改官網）
- **對方 CL**：官網 2.0 改版主導（能力專頁、技術筆記、src 程式碼）。已完成 Phase A 上線（見 [[2026-07-06-v2-phase-a-live]]）
- **本 CL（我）**：流量/GSC 量測判讀、traffic-report.mjs、marketing 素材包（已備好）
- **協作規則**：動官網 src 前必先 `git status` + 讀 memory 最新檔；不碰對方未 commit 的檔案；記憶目錄共用=同步機制

## ⚠️ 重開機後最優先：未 commit 風險（傑哥尚未點頭）
`git status` 有一大包未 commit：對方的 v2 Phase A（8 新頁 + Layout.astro/index.astro 改動）+ 我的 marketing/ + 多個記憶檔。**已上線但 git 沒存檔，手滑 reset/checkout 會全滅**。7/7 我問過傑哥要不要 commit+push 存檔，他還沒回（跑去重開機）。**回來第一件事再問一次或直接建議 commit**。
（注意：commit 前重新 git status，對方 CL 可能又有新改動。）

## ⚠️ 第二優先：7/9 量測已逾期（今天 7/18）
原約 7/9 回訪看 GSC+流量（基準線見 [[2026-07-09-followup-checklist]]），**還沒做，已過 9 天**。逾期反而樣本更多。做法照 checklist：跑 `node traffic-report.mjs 30` + 傑哥截 GSC 成效/索引圖。對比時記得 7/6 上了 8 頁新內容，索引數要分開看。

## 傑哥的債（不變，回訪時順便問）
GSC 催索引（新 8 頁也要）、Google 商家發貼文、名錄登錄（素材都在 marketing\行銷素材包.md）。
