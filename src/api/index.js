const misc = require("./miscRoutes.js");
const file = require("./fileRoutes.js");

function loadAPIRoutes(data){
  let app = data.app;
  let auth=data.auth;
  function checkAuth(req, res, next) {
    
    if(!req.params.auth){
      return res.status(401).json({"error":"No auth was provided."})
    }
    if(req.params.auth!=auth){
      return res.status(401).json({"error":"Invalid auth key!"})
    }
    if(!data.params.client){
      return res.status(503).json({"error":"bot has not yet been initialized!"})
    }
    if(req.params.auth==auth){
      return next();
    }
  }
  misc.miscRoutes(data,checkAuth);
  file.fileRoutes(data,checkAuth);
  
}
module.exports = {
  loadAPIRoutes
}