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
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ code: input }),
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
            >
                {props.title} Eval
            </DialogTitle>
            <DialogContent
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
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Output"
                    type="text"
                    fullWidth
                    multiline={true}
                    variant='outlined'
                    value={output !== undefined ? output : undefined}
                    disabled={true}
                />
            </DialogContent>
            <DialogActions

            >
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        setOutput("");
                        setInput("");
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
