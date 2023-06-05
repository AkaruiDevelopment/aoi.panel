import { Paper, Box, Avatar, Divider, Badge, Chip } from "@mui/material";
import "./index.scss";
import { useEffect, useState } from "react";
import time from "../../utils/time";
export default function Stats(props: { status: string; avatar: string | undefined; username: any; badges: any; discriminator: any; id: any; prefix: any; guilds: any; ram: any; cpu: any; }) {
    const [uptime, setUptime] = useState(0);
    const [uptimeText, setUptimeText] = useState("0s");
    useEffect(() => {
        const interval = setInterval(() => {
            setUptime(uptime + 1);
            setUptimeText(time(uptime*1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [uptime]);


    return (
        <div className="stats">
            <div className="overlay">
                <h1>Stats</h1>
                <Divider
                    sx={{
                        width: "90%",
                        height: "2px",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderRadius: "16px",
                    }}
                />
                <Paper className="card" elevation={16}>
                    <div className="left">
                        <Badge
                            badgeContent={""}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            variant="standard"
                            overlap="circular"
                            sx={{
                                "& .MuiBadge-badge": {
                                    backgroundColor:
                                        props.status === "Online"
                                            ? "#43b581"
                                            : props.status === "Idle"
                                            ? "#faa61a"
                                            : props.status === "Dnd"
                                            ? "#f04747"
                                            : "#747f8d",
                                    color: "#fff",
                                    boxShadow: `0 0 0 2px ${
                                        props.status === "Online"
                                            ? "#43b581"
                                            : props.status === "Idle"
                                            ? "#faa61a"
                                            : props.status === "Dnd"
                                            ? "#f04747"
                                            : "#747f8d"
                                    }`,
                                    transform: "scale(1.5) translate(50%,30%)",
                                },
                            }}
                        >
                            <Avatar
                                src={props.avatar}
                                alt="Avatar"
                                className="avatar"
                                key={Math.random()}
                                variant="circular"
                                sx={{
                                    border:
                                        props.status === "Online"
                                            ? "8px solid #43b581"
                                            : props.status === "Idle"
                                            ? "8px solid #faa61a"
                                            : props.status === "Dnd"
                                            ? "8px solid #f04747"
                                            : "8px solid #747f8d",
                                }}
                            >
                                {props.username ?? "Bot"}
                            </Avatar>
                        </Badge>
                        <br />
                        <br />
                        <div className="badges">
                            {(props.badges ?? ['Bot','Verified','Ayaka'])?.map((badge:string) => {
                                return (
                                    <Chip
                                        label={badge}
                                        variant="outlined"
                                        className="chip"
                                        sx={{
                                            color: "#fff",
                                            borderColor: "#fff",
                                            margin: "4px 4px",
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <Box className="right">
                        <div className="row">
                            <div className="fields">
                                <h3>Username</h3>
                                <p>{props.username ?? "Bot"}</p>
                            </div>
                            <div className="fields">
                                <h3>Discriminator</h3>
                                <p>{props.discriminator ?? "#0000"}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="fields">
                                <h3>Id</h3>
                                <p>{props.id ?? "XXXXXXXXXXXXXXXXXX"}</p>
                            </div>
                            <div className="fields">
                                <h3>Prefix</h3>
                                <p>{props.prefix ?? "!"}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="fields">
                                <h3>Guilds</h3>
                                <p>{props.guilds ?? "0"}</p>
                            </div>
                            <div className="fields">
                                <h3>Uptime</h3>
                                <p>{uptimeText ?? 0}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="fields">
                                <h3>Ram</h3>
                                <p>{props.ram ?? "26 MB"}</p>
                            </div>
                            <div className="fields">
                                <h3>Cpu</h3>
                                <p>{props.cpu ?? "10%"}</p>
                            </div>
                        </div>
                    </Box>
                </Paper>
            </div>
        </div>
    );
}
