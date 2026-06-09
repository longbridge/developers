---
sidebar_position: -999
title: 平台介紹
id: getting_started_introduce
sidebar_icon: book_open
---

Longbridge Developers 為有研發能力的投資者提供程序化接口，助力投資者根據自身投資策略搭建交易或行情策略分析工具。平台覆蓋以下類別：

- **行情**（Quote）— 實時與歷史行情、盤口、K 線、期權/輪證數據、訂閱推送
- **基本面**（Fundamental）— 公司概況、財務數據、估值、分析師評級、市場數據、日曆
- **資訊與社區**（News & Contents）— 市場資訊、社區話題、自選股管理
- **交易**（Trade）— 創建/修改/撤銷訂單，查詢訂單、成交、資產等
- **帳戶**（Account）— 盈虧分析、股價提醒、定投計劃、自選股
- **CLI** — 命令行工具，覆蓋以上所有功能，並額外支持量化回測與研究
- **MCP** — Model Context Protocol，用於 AI 助手工作流集成

## 接口類型

Longbridge 提供接入底層服務的 HTTP / WebSockets 接口以及封裝在上層的 SDK（Python / C++ ...）等多種接入方式，靈活選擇。

## 如何開通

1. 登錄 [Longbridge App](https://longbridge.com/download) 完成開戶；
2. 登錄 [longbridge.com](https://longbridge.com) 進入開發者平台，完成開發者認證即 OpenAPI 權限申請，獲取令牌。

## 行情覆蓋

<table>
     <thead>
       <tr>
           <th width="160">市場</th>
           <th>標的</th>
       </tr>
     </thead>
     <tbody>
     <tr>
         <td width="160" rowspan="2">港股</td>
         <td>證券類產品（含股票、ETFs、窩輪、牛熊、界內證）</td>
     </tr>
     <tr>
         <td>恆生指數</td>
     </tr>
     <tr>
         <td rowspan="3">美股</td>
         <td>證券類產品（含紐交所、美交所、納斯達克上市的股票、ETFs）</td>
     </tr>
     <tr>
         <td>納斯達克指數</td>
     </tr>
     <tr>
         <td>OPRA 選擇權</td>
     </tr>
     <tr>
         <td rowspan="2">A 股</td>
         <td>證券類產品（含股票、ETFs）</td>
     </tr>
     <tr>
         <td>指數</td>
     </tr>
     </tbody>
</table>

## 交易標的類別

目前 OpenAPI 支援交易一下標的類別：

| 市價     | 股票 ETF | 權證 | 選擇權 |
| -------- | -------- | ---- | ------ |
| 香港市場 | ✓        | ✓    |        |
| 美國市場 | ✓        | ✓    | ✓      |

## 頻率限制 {#rate-limit}

| 類別         | 限制規則                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| 行情相關 API | <ul><li>一個帳號同時只能建立一個長連接，最多同時訂閱 500 個標的</li><li>1 秒內不超過 10 次調用，並發請求數不超過 5</li></ul> |
| 交易相關 API | <ul><li>30 秒內累計不超過 30 次調用，每兩次調用之間間隔不小於 0.02 秒</li></ul>                                              |

:::success

我們 [OpenAPI SDK](https://open.longbridge.com/sdk) 內部已經做了有效的頻率控制：

- 行情類：`QuoteContext`下的接口，SDK 內部會按照服務端的頻率限制來主動控制，當請求過快的時候，SDK 會自動延遲請求。因此你可以不需要額外實現頻率控制細節。
- 交易類別：`TradeContext` 下的接口，SDK 沒有做限制，由於交易下單場景特殊性，將這個交由用戶自行處理。

:::

## 使用費用 {#pricing}

Longbridge 不針對接口服務額外收取開通或使用費用，只需[開通 Longbridge 綜合帳戶](https://longbridge.com/hk/download)及 OpenAPI 服務權限即可免費使用。行情數據訂閱費用詳見[定價頁面](/zh-HK/pricing)。實際交易費率請洽詢您開通證券帳戶的券商。

## 其他

OpenAPI 服務由 Longbridge 及其適用的關聯公司提供（具體以協議為準）。
