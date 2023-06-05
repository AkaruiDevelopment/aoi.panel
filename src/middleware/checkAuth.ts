import express from "express";
import jwt from "jsonwebtoken";
import { AoiPanelRequest, UserData } from "../typings/interface.js";

export default function checkAuth(
    req: AoiPanelRequest,
    res: express.Response,
    next: express.NextFunction,
) {
    const authToken = req.headers.authorization;
    if (!authToken) return res.status(401).json({ message: "Unauthorized" });

    const token = authToken.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const userData = jwt.verify(
            token,
            req.panel.params.adminKey,
        ) as unknown as Omit<UserData, "password">;
        req.user = userData;
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}
