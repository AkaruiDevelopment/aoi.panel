const path = require('path')
const fs = require('fs')
const util = require("./utilFuncs.js");

class Panel {
  constructor(params) {
    this.params = params;

    util.checkVersion();
    util.checkPackage();

    console.log("\x1b[32m%s\x1b[0m", "Initializing @akarui/aoi.panel.")
    if (!params.port) {
      console.log("\x1b[33m%s\x1b[0m", "[@akarui/aoi.panel] A port was not provided. Taking default as 3000.")
      params.port = 3002;
    }
    if (!params.client) {
      console.log("\x1b[33m%s\x1b[0m", "[@akarui/aoi.panel] Aoi.js client was not provided. Exiting code.")
      process.exit(0)
    }
  }
  loadAPI(data) {
    if (!data.auth) {
      console.log("\x1b[33m%s\x1b[0m", "[@akarui/aoi.panel] A auth key for API was not provided. Exiting code.")
      process.exit(0)
    }
    this.auth=data.auth;
    const app = require("express")();
    app.listen(this.params.port)
    this.app=app;
    console.log("\x1b[32m%s\x1b[0m", "aoi.js Panel API ready on port: " + this.params.port)
    const f = require("./api/index.js");
    f.loadAPIRoutes(this);
  }

  loadGUI(data) {
    const params = this.params;
    if(!this.app){
      console.log("You need to run the function loadAPI() before you run loadGUI()")
      process.exit(0)
    }
    if(!data.username){
      console.log("Username(s) was not provided!");process.exit(0);
    }
    if(!data.password){
      console.log("Password(s) was not provided!");process.exit(0);
    }
    if(Array.isArray(data.password)==true && Array.isArray(data.username)==false || Array.isArray(data.password)==false && Array.isArray(data.username)==true){
      console.log("Username and Passwords should both be arrays!");process.exit(0);
    }
    if(Array.isArray(data.password)&&Array.isArray(data.username)){
      if(data.password.length!=data.username.length){
        console.log("Username and Passwords Array length must match!");process.exit(0);
      }
    }
    this.data = data;
    const thirtyDays = 1000 * 60 * 60 * 24 * 30;

    let app = this.app;
    app.get("/",function(req,res){res.sendFile(__dirname+"/views/index.html")})
    app.use(require("express").json())    // <==== parse request body as JSON
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json())


    app.use(require("express-session")({
      secret: require('crypto').randomBytes(16).toString("hex"),
      cookie: { maxAge: thirtyDays },
      resave: true,
      saveUninitialized: true
    }))
    const fs = require("fs");
    fs.readdirSync(__dirname+"/assets/").forEach(file => {
      app.get("/images/"+file,function(req,res){
        res.sendFile(__dirname+"/assets/"+file)
      })
    })

    require("./gui/frameworkmain.js")(data,this.params,app,this);
    app.set('view engine', 'html');
    app.set('views', __dirname + "/pages");
    console.log("\x1b[32m%s\x1b[0m", "aoi.js Panel GUI ready on port: " + params.port)
  }

  
  /*
    onError() {
      function random(length) {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz-_abcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
        }
        return result;
      }
  
      process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection/Catch');
        console.log(reason, p);
        fs.writeFileSync(path.join(__dirname, "/errors/" + random(8) + ".txt"), "Error: Unhandled Rejection/Catch \n\n" + reason + " \n\n" + p);
      });
      process.on("uncaughtException", (err, origin) => {
        console.log('Uncaught Exception/Catch');
        console.log(err, origin);
        fs.writeFileSync(path.join(__dirname, "/errors/" + random(8) + ".txt"), "Error: Uncaught Exception/Catch \n\n" + err + " \n\n" + origin);
      });
      process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log('Uncaught Exception/Catch ');
        console.log(err, origin);
        fs.writeFileSync(path.join(__dirname, "/errors/" + random(8) + ".txt"), "Error: Uncaught Exception/Catch \n\n" + err + " \n\n" + origin);
  
      });
      process.on('multipleResolves', (type, promise, reason) => {
       // console.log('Multiple Resolves');
        //console.log(reason, promise)
        fs.writeFileSync(path.join(__dirname, "/errors/" + random(8) + ".txt"), "Error: Uncaught Exception/Catch \n\n" + reason + " \n\n" + promise);
      });
  
  
    }
    isLoggedIn(req, res, next) {
      const params = this.params;
  
      if (Array.isArray(params.username) === true && Array.isArray(params.password)) {
        for (let i = 0; i < params.username.length; i++) {
          if (req.session.uname === params.username[i] && req.session.pswd === params.password[i]) {
            return true;
          }
          else if ((i + 1) === params.username.length) {
            return false;
          }
  
        }
  
      }
      else if (req.session.pswd === params.password && req.session.uname === params.username) {
        return true;
      }
      else {
        return false;
      }
    }*/
}


module.exports = {
  Panel
}
