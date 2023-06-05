import { Router, RequestHandler } from "express";
import { createFolder, deleteFolder } from "../controllers/files.js";
import { AoiPanelRequest } from "../typings/interface";

const router = Router();
import checkAuth from "../middleware/checkAuth.js";
router.use(checkAuth as RequestHandler);
router.get("/", (req, res) => {
    res.json({
        data: (req as AoiPanelRequest).panel.sourceTree,
    });
});

router.post("/create", async (req, res) => {
    const { dir, folder } = req.body;

    await createFolder(dir, folder);

    res.status(204);
});

router.delete("/", async (req, res) => {
    const { dir } = req.body;

    if (!dir) return res.status(400).json({ message: "Missing parameters" });

    await deleteFolder(dir);

    res.status(204);
});

export default router;
