import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Footer from "./components/footer";
import { useState } from "react";
import Panel from "./pages/panel";
import Error from "./pages/404";

export default function App() {
    const [openForum, setOpenForum] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    const updateIsLogged = (logged: boolean) => {
        setIsLogged(logged);
    };
    return (
        <>
            <Navbar open={openForum} updateOpen={setOpenForum} isLogged={isLogged} />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home open={openForum} updateOpen={setOpenForum} updateIsLogged={updateIsLogged} />
                    }
                />
                <Route path="/panel" element={<Panel />} />
                <Route path="*" element={<Error />} />
            </Routes>
            <Footer />
        </>
    );
}
