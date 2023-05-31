const fetch = require("node-fetch")


async function checkVersion() {


  const data = await fetch('https://registry.npmjs.com/@akarui/aoi.panel').then(r => r.json());
  let c_version = require('../package.json').version
  if (c_version.includes("dev")===true) return console.log("You are using dev version of akarui/aoi.panel.");
  let l_version = data["dist-tags"].latest;
  if (c_version !== l_version) {
    console.log("\x1b[33m%s\x1b[0m","You are not using the latest version of @akarui/aoi.panel!\n Current Version:" + c_version + "\n Latest Version:" + l_version);
  }

}

function checkPackage() {

  let c_name = require('../package.json').name;
  
  if (c_name !== "@akarui/aoi.panel") {
    console.log("\x1b[33m%s\x1b[0m","You are not using the official version of @akarui/aoi.panel! The Developers at akaruiDevelopment are not responsible for anything going wrong with your bot! Install the official panel using: npm i @akarui/aoi.panel");
  }
}


module.exports = {
  checkVersion,
  checkPackage
}