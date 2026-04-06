# Daily Mission Check Cron

這個 Cron job 會在每天早上 10 點自動檢查 Mission Control 的任務，並發送 Discord 通知。

## 設定步驟

### 1. 設定 Discord Webhook

1. 在 Discord 開啟你的私人頻道
2. 點擊頻道設定 (⚙️) → 整合 → Webhook
3. 點擊「新增 Webhook」
4. 複製 Webhook URL
5. 在 Vercel Dashboard 新增環境變數：
   - 名稱：`DISCORD_WEBHOOK_URL`
   - 值：`https://discord.com/api/webhooks/.../...`

### 2. Vercel Cron 設定

`vercel.json` 已經設定好每天早上 10 點自動執行：

```json
{
  "crons": [
    {
      "path": "/api/cron/mission-check",
      "schedule": "0 10 * * *"
    }
  ]
}
```

### 3. 手動測試

你可以隨時手動觸發檢查：

```bash
# 本地測試
curl http://localhost:3000/api/cron/mission-check

# 或訪問這個 URL 手動觸發
curl https://mission-control-woad.vercel.app/api/cron/trigger
```

## 通知內容

每天的 Discord 通知會包含：
- 📊 總覽：總任務數、待處理數、今日到期數、逾期數
- ⚠️ 逾期任務（如果有的話）
- 📅 今日到期的任務
- 📝 待處理任務列表（前5個）

## 注意事項

- 如果沒有設定 `DISCORD_WEBHOOK_URL`，Cron 仍會執行但不會發送通知
- 只有 `pending` 和 `in-progress` 狀態的任務會被計入「待處理」
- 逾期的任務會用紅色區塊標示
