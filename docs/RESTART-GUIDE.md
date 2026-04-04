# Mission Control Discord Bot Commands

## `/restart-mc` - 重啟 Mission Control

**用法:** `/restart-mc [token]`

**說明:** 當 Mission Control server 掛掉時，用這個指令遠端重啟

**Token:** `mission-control-restart-2024`

---

## `/mc-status` - 檢查狀態

**用法:** `/mc-status`

**說明:** 檢查 Mission Control server 是否正常運行

---

## API Endpoints

### Health Check
```bash
GET http://localhost:3000/api/health
```

### Restart Server
```bash
POST http://localhost:3000/api/restart
Content-Type: application/json

{
  "token": "mission-control-restart-2024"
}
```

---

## 自動監測

Server 會每 30 秒自動檢查健康狀態，並在 Sidebar 顯示：
- 🟢 Online - 正常運行
- 🔴 Offline - 無回應
- 🟡 Checking - 檢查中

---

## 手動重啟流程

1. **從網頁重啟:** Sidebar → Server Control → Restart Server (點兩下確認)
2. **從 Discord 重啟:** `/restart-mc mission-control-restart-2024`
3. **自動重啟:** 如果偵測到 crash，會自動嘗試重啟
