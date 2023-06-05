import BreakText from "../../components/breakText";
import Hexagons from "../../components/hexagons";
import Login from "../../components/login";
import TypeWriter from "../../components/typeWriter";

export default function Home(props: {
    open: boolean;
    updateOpen: (open: boolean) => void;
    updateIsLogged: (logged: boolean) => void;
}) {
    return (
        <>
            <Hexagons>
                <BreakText text="@akarui/aoi.panel" />
                <TypeWriter
                    text="Aoi.js Panel is now FASTER, SMOOTHER & MORE ELEGANT!!"
                    style={{
                        zIndex: 1,
                    }}
                />
                <Login
                    open={props.open}
                    updateOpen={props.updateOpen}
                    updateIsLogged={props.updateIsLogged}
                />
            </Hexagons>
        </>
    );
}
