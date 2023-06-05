import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import BreakText from "../../components/breakText";
import Hexagons from "../../components/hexagons";
import TypeWriter from "../../components/typeWriter";

export default function Error() {
    return (
        <>
            <Hexagons>
                <BreakText text="Not Found: 404" />
                <TypeWriter
                    text="Are you sure you are in the right place?"
                    style={{
                        zIndex: 1,
                    }}
                />
                <Button sx={{
                    zIndex: 1,
                    color: "white",
                    fontSize: "1.5rem", 
                    fontWeight: "bold",
                }}
                variant="outlined"
                ><Link to="/"
                style={{
                    textDecoration: "none",
                    color: "white",
                }}
                >Home</Link></Button>
            </Hexagons>
        </>
    );
}
