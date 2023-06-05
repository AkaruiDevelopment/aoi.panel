import { RequestHandler, Router } from "express";
import { exec } from "child_process";
import { promisify } from "util";
import { AoiPanelRequest } from "../typings/interface.js";
import { inspect } from "util";
import { AoiClient } from "aoi.js";
import checkPerms from "../middleware/checkPerms.js";
import { Perms } from "../typings/enum.js";
const execAsync = promisify(exec);
const router = Router();
import checkAuth from "../middleware/checkAuth.js";
import getCpuUsage from "../utils/cpuUsage.js";
router.use(checkAuth as RequestHandler);
router.post(
    "/exec",
    checkPerms(Perms.AccessShell) as RequestHandler,
    async (req, res) => {
        const { cmd } = req.body;

        if (!cmd)
            return res.status(400).json({ message: "Missing parameters" });

        const { stdout, stderr } = await execAsync(cmd).catch((err: {stdout: string, stderr: string}) => {
            return err;
        });

        res.json({
            stdout,
            stderr,
        });
    },
);

router.post(
    "/eval/js",
    checkPerms(Perms.AccessEval) as RequestHandler,
    async (req, res) => {
        const { code } = req.body;
        const panel = (req as AoiPanelRequest).panel;

        if (!code)
            return res.status(400).json({ message: "Missing parameters" });

        const client = panel.params.client;
        try {
            const evaled = await eval(code);
            const output =
                typeof evaled !== "string"
                    ? inspect(evaled, { depth: 0 })
                    : evaled;

            res.json({
                output: output
                    .replaceAll(client.token as string, "[TOKEN]")
                    .replaceAll(panel.params.adminKey, "[ADMINKEY]")
                    .replaceAll(process.cwd(), "@root"),
            });
        } catch (err) {
            res.json({
                output: err,
            });
        }
    },
);

router.post(
    "/eval/aoi",
    checkPerms(Perms.AccessEval) as RequestHandler,
    async (req, res) => {
        const { code } = req.body;

        const panel = (req as AoiPanelRequest).panel;

        if (!code)
            return res.status(400).json({ message: "Missing parameters" });

        const client = panel.params.client;

        try {
            const interpreter = client.functionManager.interpreter as (
                client: AoiClient,
                message: Record<string, unknown>,
                args: [],
                cmd: {
                    name: string;
                    code: string;
                },
                db: AoiClient["db"],
                returnCode?: boolean,
            ) => Promise<{ code: string }>;

            const { code: output } = await interpreter(
                client,
                {},
                [],
                {
                    name: "aoi Eval",
                    code: `${req.query.execute}`,
                },
                client.db,
                true,
            );
            res.json({
                output: output
                    .replaceAll(client.token as string, "[TOKEN]")
                    .replaceAll(panel.params.adminKey, "[ADMINKEY]")
                    .replaceAll(process.cwd(), "@root"),
            });
        } catch (err) {
            res.json({
                output: err,
            });
        }
    },
);

router.post(
    "/reboot",
    checkPerms(Perms.Reboot) as RequestHandler,
    async (req, res) => {
        const panel = (req as AoiPanelRequest).panel;
        panel.refreshClient();
        res.status(204);
    },
);

router.get("/stats", async (req, res) => {
    const panel = (req as AoiPanelRequest).panel;
    const client = panel.params.client;
    const commands = [];
    for (const cmdType of client.cmd.types) {
        const cmdEntries = [];
        if (cmdType === "interaction") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const subCmdTypes = Object.keys(client.cmd[cmdType]);
            for (const subCmdType of subCmdTypes) {
                for (const cmd of [
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    ...client.cmd[cmdType][subCmdType].values(),
                ]) {
                    cmdEntries.push({
                        name: cmd.name,
                        type: cmd.type ?? cmdType,
                    });
                }
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            for (const cmd of [...client.cmd[cmdType].values()]) {
                cmdEntries.push({
                    name: cmd.name,
                    type: cmd.type ?? cmdType,
                });
            }
        }
        commands.push(...cmdEntries);
    }
    res.json({
        username: client.user?.username,
        discriminator: client.user?.discriminator,
        avatar: client.user?.avatarURL({ size: 4096 }),
        guilds: client.guilds.cache.size,
        prefix: Array.isArray(client.prefix)
            ? client.prefix.join(" | ")
            : client.prefix,
        id: client.user?.id,
        uptime: client.uptime ?? 0,
        ram: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
        cpu: getCpuUsage(),
        commands,
        status: client.user?.presence.status ?? "offline",
        badges: [...(client.user?.flags?.toArray() ?? []), "Bot"],
    });
});

export default router;
