const fs = require("fs")

function miscRoutes(data,checkAuth){
  data.app.get('/api/:auth', checkAuth ,async (req,res)=>{
    const bot = data.params.client;
    res.status(200).json({
      "usertag":bot.user.tag,
      "avatarURL":`https://cdn.discordapp.com/avatars/${bot.user.id}/${bot.user.avatar}.png`,
      "id":bot.user.id
    });
  })
  data.app.get("/api/:auth/baseRoute",checkAuth,(req,res)=>{
    res.status(200).json({
      "data":process.cwd()
    })
  })
  data.app.get('/api/:auth/reboot', checkAuth, (req, res)=> {
    res.json({"msg":"rebooting system"})
    function a(){
      process.on("exit", () => {
        require("child_process").spawn(process.argv.shift(), process.argv, {
          cwd: process.cwd(),
          detached: true,
          stdio: "inherit",
        });
      });
      console.log("Rebooting System!");
      process.exit();
    }
    setTimeout(a,3000);
    
  })
  data.app.get('/api/:auth/shellexec', checkAuth, async (req, res) => {
    if(!req.query.execute){
      return res.status(401).json({"error":"execute code not provided!"})
    }
    const exec = require('child_process')
    try {
      result = await exec.execSync(req.query.execute).toString().replace(/\n/g, '<br>')
    }
    catch (e) {
      result = e
    }
    const data = require('util').inspect(result, { depth: 0 }).replace(/\n/g, '<br>')
    res.json({"data":data.replace(/'/g, "")})
  })

  data.app.get('/api/:auth/stats',checkAuth, async (req, res) => {
    let client = data.params.client;

    let days = Math.floor(client.uptime / 86400000);

    let hours = Math.floor(client.uptime / 3600000) % 24;

    let minutes = Math.floor(client.uptime / 60000) % 60;

    let seconds = Math.floor(client.uptime / 1000) % 60;
    const initial = process.cpuUsage();
    const start = Date.now();
    while (Date.now() - start > 1);
    const final = process.cpuUsage(initial);
    let cpu = ((final.user + final.system) / 1000).toFixed(2);
    res.json({
      "ram": process.memoryUsage().rss / 1024 / 1024,
      "uptime": days + "d " + hours + "h " + minutes + "m " + seconds + "s ",
      "cpu": cpu
    })
  })
  data.app.get("/api/:auth/aoieval", checkAuth,async (req,res)=>{
    var result;
    try {
      const client = data.params.client;

      result = await client.functionManager.interpreter(
        client,
        {},
        [],
        {
          name: "aoi Eval",
          code: `${req.query.execute}`,
        },
        client.db,
        true,
      )

      result = result.code
    }
    catch (e) {
      result = e;
      console.log("Panel Aoi.js Eval Error:\n"+e)

    }
    const nd = require('util').inspect(result, { depth: 0 }).replace(/\n/g, '<br>')
    res.json({"data":nd.replace(/'/g, "")});
  })

  data.app.get("/api/:auth/djseval",checkAuth, async (req,res)=>{
    var result;
    try {
      const bot = data.params.client;
      const client = bot;

      result=await eval(req.query.execute);
    }
    catch (e) {
      result = e;
      console.log("Panel D.js Eval Error:\n"+e)
    }
    const nd = require('util').inspect(result, { depth: 0 }).replace(/\n/g, '<br>')
    res.json({"data":nd.replace(/'/g, "")});
  })
  data.app.get("/api/:auth/guilds",checkAuth,async (req,res)=>{
    let server = await data.params.client.guilds.cache.map(z => z)
    res.json(server);
  })
  data.app.get("/api/:auth/guild/:id",checkAuth,async (req,res)=>{
    let guild = await data.params.client.guilds.cache.get(req.params.id);
    if(!guild){return res.status(404).json({"data":"Guild not found!"})}
    var owner;
    try {
      owner = await bot.users.cache.get(guild.ownerId);
      return res.json({"guildid":guild.id,"guildname":guild.name,"owner":owner.tag,"ownerid":owner.id})
    }
    catch(e){
      owner="Bot owner not cached!"
      return res.json({"guildid":guild.id,"guildname":guild.name,"owner":owner,"ownerid":owner})
    }
    
  })

  data.app.get('/api/:auth/guild/leave',checkAuth, async (req, res) => {
    if (!req.query.id) return res.status(401).json({"data":"guild not provided"});
    let guild = bot.guilds.cache.get(req.query.id);

    if (!guild) return res.status(401).json({"data":"guild not found!"});
    try{
      await guild.leave()
      return res.json({"data":"Successfully left the guild!"})
    }
    catch(e){
      res.status(400).json({"data":"An error occurred. Check your editor's console!"});
      console.log("Error occurred while leaving guild with ID: "+req.query.id+"\n\n");
      return console.log(e.stack);
    }
  })

  data.app.get("/api/:auth/createFile" ,checkAuth, (req,res)=>{
    try{
      fs.writeFileSync(req.query.filepath.replace("\\\\","\\"), "")
      res.status(200).json({"data":"Success!"})
    }
    catch(e){
      res.status(400).json({"data":"Error Occurred while creating file: "+req.query.filepath.replace("\\\\","\\")})
      console.log(e)
      console.log(e.stack)
    }
  })
  data.app.get("/api/:auth/deleteFile" ,checkAuth, (req,res)=>{
    try{
      fs.unlinkSync(req.query.filepath.replace("\\\\","\\"), "")
      res.status(200).json({"data":"Success!"})
    }
    catch(e){
      res.status(400).json({"data":"Error Occurred while deleting file: "+req.query.filepath.replace("\\\\","\\")})
      console.log(e)
      console.log(e.stack)
    }
  })
  data.app.get("/api/:auth/deleteDir" ,checkAuth, (req,res)=>{
    try{
      fs.rmSync(req.query.filepath.replace("\\\\","\\"), { recursive: true, force: true });
      res.status(200).json({"data":"Success!"})
    }
    catch(e){
      res.status(400).json({"data":"Error Occurred while deleting directory: "+req.query.filepath.replace("\\\\","\\")})
      console.log(e)
      console.log(e.stack)
    }
  })

}

module.exports = {
  miscRoutes
}