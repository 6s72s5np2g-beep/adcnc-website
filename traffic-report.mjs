#!/usr/bin/env node
// 銨東官網流量報表 — 從 Cloudflare GraphQL Analytics 抓真實流量
// 用法：node traffic-report.mjs [天數]    例：node traffic-report.mjs 7
// token / zone 從 .cf-analytics.env 讀（該檔已 gitignore，不外洩）

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// --- 讀 .cf-analytics.env ---
const env = {};
for (const line of readFileSync(join(here, '.cf-analytics.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
  if (m) env[m[1]] = m[2];
}
const TOKEN = env.CF_API_TOKEN, ZONE = env.CF_ZONE_ID;
if (!TOKEN || !ZONE) { console.error('缺 CF_API_TOKEN / CF_ZONE_ID'); process.exit(1); }

// --- 日期範圍：截至昨天的過去 N 天（昨天數據才完整） ---
const days = parseInt(process.argv[2] || '7', 10);
const iso = d => d.toISOString().slice(0, 10);
const end = new Date(); end.setUTCDate(end.getUTCDate() - 1);
const start = new Date(end); start.setUTCDate(start.getUTCDate() - (days - 1));

// --- 打 GraphQL ---
const query = `{viewer{zones(filter:{zoneTag:"${ZONE}"}){
  httpRequests1dGroups(limit:${days},orderBy:[date_ASC],
    filter:{date_geq:"${iso(start)}",date_leq:"${iso(end)}"}){
    dimensions{date}
    sum{requests bytes pageViews countryMap{clientCountryName requests bytes}}
    uniq{uniques}
  }}}}`;

const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
});
const json = await res.json();
if (json.errors) { console.error('API 錯誤：', JSON.stringify(json.errors)); process.exit(1); }
const rows = json.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];
if (!rows.length) { console.log('這段期間沒有資料'); process.exit(0); }

// --- 彙總 ---
const mb = b => (b / 1048576).toFixed(2) + 'MB';
const country = {};        // 國家 -> {req, bytes}
let totReq = 0, totPV = 0, totTW = 0, totBytes = 0;

console.log(`\n銨東官網流量報表  ${iso(start)} ~ ${iso(end)}（過去 ${days} 天）`);
console.log('資料：Cloudflare 伺服器端（含搜尋引擎/AI 爬蟲，非純真人）\n');
console.log('日期     總請求  台灣  頁面看  不重IP  頻寬');
console.log('-------  ------  ----  ------  ------  --------');

for (const r of rows) {
  const tw = (r.sum.countryMap.find(c => c.clientCountryName === 'TW')?.requests) || 0;
  totReq += r.sum.requests; totPV += r.sum.pageViews; totTW += tw; totBytes += r.sum.bytes;
  for (const c of r.sum.countryMap) {
    const k = c.clientCountryName;
    country[k] = country[k] || { req: 0, bytes: 0 };
    country[k].req += c.requests; country[k].bytes += c.bytes;
  }
  const d = r.dimensions.date.slice(5);
  console.log(
    `${d}    ${String(r.sum.requests).padStart(5)}  ${String(tw).padStart(4)}  ` +
    `${String(r.sum.pageViews).padStart(5)}   ${String(r.uniq.uniques).padStart(5)}   ${mb(r.sum.bytes).padStart(8)}`
  );
}

console.log(`\n— ${rows.length} 天彙總 —`);
console.log(`總請求 ${totReq}｜頁面瀏覽 ${totPV}｜台灣請求 ${totTW}（${(totTW / totReq * 100).toFixed(1)}%）｜總頻寬 ${mb(totBytes)}`);

// 國家排行（按請求數）
const top = Object.entries(country).sort((a, b) => b[1].req - a[1].req).slice(0, 12);
console.log('\n— 來源國家（請求數｜頻寬）—');
// 雲端機房常見國家 = 爬蟲嫌疑高
const botland = new Set(['US', 'NL', 'FR', 'DE', 'IE', 'SG', 'GB', 'CA', 'RU', 'LT', 'SE', 'AT', 'BE', 'RO', 'FI']);
for (const [k, v] of top) {
  const tag = k === 'TW' ? '✅在地真人' : k === 'JP' || k === 'HK' || k === 'CN' || k === 'KR' ? '亞洲(混)' : botland.has(k) ? '⚠爬蟲嫌疑' : '';
  console.log(`${k}  ${String(v.req).padStart(4)}  ${mb(v.bytes).padStart(9)}  ${tag}`);
}

console.log('\n— 判讀 —');
console.log('• 台灣請求 ≈ 在地真實客戶活躍度（最該看這欄）');
console.log('• US/NL/FR/DE 等雲端機房國家：請求多但頻寬低 = 搜尋引擎/AI 爬蟲，非客人');
console.log('• 頁面瀏覽/不重 IP 都混了爬蟲，別當真人數');
console.log('');
