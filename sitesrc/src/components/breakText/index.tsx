import React from "react";
import "./index.scss";
export default function BreakText(props: { text: string }) {
    const letters = props.text.split("");

    return (
        <div className="breakText" id="bt">
            {letters.map((letter, i) => {
                const style = {
                    "--i":
                        i & 1
                            ? props.text.length / 2 - i
                            : -(props.text.length / 2 - i),
                } as React.CSSProperties;
                return (
                    <span className="letter" key={i} style={style}>
                        {letter}
                    </span>
                );
            })}
        </div>
    );
}
