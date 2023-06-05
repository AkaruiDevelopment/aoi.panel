import express from "express";
import { AoiPanelRequest } from "../typings/interface.js";
import { Perms } from "../typings/enum.js";
import hasPerm from "../utils/perms.js";

export default function checkPerms(perms: Perms) {
    return function (
        req: AoiPanelRequest,
        res: express.Response,
        next: express.NextFunction,
    ) {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        const Perms = req.user.perms;

        if (!hasPerm(Perms, perms))
            return res.status(403).json({ message: "Forbidden" });
        next();
    };
}
