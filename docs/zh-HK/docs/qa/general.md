---
title: 通用問題
sidebar_position: 0
---

## Q1: 一定要開通真實帳號才能呼叫 Longbridge Developers 嗎？

不需要。平台提供**模擬帳戶**，無需開通真實證券帳戶即可完成行情與交易介面的開發偵錯。**模擬帳戶**支援港股、美股、A 股即時行情查詢，以及港美股股票、ETF 等基礎交易功能，適合介面聯調與功能驗證。

不過，模擬帳戶在交易撮合、資金規則等方面與真實環境存在差異，如需完整體驗平台能力，建議同時開通真實帳戶。

## Q2: 如何開通模擬帳戶調試？

請造訪 [開發者中心](https://open.longbridge.com/account/) 開啟**模擬帳號**並取得模擬帳號對應的 App Key & Secret 以及 Access Token 等資訊。

## Q3: 模擬偵錯的行情交易權限與真實帳戶相同嗎？

行情相同，交易不同。

模擬帳號和真實帳號共用 App Key & Secret，不同 Access Token。其中，行情權限與 App Key & Secret 關聯，交易權限與 Access Token 關聯，因此模擬帳戶和真實帳戶下，行情權限相同，交易權限與證券帳號關聯，可能會不同。

## Q4: 模擬調試支援哪些市場和品種的行情和交易

行情：支援港股、美股、A 股通市場即時行情，其中，美股全美行情、港股 Level2 等高級行情也可透過線上行情商店購買對應行情權益後，透過 OpenAPI 取得行情資料。

交易：支持港美股股票、ETF、港股輪證交易，其中美股支持股票做空。美股 OTC、盤前盤後交易、選擇權交易在模擬帳號下暫未支援。

## Q5: 介面呼叫頻次及數量限制

請造訪 [頻率限制](/docs/#rate-limit) 查看具體描述。

## Q6: 多個帳戶情況下，介面呼叫頻次如何限制

若客戶持有多個證券帳戶，例如日內融或其他子帳戶，交易介面呼叫頻次及數量限制依不同的證券帳戶統計及控制，行情介面則不受多帳戶影響，統一限制。

## Q7: 透過 Longbridge Developers 進行交易操作有額外收費嗎

透過 OpenAPI 存取進行行情查詢、交易等，我們不會收取額外的費用。交易手續費、平台費、行情權限等帳戶相關的費用，請以 App 以及官網提供的資訊為準。

## Q8: 如何關閉 SDK 連接到伺服器後的控制台下的權限表輸出

您可以設置環境變數 `LONGBRIDGE_PRINT_QUOTE_PACKAGES` 為 `false`（或舊版 `LONGPORT_PRINT_QUOTE_PACKAGES`），或在代碼中創建 `Config` 對象時設置 `enable_print_quote_packages` 為 `false`，來關閉控制台下的權限表輸出。

## Q9: 我不會寫程式，如何才能存取 Longbridge Developers 平台的個股數據？

平台提供兩種無需寫程式即可存取個股數據的方式：

**CLI（命令列工具）**

安裝 [Longbridge CLI](/docs/cli)，透過簡單指令即可查詢行情數據，無需撰寫任何程式碼：

```bash
longbridge quote AAPL.US TSLA.US
longbridge static NVDA.US
```

**MCP（AI 工具整合）**

如果你日常使用 Claude、Cursor、ChatGPT 等 AI 工具，可以接入 [Longbridge MCP 服務](/zh-HK/docs/mcp)，設定完成後直接用自然語言向 AI 提問，由 AI 代你呼叫行情介面取得數據。

兩種方式均需擁有 Longbridge 帳戶。
