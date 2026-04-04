# Mission Control Environment Setup

## Vercel 遠端重啟設定

### 1. 取得 Vercel Token

1. 到 https://vercel.com/account/tokens
2. 點 "Create Token"
3. 複製 Token（只會顯示一次！）

### 2. 設定環境變數

在 Vercel Dashboard → Project Settings → Environment Variables 新增：

```
NEXT_PUBLIC_VERCEL_TOKEN=你的_token_這裡
NEXT_PUBLIC_VERCEL_PROJECT_ID=你的_project_id
```

### 3. 取得 Project ID

在 Vercel Dashboard → Project Settings → General → Project ID

### 4. Discord Bot 設定（可選）

如果要從 Discord 重啟，需要設定：

```
DISCORD_TOKEN=你的_bot_token
DISCORD_GUILD_ID=你的_server_id
DISCORD_CLIENT_ID=你的_bot_client_id
```

---

## 環境偵測

系統會自動偵測：
- 🖥️ **Local** (`localhost:3000`) → 直接重啟本地 server
- 🌐 **Vercel** (`*.vercel.app`) → 觸發重新部署

---

## API Endpoints

### Health Check
```bash
GET /api/health
```

### Restart (Local only)
```bash
POST /api/restart
Content-Type: application/json

{
  "token": "mission-control-restart-2024"
}
```

---

## Discord 指令

- `/mc-status` - 檢查 server 狀態
- `/mc-restart` - 重啟 server（需要 token）

**注意：** Discord Bot 必須在本地機器上運行才能控制本地 server！
