import { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import "./index.scss";
export default function Eval(
    props: {
        open: boolean;
        updateOpen: (open: boolean) => void;
        title: string;
        endpoint: string;
    } & React.HTMLAttributes<HTMLFormElement>,
) {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };


    const submit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const res = await fetch(props.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ input }),
        });

        if (res.ok) {
            const data = await res.json();
            setOutput(data.output);
        } else {
            setOutput("Error");
        }
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
                {props.title} Eval
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
                    label="Input"
                    type="text"
                    fullWidth
                    multiline={true}
                    variant="standard"
                    required
                    value={input !== undefined ? input : undefined}
                    onChange={updateInput}
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
                    label="Output"
                    type="text"
                    fullWidth
                    multiline={true}
                    variant="standard"
                    value={output !== undefined ? output : undefined}
                    disabled={true}
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
                <Button onClick={submit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}
