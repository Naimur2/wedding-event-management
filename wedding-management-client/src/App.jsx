import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/404";
import DashboardPrivateRoute from "./pages/dashboard-route";
import Dashboard from "./pages/dashboard/dashboard";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import NavBar from "./pages/navbar/navbar";
import Register from "./pages/register/register";
import UserPrivateRoute from "./pages/user-route";
import User from "./pages/user/User";

export default function App() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<DashboardPrivateRoute />}>
                    <Route path="/dashboard/" element={<Dashboard />} />
                </Route>
                <Route path="/user" element={<UserPrivateRoute />}>
                    <Route path="/user/" element={<User />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
