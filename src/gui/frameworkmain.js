const fs = require("fs")

function loadFramework(data,params,app,thisD){
  function isLoggedIn(req,res,next){
    if(Array.isArray(data.username)){
      for(let i=0;i<data.username.length;i++){
        if(req.session.username==data.username[i] && req.session.password==data.password[i]){
          return next();
        }
      }
      return res.redirect("/")
    }
    else {
      if(req.session.username==data.username&&req.session.password==data.password){
        return next();
      }
      return res.redirect("/")
    }
  }
    app.get("/pass/validate/",async function(req,res){
        let uname= req.query.username;
        let pass = req.query.password;
        if(Array.isArray(data.username)){
          for(let i=0;i<data.username.length;i++){
            if(uname==data.username[i] && pass==data.password[i]){
              return res.json({"data":true});
            }
          }
          return res.json({"data":false})
        }
        else {
          if(uname==data.username&&pass==data.password){
            return res.json({"data":true})
          }
          return res.json({"data":false})
        }
    })
    app.get('/login', async (req, res) => {
      req.session.username = req.query.username;
      req.session.password = req.query.password;
      res.redirect("/panel")
    })
    app.get('/logout', async (req, res) => {
      req.session.username = "";
      req.session.password = "";
      res.redirect("/")
    })
    app.get('/panel',isLoggedIn, async (req, res) => {
        const bot = params.client;
        if (!bot.user) return res.redirect("/error?query=initialization")
        const data = fs.readFileSync(__dirname.replace("/gui","").replace("\\gui","")+"/views/panel.html").toString()

        res.send(data.replace(/(\!bot)/g,params.client.user.tag).replace(/(\!auth)/g,thisD.auth))
    })
    app.get('/error',async(req,res)=>{
        res.sendFile(__dirname.replace("/gui","").replace("\\gui","")+"/views/error.html")
    })

    
    
}

module.exports = loadFramework;
