import { useState, useRef, useEffect, SetStateAction } from "react";
import "./index.scss";
export default function Terminal(props: { username: string }) {
    const [entries, setEntries] = useState<
        { inputValue: string; output: string }[]
    >([]);
    const [inputValue, setInputValue] = useState("");
    const [lastIndex, setLastIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (event: {
        target: { value: SetStateAction<string> };
    }) => {
        setInputValue(event.target.value);
    };

    const handlePress = (event: {
        key: string;
        preventDefault: () => void;
    }) => {
        if (event.key === "Enter") {
            // Process the command
            processCommand();
        } else if (event.key === "ArrowUp") {
            // prevent cursor from moving to the beginning of the line
            event.preventDefault();
            setLastIndex((lastIndex) => {
                if (lastIndex === 0) {
                    setInputValue(entries[lastIndex].inputValue);
                    return lastIndex;
                }
                setInputValue(entries[lastIndex - 1].inputValue);
                return lastIndex - 1;
            });
            const lastEntry = entries[lastIndex];
            if (lastEntry) {
                setInputValue(lastEntry.inputValue);
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            setLastIndex((lastIndex) => {
                if (lastIndex === entries.length - 1) {
                    setInputValue(entries[lastIndex].inputValue);
                    return lastIndex;
                }
                setInputValue(entries[lastIndex + 1].inputValue);
                return lastIndex + 1;
            });
        } else if (event.key === "Tab") {
            event.preventDefault();
            setInputValue((inputValue) => inputValue + "    ");
        }
    };

    const processCommand = async () => {
        // Process the command and generate the output
        const command = inputValue.trim();
        let output = "";

        if (command === "clear") {
            return setEntries([]);
            setInputValue("");
        }
        if (command === "aoi help") {
            output =
                "custom panel command list:\n\n" +
                "clear - clear the terminal\n" +
                "lhelp - show this message\n" +
                "ping - check the bot's ping\n" +
                "stats - show the bot's stats\n" +
                "ram - show the bot's ram usage\n" +
                "cpu - show the bot's cpu usage\n" +
                "js - run javascript code\n" +
                "\n\n note use 'aoi' before the command\n\n";

            setEntries((oldEntries) => {
                const newentries = [...oldEntries, { inputValue, output }];
                setLastIndex(newentries.length);
                return newentries;
            });

            setInputValue("");
            return;
        }

        const res = await fetch("/api/misc/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ cmd: command }),
        });
        const data = await res.json();
        output = data.stderr !== "" ? data.stderr : data.stdout;

        setEntries((oldEntries) => {
            const newentries = [...oldEntries, { inputValue, output }];
            setLastIndex(newentries.length);
            return newentries;
        });
        // Clear the input value
        setInputValue("");
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="terminal">
            <div>
                <pre>
                    {entries.map((entry, index) => (
                        <div
                            key={index}
                            style={{
                                fontFamily: '"JetBrains Mono", monospace',
                                fontSize: "16px",
                            }}
                        >
                            <span className="prompt">
                                {props.username}@
                                <span className="pkg">aoi.js</span> {">"}
                            </span>
                            <span className="input">{entry.inputValue}</span>
                            <br />
                            {entry.output}
                        </div>
                    ))}
                </pre>
            </div>
            <div className="inputside">
                <span className="prompt">
                    {" "}
                    {props.username}@<span className="pkg">aoi.js</span> {">"}{" "}
                </span>
                <input
                    type="text"
                    value={inputValue}
                    className="input"
                    onChange={handleInputChange}
                    onKeyDown={handlePress}
                    autoFocus={true}
                    ref={inputRef}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                />
            </div>
        </div>
    );
}
