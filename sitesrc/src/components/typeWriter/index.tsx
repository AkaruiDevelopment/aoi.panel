import { ClassAttributes, HTMLAttributes, useLayoutEffect,useState } from "react";
import "./index.scss";
import { JSX } from "react/jsx-runtime";

export default function TypeWriter(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLSpanElement> & HTMLAttributes<HTMLSpanElement> & { text: string }) {
    const [text, setText] = useState("");
    const [i, setI] = useState(0);

    const time = 100;
    const updateText = () => {
        if (i < props.text.length) {
            setText(text + props.text.charAt(i));
            setI(i + 1);
        }
    }
    useLayoutEffect(() => {
        if(text !== props.text) {
        setTimeout(updateText, time);
        }
    }, [text, i]);

    return (
        <span className="typewriter" {...props}>
            {text}
        </span>
    );
} 