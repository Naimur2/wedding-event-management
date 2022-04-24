import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link to="/dashboard">Video Call</Link>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}
