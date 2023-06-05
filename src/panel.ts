import { AoiPanelRequest, PanelParams, SourceTreePath } from "./typings/interface.js";
import express from "express";
import checkVersion from "./utils/checkVersion.js";
import { printError, printSuccess, printWarn } from "./utils/printers.js";
import bodyParser from "body-parser";
import cors from "cors";
import checkAuth from "./middleware/checkAuth.js";
import { createSourceTree } from "./controllers/files.js";
import path from "path";
export class Panel {
    params: PanelParams;
    app!: express.Express;
    #sourceTree: Record<string,SourceTreePath> = {};
    constructor(params: PanelParams) {
        this.params = params;

        checkVersion();
        this.#validate();
    }
    #init() {
        this.app = express();
        for(const [k,v] of createSourceTree(process.cwd())) {
            this.#sourceTree[k] = v;
        }

        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(this.#addPanelData());
        this.app.use(checkAuth as express.RequestHandler);

        this.app("/api", (req, res) => {
            res.json({
                message: "Welcome to Aoi.js Panel API",
            });
        });

        this.app.get("/api/*", (req, res) => {
            res.status(404).json({
                message: "Invalid API route"
            });
        });

        this.app.get("*", (req, res) => {
            res.sendFile(path.join("../../site/index.html"));
        });

        this.app.listen(this.params.port, () =>
            printSuccess(`Panel served at port ${this.params.port}`),
        );
    }
    #validate() {
        if (!this.params.port) {
            printWarn("Port not provided, using default port 3000");
            this.params.port = 3000;
        }
        if (!this.params.client) {
            printError("Client not Found!");
            process.exit(1);
        }
        if (!this.params.adminKey) {
            printError("Admin Key not Found!");
            process.exit(1);
        }
        if (!this.params.refreshOptions) {
            printWarn("Refresh Options not Found, using default options");
            this.params.refreshOptions = {
                interval: 600000,
                enabled: true,
                key: "refresh",
            };
        }
        if (!this.params.userData) {
            printError("User Data not Found!");
            process.exit(1);
        }

        if (!this.params.userData.username || !this.params.userData.password) {
            printError("Username or Password not Found!");
            process.exit(1);
        }

        if (this.params.refreshOptions.enabled) {
            if (!this.params.refreshOptions.interval) {
                printWarn(
                    "Refresh Interval not Found, using default interval 600000",
                );
                this.params.refreshOptions.interval = 600000;
            }
            if (!this.params.refreshOptions.key) {
                printWarn("Refresh Key not Found, using default key refresh");
                this.params.refreshOptions.key = "refresh";
            }
        }

        if (this.params.refreshOptions.key === "refresh") {
            printWarn("Refresh Key is default, it is recommended to change it");
        }
    }
    #addPanelData() {
        return ((
            req: AoiPanelRequest,
            res: express.Response,
            next: express.NextFunction,
        ) => {
            req.panel = this;
            next();
        }) as express.RequestHandler;
    }

    get sourceTree() {
        return this.#sourceTree;
    }

    getSourceTreeInfo(path: string) {
        const parsedPath = path.replace(process.cwd(),"@root");
        return this.#sourceTree[parsedPath];
    }

    refreshSourceTree() {
        this.#sourceTree = {};
        for(const [k,v] of createSourceTree(process.cwd())) {
            this.#sourceTree[k] = v;
        }
    }
    refreshClient() {
        const token = this.params.client.token as string;
        this.params.client.destroy();

        this.params.client.login(token);
    }
    connect() {
        this.#init();
    }
}
