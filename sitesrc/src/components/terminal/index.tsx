import { useState, useRef ,useEffect, SetStateAction} from "react";
import "./index.scss";
export default function Terminal() {
    const [entries, setEntries] = useState<
        { inputValue: string; output: string }[]
    >([]);
    const [inputValue, setInputValue] = useState("");
    const [lastIndex, setLastIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setInputValue(event.target.value);
    };

    const handlePress = (event: { key: string; preventDefault: () => void; }) => {
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

    const processCommand = () => {
        // Process the command and generate the output
        const command = inputValue.trim();
        let output = "";

        if (command === "help") {
            output = "Available commands: help, about, contact";
        } else if (command === "about") {
            output = "This is a custom web terminal component.";
        } else if (command === "contact") {
            output = "Email: example@example.com";
        } else {
            output = `Command not found: ${command}`;
        }

        setEntries((oldEntries) => {
           const newentries = [...oldEntries, { inputValue, output }]
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
                <pre >
                    {entries.map((entry, index) => (
                        <div key={index} style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '16px',
                        }}>
                            <span className="prompt">
                                bot@<span className="pkg">aoi.js</span> {">"}
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
                    bot@<span className="pkg">aoi.js</span> {">"}{" "}
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
