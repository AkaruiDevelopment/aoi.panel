import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import aoijsBanner from "../../assets/aoibanner.png";
import "./index.scss";
export default function Navbar(props: { open: boolean; updateOpen: Function }) {
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLogged(true);
        }
    }, []);

    return (
        <header className="navcon">
            <nav className="navbar">
                <div className="logo">
                    <img src={aoijsBanner} alt="aoi banner" />
                </div>
                <div className="links">
                    {isLogged ? (
                        <>
                            <NavLink className="link" to="/panel">
                                Panel
                            </NavLink>
                            <NavLink className="link" to="/settings">
                                Settings
                            </NavLink>
                            <NavLink className="link" to="/logout">
                                Logout
                            </NavLink>
                        </>
                    ) : (
                        <button
                            className="link"
                            onClick={() => props.updateOpen(!props.open)}
                        >
                            Login
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
}
