import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/use-auth";

export default function UserPrivateRoute() {
    const auth = useAuth();

    return auth && auth.role==="user" ? <Outlet /> : <Navigate to="/" />;
}
