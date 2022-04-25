import React from "react";
import { Button, Container, Form, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { API_URI } from "../../env";
import MainContext from "../../store/main-context";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isPassword, setIsPassword] = React.useState(false);
    const mainCtx = React.useContext(MainContext);

    const handleChange = (e, type) => {
        if (type === "email") setEmail(e.target.value);
        else if (type === "password") setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                email,
                password,
            };
            const response = await fetch(`${API_URI}/auth/login`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log(data);

            if (response.status !== 200) {
                alert("Invalid phone or password");
                mainCtx.setError({
                    type: "login",
                    error: { message: "Invalid phone or password" },
                });
            } else {
                console.log(data);
                mainCtx.setUser(data.data);
                if (data.data.role === "admin") {
                    navigate("/dashboard");
                    console.log("admin");
                } else navigate("/user");
            }
        } catch (err) {
            mainCtx.setError({ type: "login", error: err });
        }
    };

    return (
        <Container className="mt-4">
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        onChange={(e) => handleChange(e, "email")}
                        required
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        onChange={(e) => handleChange(e, "password")}
                        required
                        type={isPassword ? "text" : "password"}
                        placeholder="Enter password"
                        maxLength={16}
                        value={password}
                    />
                    {password.length > 0 && (
                        <p
                            style={{ cursor: "pointer" }}
                            onClick={() => setIsPassword((prev) => !prev)}
                        >
                            {!isPassword ? "Show" : "Hide"} password.
                        </p>
                    )}
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
            <Stack className="mt-4">
                <p>
                    Don't have an account? <Link to="/register">Register</Link>{" "}
                </p>
            </Stack>
        </Container>
    );
}
