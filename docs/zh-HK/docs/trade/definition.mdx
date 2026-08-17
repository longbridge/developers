---
id: trade_definition
title: 交易命名詞典
slug: trade-definition
sidebar_position: 2
---

## OrderType

- 說明：港股支持訂單類型

| 枚舉值  | 描述                        |
| ------- | --------------------------- |
| LO      | 限價單                      |
| ELO     | 增強限價單                  |
| MO      | 市價單                      |
| AO      | 競價市價單                  |
| ALO     | 競價限價單                  |
| ODD     | 碎股單掛單                  |
| LIT     | 觸價限價單                  |
| MIT     | 觸價市價單                  |
| TSLPAMT | 跟蹤止損限價單 (跟蹤金额)   |
| TSLPPCT | 跟蹤止損限價單 (跟蹤漲跌幅) |
| SLO     | 特殊限價單，不支持改單      |

- 說明：美股支持訂單類型

| 枚舉值  | 描述                        |
| ------- | --------------------------- |
| LO      | 限價單                      |
| MO      | 市價單                      |
| LIT     | 觸價限價單                  |
| MIT     | 觸價市價單                  |
| TSLPAMT | 跟蹤止損限價單 (跟蹤金额)   |
| TSLPPCT | 跟蹤止損限價單 (跟蹤漲跌幅) |

## OrderStatus

- 說明：訂單狀態

| 枚舉值               | 描述              |
| -------------------- | ----------------- |
| NotReported          | 待提交            |
| ReplacedNotReported  | 待提交 (改單成功) |
| ProtectedNotReported | 待提交 (保價訂單) |
| VarietiesNotReported | 待提交 (條件單)   |
| FilledStatus         | 已成交            |
| WaitToNew            | 已提待報          |
| NewStatus            | 已委托            |
| WaitToReplace        | 修改待報          |
| PendingReplaceStatus | 待修改            |
| ReplacedStatus       | 已修改            |
| PartialFilledStatus  | 部分成交          |
| WaitToCancel         | 撤銷待報          |
| PendingCancelStatus  | 待撤回            |
| RejectedStatus       | 已拒絕            |
| CanceledStatus       | 已撤單            |
| ExpiredStatus        | 已過期            |
| PartialWithdrawal    | 部分撤單          |

## Market

- 說明：市場

| 枚舉值 | 描述 |
| ------ | ---- |
| HK     | 港股 |
| US     | 美股 |

## WebSocket 推送通知

- WebSocket 推送通知字段說明

| 字段名             | 類型   | 注釋                                                                                                                                 |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| side               | string | 買賣方向<br/><br/>**可選值**<br/>`Buy` - 買入<br />`Sell` - 賣出                                                                     |
| stock_name         | string | 公司名稱                                                                                                                             |
| submitted_quantity | string | 委托數量                                                                                                                             |
| symbol             | string | 訂單標的                                                                                                                             |
| order_type         | string | [訂單類型](./trade-definition#ordertype)                                                                                             |
| submitted_price    | string | 委托價格                                                                                                                             |
| executed_quantity  | string | 成交數量                                                                                                                             |
| executed_price     | string | 成交價格                                                                                                                             |
| order_id           | string | 訂單 id                                                                                                                              |
| currency           | string | 結算貨幣                                                                                                                             |
| status             | string | [訂單狀態](./trade-definition#orderstatus)                                                                                           |
| submitted_at       | string | 下單時间，格式為時间戳 (秒)                                                                                                          |
| updated_at         | string | 最近更新時间                                                                                                                         |
| trigger_price      | string | 觸發價格                                                                                                                             |
| msg                | string | 拒絕理由，備注信息                                                                                                                   |
| tag                | string | 訂單標記<br/><br/>**可選值**<br/>`Normal` - 普通訂單<br />`GTC` - 长期單<br />`Grey` - 暗盤單                                        |
| trigger_status     | string | 條件單觸發狀態<br/><br/>**可選值**<br/>`NOT_USED` - 未激活 <br />`DEACTIVE` - 已失效<br />`ACTIVE` - 已激活<br />`RELEASED` - 已觸發 |
| trigger_at         | string | 觸發時间                                                                                                                             |
| trailing_amount     | string | 條件單跟蹤金额                                                                                                                       |
| trailing_percent    | string | 條件單跟蹤漲跌幅                                                                                                                     |
| limit_offset       | string | 指定價差                                                                                                                             |
| account_no         | string | 用戶端賬號                                                                                                                           |
| remark         | string | 備注																																													 |
| last_share         | string | 最新成交數量																																													 |
| last_price         | string | 最新成交價格																																													 |
	
### 示例

```JSON
{
	"event": "order_changed_lb",
	"data": {
		"side": "Buy",
		"stock_name": "騰訊控股",
		"submitted_quantity": "1000",
		"symbol": "700.HK",
		"order_type": "LO",
		"submitted_price": "213.2",
		"executed_quantity": "1000",
		"executed_price": "213.2",
		"order_id": "27",
		"currency": "HKD",
		"status": "NewStatus",
		"submitted_at": "1562761893",
		"updated_at": "1562761893",
		"trigger_price": "213.0",
		"msg": "Insufficient Qty - 1000",
		"tag": "GTC",
		"trigger_status": "ACTIVE",
		"trigger_at": "1562761893",
		"trailing_amount": "5",
		"trailing_percent": "1",
		"limit_offset": "0.01",
		"account_no": "HK123445",
		"last_share": "100",
		"last_price": "234",
		"remark": "abc"
	}
}
```
