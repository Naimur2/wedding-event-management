import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/use-auth";

export default function DashboardPrivateRoute() {
    const auth = useAuth();

    return auth && auth.role==="admin" ? <Outlet /> : <Navigate to="/" />;
}
