import React,{ useState, Suspense } from "react";
import Stats from "../../components/stats";
import "./index.scss";
import Commands from "../../components/command";
import { ButtonGroup, Button, Drawer,Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import Terminal from "../../components/terminal";
import Eval from "../../components/eval";

export default function Panel() {
    const [openShell, setOpenShell] = useState(false);
    const [openEval, setOpenEval] = useState(false);
    const [evalData, setEvalData] = useState({ title: "", endpoint: "" });

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

    const handleEval = (title:string,open:boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === "keydown" &&
            ((event as React.KeyboardEvent).key === "Tab" ||
                (event as React.KeyboardEvent).key === "Shift")
        ) {
            return;
        }

        setOpenEval(open);
        setEvalData({ title, endpoint: `http://localhost:3001/eval/${title.toLowerCase() === 'aoi.js' ? "aoi" : "js"}` });
    }
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
                    <Button className="button">
                        <Link to="/editor" className="link">
                            Editor
                        </Link>
                    </Button>
                    <Button className="button">
                        <Link to="/files" className="link">
                            Files
                        </Link>
                    </Button>
                    <Button className="button">
                        <Link to="/guilds" className="link">
                            Guilds
                        </Link>
                    </Button>
                </ButtonGroup>
                <br />
                <ButtonGroup className="buttons btn" variant="text">
                    <Button
                        className="button btn2"
                        onClick={toggleDrawer(true)}
                    >
                        Shell
                    </Button>
                    <Button className="button btn2"
                        onClick={handleEval("AoiJS",true)}
                    >AoiJS Eval</Button>
                    <Button className="button btn2"
                        onClick={handleEval("JS",true)}
                    >JS Eval</Button>
                    <Button className="button btn2">Reboot</Button>
                </ButtonGroup>
            </div>
            <Eval {...evalData} open={openEval} updateOpen={setOpenEval} />
            <br />
            <br />
            <Stats
                status={""}
                avatar={undefined}
                username={undefined}
                badges={undefined}
                discriminator={undefined}
                id={undefined}
                prefix={undefined}
                guilds={undefined}
                ram={undefined}
                cpu={undefined}
            />
            <br />
            <br />
            <Commands
                commands={[
                    {
                        name: "ping",
                        type: "basic",
                    },
                    {
                        name: "help",
                        type: "basic",
                    },
                    {
                        name: "stats",
                        type: "basic",
                    },
                    {
                        name: "uptime",
                        type: "basic",
                    },
                    {
                        name: "eval",
                        type: "owner",
                    },
                    {
                        name: "reload",
                        type: "owner",
                    },
                    {
                        name: "shutdown",
                        type: "owner",
                    },
                ]}
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
                <div className="heads" style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}> 
                    <h2>Shell</h2>
                    <CloseIcon onClick={toggleDrawer(false)} className="shellclosebtn" />
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
                <Terminal />
                </Suspense>
            </Drawer>
        </div>
    );
}
