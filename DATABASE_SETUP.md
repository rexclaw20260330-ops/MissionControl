# Mission Control - Database Setup Guide

## 🚀 Quick Start

Mission Control 現在已經連接到 Supabase 資料庫！

### Prerequisites

- Supabase project (已經設定好 `.env.local`)
- Node.js 18+

### Step 1: Run Schema SQL

1. 登入你的 Supabase Dashboard: https://supabase.com/dashboard
2. 選擇你的專案: `eocgffkpqorpqiehlquk`
3. 進入 **SQL Editor**
4. 建立 **New Query**
5. 貼上 `supabase/dashboard_schema.sql` 的內容
6. 點擊 **Run**

或從 CLI 執行：
```bash
npx supabase sql < supabase/dashboard_schema.sql
```

### Step 2: Verify Connection

```bash
npm run db:check
```

### Step 3: Seed Database (可選)

如果需要預設資料：
```bash
npm run db:seed
```

### Step 4: Start Development

```bash
npm run dev
```

打開 http://localhost:3000 🚀

---

## 📋 Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `tasks` | 任務管理 |
| `projects` | 專案管理 |
| `activities` | 活動記錄 |
| `dashboard_stats` | 儀表板統計 (單行) |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/data` | 取得所有 dashboard 資料 |
| POST | `/api/data` | 更新 stats |
| GET | `/api/tasks` | 取得所有任務 |
| POST | `/api/tasks` | 建立新任務 |
| PUT | `/api/tasks` | 更新任務 |
| DELETE | `/api/tasks?id={id}` | 刪除任務 |
| GET | `/api/projects` | 取得所有專案 |
| POST | `/api/projects` | 建立新專案 |
| PUT | `/api/projects` | 更新專案 |
| DELETE | `/api/projects?id={id}` | 刪除專案 |

---

## 🔧 Migration (從 db.json)

如果你有舊的 `data/db.json` 資料要遷移：

```bash
npm run db:migrate
```

這會把所有資料從 `db.json` 匯入 Supabase。

---

## 📝 Environment Variables

已經設定好 (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=https://eocgffkpqorpqiehlquk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## 🛠️ Scripts

| Script | Description |
|--------|-------------|
| `npm run db:check` | 檢查資料庫連線 |
| `npm run db:seed` | 插入預設資料 |
| `npm run db:migrate` | 從 db.json 遷移 |

---

## 🎉 Done!

Mission Control 現在完全連接到 Supabase！

- ✅ 即時資料同步
- ✅ 多裝置同步
- ✅ Dashboard 數據即時更新
