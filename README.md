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
const {AoiClient} = require("aoi.js")
const bot = new AoiClient({
  token: "Discord Bot Token",
  prefix: "Discord Bot Prefix",
  intents: ["MessageContent", "Guilds", "GuildMessages"],
  events: ["onMessage"]
});
const panel = new Panel({
    username: "your-username",//username for logging in
    password: "password-here",//password for logging in
    secret: require('crypto').randomBytes(16).toString("hex"),//session secret
    port: 3000,//port on which website is hosted, Not required! Default 3000
    bot: bot,//your aoi.js client
    mainFile: "index.js",//Main file where code is running.Not required, default taken from package.json
    commands: "./commands",// folder name in which all the edit needing files are there.
    interaction:"./interactions"//interactions folder
})
panel.loadPanel()//Load The Panel
panel.onError()//Will detect errors, and send it to aoi.panel's error page.
```
## We also support aoi.js v6 and discord.js v13.

## View the full documentation [here](https://github.com/AkaruiDevelopment/panel/tree/aoiv6/documentation/README.md)

## Join our [Support Server](https://aoi.js.org/invite) for support
