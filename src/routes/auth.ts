import jwt from "jsonwebtoken";
import { Router } from "express";
import { AoiPanelRequest, UserData } from "../typings/interface.js";
import { generateAccessToken } from "../controllers/tokens.js";
import { Perms } from "../typings/enum.js";
const router = Router();

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const panel = (req as AoiPanelRequest).panel;
    if (
        username === panel.params.adminData.username &&
        password === panel.params.adminData.password
    ) {
        const AccessToken = generateAccessToken(
            {
                username,
                perms: Perms.Admin,
            },
            panel.params.adminKey,
        );
        if (panel.params.refreshOptions.enabled) {
            const RefreshToken = jwt.sign(
                { username },
                panel.params.refreshOptions.key,
            );

            return res
                .cookie("refresh_token", RefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                })
                .json({
                    token: AccessToken,
                    user: {
                        username,
                        perms: Perms.Admin,
                    },
                });
        }
        return res.json({
            token: AccessToken,
            user: {
                username,
                perms: Perms.Admin,
            }
        });
    } else if (
        panel.users[username] &&
        panel.users[username].password === password
    ) {
        const AccessToken = generateAccessToken(
            {
                username,
                perms: panel.users[username].perms,
            },
            panel.params.adminKey,
        );
        if (panel.params.refreshOptions.enabled) {
            const RefreshToken = jwt.sign(
                { username },
                panel.params.refreshOptions.key,
            );

            return res
                .cookie("refresh_token", RefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                })
                .json({
                    token: AccessToken,
                    user: {
                        username,
                        perms: panel.users[username].perms,
                    }
                });
        }
        return res.json({
            token: AccessToken,
            user: {
                username,
                perms: panel.users[username].perms,
            }
        });
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
});

router.post("/refresh", async (req, res) => {
    // eslint-disable-next-line camelcase
    const { refresh_token } = req.cookies;
    const panel = (req as AoiPanelRequest).panel;
    // eslint-disable-next-line camelcase
    if (!refresh_token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(
            refresh_token,
            panel.params.refreshOptions.key,
        ) as Omit<UserData, "password">;
        const AccessToken = jwt.sign(
            { username: decoded.username },
            panel.params.adminKey,
            {
                expiresIn: "1h",
            },
        );
        return res.json({
            token: AccessToken,
        });
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
});

export default router;
