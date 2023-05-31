const fs = require("fs")
const path = require("path")

function fileRoutes(data, checkAuth) {
  data.app.get("/api/:auth/file",checkAuth, async function(req, res) {
    let f = req.query.file;
    if (!f) return res.status(404).json({ "err": "file not provided" });
    console.log(f)
    var list = [];
    try {
      function* walkSync(dir) {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          if (file.isDirectory()) {
            if (file.name.includes("node_modules") == false && file.name.includes(".config") == false && file.name.includes(".cache") == false && file.name.includes(".upm") == false) {
              yield* walkSync(path.join(dir, file.name));
            }
          } else {
            yield path.join(dir, file.name);
          }
        }
      }

      let ff = []
      for (const filePath of walkSync(process.cwd())) {
        ff.push(filePath);
      }

      for (const rr of ff) {
        list.push(rr);

      }
    } catch (e) {
      throw (e)
    }

    for (file in list) {
      if (f == list[file]) {
        return res.json({ "data": fs.readFileSync(list[file]).toString().split("\n") });
      }
    }
    return res.status(404).json({ "err": "file not found" })
  })
  data.app.get("/api/:auth/dirs",checkAuth, async function(req, res) {
  var dirR = req.query.dir;
  if (!dirR) {
    dirR = process.cwd()
  }
  if (dirR.includes("root")) { dirR = process.cwd() }

  var list = [];
  try {
    function* walkSync(dir) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        if (file.isDirectory()) {
          yield { "path": path.join(dir, file.name), "type": "dir" }
        } else {
          yield { "path": path.join(dir, file.name), "type": "file" };
        }
      }
    }

    let ff = []
    for (const filePath of walkSync(dirR)) {
      ff.push(filePath);
    }

    for (const rr of ff) {
      list.push(rr);

    }
  } catch (e) {
    return res.json({ "error": e })
  }

  res.json(list)
})
}

module.exports = {
  fileRoutes
}