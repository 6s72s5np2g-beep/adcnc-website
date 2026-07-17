# 官網 2.0 Phase A 上線 + 8 篇技術筆記備妥 — 2026-07-06

傑哥綠燈（7/6 Discord）：「官網2.0你先完成，8篇先寫存起來，文風擬人、不要emoji」。當天完成部署。

## 上線內容（47 頁，+8 新頁，全 curl 200）
- **能力專頁 ×5**（一頁鎖一個搜尋字，皆 zh）：
  `/titanium-machining` 鈦金屬加工｜`/brass-machining` 黃銅銅合金｜`/stainless-machining` 不鏽鋼｜`/turn-mill-machining` 車銑複合｜`/prototype-machining` 小量試作
- **技術筆記**：`/notes` 列表 + 前 2 篇上線（`/notes/thin-stainless-distortion` 薄件變形、`/notes/titanium-lessons` 鈦三堂課）
- 首頁新增「我們特別擅長的」區塊（6 卡連到專頁+筆記）；zh nav 加「技術筆記」
- 內鏈三角：專頁 ↔ 案例頁 ↔ 筆記 相互連結
- 發現：**v1 的 Layout 本來就有完整 JSON-LD LocalBusiness + hreflang + canonical + OG**（PLAN-V2 的 P1 技術 SEO 大半已存在），只補了 nav。

## 📝 8 篇筆記草稿（存 `銨東官網\notes-drafts\01~08-*.md`）
01 薄件變形(已上線) / 02 鈦三堂課(已上線) / 03 報價成本拆解 / 04 試作圖面五件事 / 05 細長軸讓刀振刀 / 06 車銑複合省什麼 / 07 熱處理表處留量 / 08 公差怎麼標省錢
- **文風鐵律（傑哥定）**：擬人、不要 emoji、不要 AI 腔（禁：首先/其次/總而言之/條列轟炸）。老師傅口吻、實際數字、去識別化（NDA 規則沿用：客戶名/圖號不出現）。
- **⚠️ 編輯守則 v2（7/6 傑哥追加，最重要）**：**不透露核心技術**。「名詞 OK、詳細作法要收」——可以講「真空治具/全包夾持/補償」這種名詞當實力證明，**不可以寫參數（Vc/ap/留量數字）、作法步驟、治具設計邏輯**（那是教會同行）。**筆記主角是「發包的人」不是同行工程師**：寫「為什麼難＋我們交付過什麼（結果數字OK）＋發包方該準備什麼＋怎麼挑廠」，把讀者帶去詢價。前2篇已照此改版重新上線（標題也換成發包視角：「薄件加工為什麼一堆工廠不敢接」「鈦件發包前先搞懂這三件事」）；draft 05 已重寫；**03-08 上線前都要用這守則再檢一遍**。01/02 的 v1 原稿（含作法）留在 notes-drafts 標「僅內部參考勿發布」。
- **每週上線流程**：從 notes-drafts 取下一篇 → 做成 `src/pages/notes/<slug>.astro`（模板照前兩篇）→ `notes.astro` 的 notes 陣列加一筆（新的放最上）→ 有互鏈的專頁把「近期刊出」改成實連結 → build+deploy。下一篇：03（報價成本，slug cnc-quote-cost）。
- 03-08 內文完整在 md 草稿裡，上線時轉 astro 即可，不用重寫。

## 部署
`npm run build && npx wrangler pages deploy dist --project-name=adcnc-website --branch=main --commit-dirty=true`（照舊）

## 未動（後續）
- en/ja 收斂（PLAN-V2 3.5）未動——現狀維持
- traffic-report 月報化（3.6）未做
- **7/9 量測照舊**（基準線見 2026-07-09-followup-checklist）；量測時注意：7/6 上了 8 頁新內容，GSC 索引數會混入新頁，對比時分開看
- 傑哥的債不變：GSC 催索引（新 8 頁也要催）、Google 商家、名錄登錄
