import { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./index.scss";
export default function Login(
    props: {
        open: boolean;
        updateOpen: (open: boolean) => void;
        updateIsLogged: (logged: boolean) => void;
    } & React.HTMLAttributes<HTMLFormElement>,
) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const updateUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const navigate = useNavigate();

    const login = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    props.updateIsLogged(true);
                    navigate("/panel");
                }
            });
    };

    return (
        <Dialog open={props.open} onClose={props.updateOpen} className="login">
            <DialogTitle
                sx={{
                    "& .MuiTypography-root": {
                        m: 0,
                        p: 2,
                        backgroundColor: "rgba(40,40,40,1)",
                        color: "white",
                    },
                    backgroundColor: "rgba(40,40,40,1)",
                    color: "white",
                }}
            >
                Login
            </DialogTitle>
            <DialogContent
                sx={{
                    backgroundColor: "rgba(40,40,40,1)",
                    color: "white",
                }}
            >
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Username"
                    type="text"
                    fullWidth
                    variant="standard"
                    required
                    value={username !== undefined ? username : undefined}
                    onChange={updateUsername}
                    sx={{
                        "& .MuiInputBase-input": {
                            color: "white",
                        },
                        backgroundColor: "rgba(40,40,40,1)",
                        color: "white",

                        caretColor: "white",
                        "& .MuiInput-underline:before": {
                            borderBottomColor: "white",
                        },

                        "& .MuiInput-underline:after": {
                            borderBottomColor: "white",
                        },

                        "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                            {
                                borderBottomColor: "white",
                            },
                    }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    required
                    value={password !== undefined ? password : undefined}
                    onChange={updatePassword}
                    sx={{
                        "& .MuiInputBase-input": {
                            color: "white",
                        },
                        backgroundColor: "rgba(40,40,40,1)",
                        color: "white",

                        caretColor: "white",
                        "& .MuiInput-underline:before": {
                            borderBottomColor: "white",
                        },

                        "& .MuiInput-underline:after": {
                            borderBottomColor: "white",
                        },

                        "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                            {
                                borderBottomColor: "white",
                            },
                    }}
                />
            </DialogContent>
            <DialogActions
                sx={{
                    "& .MuiTypography-root": {
                        m: 0,
                        p: 2,
                        backgroundColor: "rgba(40,40,40,1)",
                        color: "white",
                    },
                    backgroundColor: "rgba(40,40,40,1)",
                    color: "white",
                }}
            >
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        props.updateOpen(false);
                    }}
                >
                    Close
                </Button>
                <Button onClick={login}>Login</Button>
            </DialogActions>
        </Dialog>
    );
}
