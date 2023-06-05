import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Footer from "./components/footer";
import { useState } from "react";
import Panel from "./pages/panel";

export default function App() {
    const [openForum, setOpenForum] = useState(false);
    return (
        <>
            <Navbar open={openForum} updateOpen={setOpenForum} />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home open={openForum} updateOpen={setOpenForum} />
                    }
                />
                <Route path="/panel" element={<Panel />} />
                <Route path="*" redirect="/" />
            </Routes>
            <Footer />
        </>
    );
}
