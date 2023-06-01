# @akarui/aoi.panel
![npm](https://img.shields.io/npm/dt/@akarui/aoi.panel?color=blue&label=NPM%20Downloads&logo=npm&logoColor=Green)
![GitHub](https://img.shields.io/github/license/AkaruiDevelopment/panel?color=blue&logo=github)
![GitHub package.json version](https://img.shields.io/github/package-json/v/AkaruiDevelopment/panel?color=blue&label=Git%20Version)
![GitHub last commit](https://img.shields.io/github/last-commit/AkaruiDevelopment/panel?color=blue)
![GitHub repo size](https://img.shields.io/github/repo-size/AkaruiDevelopment/panel)
![GitHub forks](https://img.shields.io/github/forks/AkaruiDevelopment/panel?color=blue&style=social)
![GitHub Repo stars](https://img.shields.io/github/stars/AkaruiDevelopment/panel?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/AkaruiDevelopment/panel?style=social)

## Installation

```bash
npm i @akarui/aoi.panel
```

## Basic Usage:
```javascript
const {Panel} = require("@akarui/aoi.panel")
const { AoiClient, LoadCommands } = require("aoi.js");

const bot = new AoiClient({
    token: "Bot token",
    prefix: "p!",
    intents: ["Guilds", "GuildMessages", "MessageContent"],
    events: ["onMessage", "onInteractionCreate"]
});

const loader = new LoadCommands(bot);
loader.load(bot.cmd, "./commands/");

const panel = new Panel({
  port:3000,
  client:bot
})

panel.loadAPI({
  auth:" Authentication key here (random string), keep it safe, and no special charecters"
})

panel.loadGUI({
  username:["username 1","username 2"],
  password:["Password 1","Password 2"],
})
```

## View the full documentation [here](https://github.com/AkaruiDevelopment/panel/tree/aoiv6/documentation/README.md)

## Join our [Support Server](https://aoi.js.org/invite) for support
