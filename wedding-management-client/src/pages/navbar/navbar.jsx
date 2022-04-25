import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import useAuth from "./../../hooks/use-auth";
import React from "react";
import MainContext from "../../store/main-context";

export default function NavBar() {
    const mainCtx = React.useContext(MainContext);
    const [path, setPath] = React.useState("");
    const auth = useAuth();

    React.useEffect(() => {
        if (mainCtx.user && mainCtx.user.role === "admin")
            setPath("/dashboard");
        else if (mainCtx.user && mainCtx.user.role === "user") setPath("/user");
        else setPath("/");
    }, [mainCtx.user]);

    const NoAuth = () => (
        <Nav variant="dark" className="ml-auto">
            <NavLink
                className={(props) => (props.isActive ? "link active" : "link")}
                to={"/login"}
            >
                Login
            </NavLink>

            <NavLink
                className={(props) => (props.isActive ? "link active" : "link")}
                to={"/register"}
            >
                Register
            </NavLink>
        </Nav>
    );
    return (
        <Navbar bg="dark" expand="lg" variant="dark">
            <Container>
                <Link to={path}>
                    <Navbar.Brand>New Wedding</Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse
                    className="justify-content-end"
                    id="basic-navbar-nav"
                >
                    {!auth ? <NoAuth /> : <></>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
