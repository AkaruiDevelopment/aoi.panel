import React, { useState, Suspense, useRef, useEffect } from "react";
import Stats from "../../components/stats";
import "./index.scss";
import Commands from "../../components/command";
import { ButtonGroup, Button, Drawer, Divider, Skeleton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import Terminal from "../../components/terminal";
import Eval from "../../components/eval";
import { Perms, hasPerm } from "../../utils/perms";

export default function Panel() {
    const [openShell, setOpenShell] = useState(false);
    const [openEval, setOpenEval] = useState(false);
    const [evalData, setEvalData] = useState({ title: "", endpoint: "" });
    const [botStats, setBotStats] = useState({
        status: "",
        avatar: "",
        username: "",
        badges: [],
        discriminator: "",
        id: "",
        prefix: "",
        guilds: 0,
        ram: 0,
        cpu: 0,
        commands: [],
        uptime: 0,
    });
    const user = JSON.parse(localStorage.getItem("user") as string);
    const toggleDrawer =
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event &&
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }

            setOpenShell(open);
        };

    const handleEval =
        (title: string, open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event &&
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }

            setOpenEval(open);
            setEvalData({
                title,
                endpoint: `/api/misc/eval/${
                    title.toLowerCase() === "aoi.js" ? "aoi" : "js"
                }`,
            });
        };

    const timerRef = useRef<number | null>(null);

    const updateStats = async () => {
        const res = await fetch("/api/misc/stats",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${localStorage.getItem("token")}`
            },
        });
        const data = await res.json();
        setBotStats(data);
        console.log(botStats);
        timerRef.current = window.setTimeout(updateStats, 120000);
    };

    useEffect(() => {
        updateStats();
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <div className="panel">
            <br />
            <br />
            <div className="btngroup">
                <ButtonGroup
                    className="buttons"
                    variant="text"
                    aria-label="outlined primary button group"
                >
                    <Button className="button">
                        <Link to="/" className="link">
                            Home
                        </Link>
                    </Button>
                    {hasPerm(user.perms, Perms.AccessEditor) && (
                        <Button className="button">
                            <Link to="/editor" className="link">
                                Editor
                            </Link>
                        </Button>
                    )}
                    {hasPerm(user.perms, Perms.AccessFiles) && (
                        <Button className="button">
                            <Link to="/files" className="link">
                                Files
                            </Link>
                        </Button>
                    )}
                    <Button className="button">
                        <Link to="/guilds" className="link">
                            Guilds
                        </Link>
                    </Button>
                </ButtonGroup>
                <br />
                <ButtonGroup className="buttons btn" variant="text">
                    {hasPerm(user.perms, Perms.AccessShell) && (
                        <Button
                            className="button btn2"
                            onClick={toggleDrawer(true)}
                        >
                            Shell
                        </Button>
                    )}
                    {hasPerm(user.perms, Perms.AccessEval) && (
                        <>
                            <Button
                                className="button btn2"
                                onClick={handleEval("AoiJS", true)}
                            >
                                AoiJS Eval
                            </Button>

                            <Button
                                className="button btn2"
                                onClick={handleEval("JS", true)}
                            >
                                JS Eval
                            </Button>
                        </>
                    )}
                    {hasPerm(user.perms, Perms.Reboot) && (
                        <Button className="button btn2">Reboot</Button>
                    )}
                </ButtonGroup>
            </div>
            <Eval {...evalData} open={openEval} updateOpen={setOpenEval} />
            <br />
            <br />
            <Suspense
                fallback={
                    <Skeleton variant="rectangular" width={210} height={118} />
                }
            >
                <Stats
                    status={botStats.status as string}
                    avatar={botStats.avatar as string}
                    username={botStats.username as string}
                    badges={botStats.badges as string[]}
                    discriminator={botStats.discriminator as string}
                    id={botStats.id as string}
                    prefix={botStats.prefix as string}
                    guilds={botStats.guilds as number}
                    ram={botStats.ram as number}
                    cpu={botStats.cpu as number}
                    uptime={botStats.uptime as number}
                />
            </Suspense>
            <br />
            <br />
            <Commands
                commands={
                    botStats.commands as {
                        name: string;
                        type: string;
                    }[]
                }
            />
            <br />
            <br />
            <Drawer
                anchor="bottom"
                open={openShell}
                onClose={toggleDrawer(false)}
                sx={{
                    "& .MuiDrawer-paper": {
                        backgroundColor: "#000",
                        color: "#fff",
                    },
                }}
                className="shellcon"
            >
                <div
                    className="heads"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h2>Shell</h2>
                    <CloseIcon
                        onClick={toggleDrawer(false)}
                        className="shellclosebtn"
                    />
                </div>
                <br />
                <br />
                <Divider
                    sx={{
                        backgroundColor: "#fff",
                    }}
                />
                <br />
                <Suspense fallback={<div>Loading...</div>}>
                    <Terminal username={botStats.username} />
                </Suspense>
            </Drawer>
        </div>
    );
}
