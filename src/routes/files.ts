import { Router } from "express";
import {
    createFile,
    deleteFile,
    getFileContent,
} from "../controllers/files.js";
const router = Router();

router.post("/", async (req, res) => {
    const { dir, file, data } = req.body;

    if (!dir || !file || !data)
        return res.status(400).json({ message: "Missing parameters" });

    await createFile(dir, file, data);

    res.status(204);
});

router.put("/", async (req, res) => {
    const { dir, file, data } = req.body;

    if (!dir || !file || !data)
        return res.status(400).json({ message: "Missing parameters" });

    await createFile(dir, file, data);

    res.status(204);
});

router.delete("/", async (req, res) => {
    const { path } = req.body;

    if (!path) return res.status(400).json({ message: "Missing parameters" });

    await deleteFile(path);

    res.status(204);
});

router.post("/get-content", async (req, res) => {
    const { path } = req.body;

    if (!path) return res.status(400).json({ message: "Missing parameters" });

    res.json({
        data: await getFileContent(path),
    });
});

export default router;
