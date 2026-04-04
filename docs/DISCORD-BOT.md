# Discord Bot Setup for Mission Control

## Setup Instructions

1. **Install dependencies:**
```bash
npm install discord.js
```

2. **Create `.env.local`:**
```bash
DISCORD_TOKEN=your_bot_token_here
RESTART_TOKEN=mission-control-restart-2024
```

3. **Run the bot:**
```bash
npx ts-node scripts/discord-bot.ts
```

## Commands

- `/mc-status` - Check if Mission Control is running
- `/mc-restart` - Restart the Mission Control server

## Register Commands

Run this once to register slash commands:
```bash
npx ts-node scripts/register-commands.ts
```
