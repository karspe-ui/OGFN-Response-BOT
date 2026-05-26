# OG Fortnite Auto-Response Bot 

A Discord bot that automatically responds to common questions in OG Fortnite servers using configurable rules.

## Features
- Auto-replies to common support/safety/reporting/donation keywords
- Ignore messages from specified role IDs
- Optional auto-delete for the bot’s replies
- Brand name/links can be configured via `settings.json`

## Setup

### 1) Install Node.js
Download from: https://nodejs.org/en/download

### 2) Install dependencies
```bash
npm install
```

### 3) Configure Discord + bot token
1. Create/open your bot in the Discord Developer Portal
2. Copy your bot token
3. Enable these Gateway intents:
   - `Guilds`
   - `GuildMessages`
   - `MessageContent`
   - `GuildMembers`

### 4) Edit `settings.json`
Update:
- `discordToken`
- `ignoredRoleIds` (array of role IDs to ignore)
- `channels.*` URLs
- `autoDelete.enabled` and `autoDelete.afterSeconds` (optional)

### 5) Run the bot
```bat
Start.bat
```

## Build (TypeScript)
```bash
npm run build
```

## Config keys (high-level)
- `version`
- `supportedPlatforms` (ios/android toggles; used by response logic)
- `discordToken`
- `ignoredRoleIds`
- `autoDelete`
- `channels`
- `embeds`

