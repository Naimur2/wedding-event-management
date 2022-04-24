import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import NotFound from "./pages/404";
import CallingModal from "./pages/calling-modal/calling-modal";
import Dashboard from "./pages/dashboard/dashboard";
import Login from "./pages/login/login";
import NavBar from "./pages/navbar/navbar";
import PrivateRoute from "./pages/private-route";
import Register from "./pages/register/register";
import SocketContext from "./store/socket-context";

export default function App() {
    const socketCtx = React.useContext(SocketContext);

    return (
        <>
            {socketCtx.callDetails && socketCtx.showCallingModal && (
                <CallingModal />
            )}
            <NavBar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute />}>
                    <Route path="/dashboard/" element={<Dashboard />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
