# 流量分析工具建立 + 流量現況判讀 — 2026-06-24

## 主軸

傑哥問「官網流量如何」。先確認官網**沒裝任何前端分析碼**（無 GA、無 Cloudflare Web Analytics beacon、無 GSC 驗證）。流量只能看 Cloudflare 伺服器端被動數據。決定走自動化：開 Cloudflare 唯讀 API token + 寫腳本直接抓 GraphQL Analytics。

## 工具：traffic-report.mjs

- 檔案：`D:\水母資料夾\銨東官網\traffic-report.mjs`（Node，內建 fetch）
- 跑法：`cd D:\水母資料夾\銨東官網 && node traffic-report.mjs 7`（參數=天數，預設7，可給30）
- 輸出：每日(總請求/台灣/頁面瀏覽/不重IP/頻寬) + 7天彙總 + 來源國家排行 + 判讀
- 抓「截至昨天的過去 N 天」（今天數據未完整故不取）

## 認證檔：.cf-analytics.env（已 gitignore，不外洩）

- `D:\水母資料夾\銨東官網\.cf-analytics.env`，本機限定，`git check-ignore` 已驗證被忽略
- CF_API_TOKEN：`cfut_` 開頭，名稱 adcnc-analytics，權限只有 Account/Zone Analytics:Read（唯讀，動不了網站）
- CF_ZONE_ID：`51e6b86a936c91913778b412ba62a556`（adcnc.com.tw）
- CF_ACCOUNT_ID：`a1c478a6d1068837ad49dcb3cfd70014`
- GraphQL endpoint：`https://api.cloudflare.com/client/v4/graphql`，查 `httpRequests1dGroups`

## 開 token 流程備忘（之後要再開類似的）

Cloudflare → 我的個人資料 → API 令牌 → 創建令牌 → **自訂令牌** → 權限加兩列：帳戶|帳戶分析|讀取 + 區域|分析|讀取 → 帳戶資源選帳戶 → 區域資源選 adcnc.com.tw。token 只顯示一次。
注意：既有的「Cloudflare Tunnel API 令牌」「網站建構令牌」權限不對，不能拿來讀 analytics。

## 流量判讀（6/17~6/23，關鍵結論）

- 7天總請求 743，**台灣僅 60（8.1%）**，但台灣吃掉 17.44MB／總頻寬 24MB 的 **72%**。
- **頻寬落差 = 真人 vs 爬蟲的鐵證**：US 303請求只3.19MB、JP 59請求只0.05MB、NL 94只0.33MB → 純爬蟲(抓文字不載圖)；台灣60請求卻17.44MB → 真人在看含照片頁面。
- 6/18、6/19 台灣掛 0（那兩天沒半個台灣人，全爬蟲灌數字）。
- **真人估算：一週約 5~15 個台灣訪客，平均每天 1~2 人**（免費版無精確bot標記，用頻寬集中反推）。
- 對上線一個半月、SEO收錄期的工廠站屬正常偏低，非故障。
- ⚠️ 儀表板「帳戶分析」顯示數(2.09千)比腳本(743)大很多：時間窗不同(腳本截到昨天) + Cloudflare兩套數據集算法不同。方向一致、不影響判讀。別把兩個數字硬湊。
- ⚠️ Cloudflare 的「訪問/不重IP/頁面瀏覽」全混了爬蟲，**別當真人數對外講**。最該看的是「台灣請求數」。

## 待辦（拉流量，按優先）

1. **Google Search Console 早已接好**（網域層級 `sc-domain:adcnc.com.tw`，用 DNS 驗證、非網站 meta，所以網站 HTML 裡找不到 verification tag 是正常的）。2026-06-24 截圖現況：過去約兩週**搜尋點擊僅 3 次**；索引狀態 **6 頁已索引 / 18 頁未索引**。下一步：(a) 查 18 頁未索引原因（多語 en/ja 很可能被當 zh-TW 替代頁，屬正常；或「已檢索-尚未索引」）(b) 成效頁看進來的關鍵字 + 曝光數。GSC 比 Cloudflare 更準反映「真人從 Google 搜尋點進來」。
2. 多做案例詳細頁（現12卡只2個有詳細頁，模板已存在，見 2026-06-11-traffic.md）。
3. **Google 商家檔案：早已完整建立並驗證**（2026-06-24 傑哥截圖證實，非待辦）。名稱「銨東股份有限公司(cnc加工)」、傑哥本人管理(已驗證綠勾)、5.0 星 2 則評論、288 次客戶互動、地址 411026 台中市太平區成功路29巷22號、電話 0918257952、已掛官網連結。⚠️ 我曾用 WebSearch(偏美國管道)查不到而一度誤判「沒有」，實際存在且經營良好——**以後查台灣本地商家/地圖別只信 WebSearch**。後續只需優化(上傳更多加工件照、定期發貼文)，不需新建。
4. 其他主動導流：名片/報價單印網址、LINE 推。
5. (選)裝 Cloudflare Web Analytics 或 GA4 才有「真人訪客/熱門頁/跳出率」前端數據。

## 還沒做（沿用上線時欠的）

- Formspree 詢價表單仍是 `YOUR_FORM_ID` placeholder，三版(中/en/ja) contact 都送不出去。傑哥一度以為做完，實際程式碼未替換。要先去 formspree.io 申請拿 form ID 再貼。
