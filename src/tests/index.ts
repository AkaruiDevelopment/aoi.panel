import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import FileRouter from "../routes/files.js";
import FolderRouter from "../routes/folders.js";
import path from "path";
const app = express();
import { createSourceTree } from "../controllers/files.js";
import AuthRouter from "../routes/auth.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
app.use((req, res, next) => {
    const src = createSourceTree(process.cwd());
    const obj = {};
    for (const [k, v] of src) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        obj[k] = v;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    req.panel = {
        params: {
            adminData: {
                username: "admin",
                password: "admin",
            },
            adminKey: "admin",
            refreshOptions: {
                enabled: false,
            },
        },
        sourceTree: obj,
    };
    next();
});
app.use(bodyParser.json());
app.use(cors());
app.use("/api/auth", AuthRouter);
app.use("/api/files", FileRouter);
app.use("/api/folders", FolderRouter);
app.use(express.static(path.join(process.cwd(), "./site")));

app.get("/api", (req, res) => {
    res.json({
        message: "Welcome to Aoi.js Panel API",
    });
});

app.get("/api/*", (req, res) => {
    res.status(404).json({
        message: "Invalid API route"
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "./site/index.html"));
});

app.listen(3000, () => console.log("Server started at port 3000"));
