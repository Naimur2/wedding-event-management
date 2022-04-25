import React from "react";
import { Button, Container, Form, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { API_URI } from "../../env";
import MainContext from "./../../store/main-context";

export default function Register() {
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isPassword, setIsPassword] = React.useState(false);
    const navigate = useNavigate();
    const mainCtx = React.useContext(MainContext);

    const handleChange = (e, type) => {
        if (type === "email") setEmail(e.target.value);
        else if (type === "password") setPassword(e.target.value);
        else if (type === "username") setUsername(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const usernameRegex = /^[a-zA-Z0-9]{6,20}$/g;

        if (password.length < 6) {
            mainCtx.setError({
                type: "password",
                message: "Password must be at least 6 characters",
            });
            return;
        }
        if (username.length < 6) {
            mainCtx.setError({
                type: "username",
                message: "Username must be at least 6 characters",
            });
            return;
        }
        if (!usernameRegex.test(username)) {
            mainCtx.setError({
                type: "username",
                message:
                    "Username must be alphanumeric and at least 6 characters",
            });
            return;
        }
        mainCtx.setError(null);
        try {
            const formData = {
                email,
                username,
                password,
            };

            const response = await fetch(`${API_URI}/auth/register`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                alert("Account already exists");
                mainCtx.setError({
                    type: "register",
                    message: "Account  already exists",
                });
            } else {
                mainCtx.setError("");
                alert("Registered successfully");
                navigate("/login");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container className="mt-4">
            <h1>Register</h1>
            {mainCtx.error && mainCtx.error.type === "register" && (
                <Stack className="mt-3">
                    <p className="text-danger">{mainCtx.error.message}</p>
                </Stack>
            )}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        onChange={(e) => handleChange(e, "username")}
                        required
                        type="text"
                        placeholder="Enter username"
                        maxLength={12}
                        value={username}
                    />
                    <Form.Text className="text-muted">
                        {mainCtx.error &&
                            mainCtx.error.type === "username" &&
                            mainCtx.error.message}
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        onChange={(e) => handleChange(e, "email")}
                        required
                        type="email"
                        placeholder="Enter email"
                        value={email}
                    />
                    <Form.Text className="text-muted">
                        {mainCtx.error &&
                            mainCtx.error.type === "phone" &&
                            mainCtx.error.message}
                    </Form.Text>
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
                    <Form.Text className="text-muted">
                        {mainCtx.error &&
                            mainCtx.error.type === "password" &&
                            mainCtx.error.message}
                    </Form.Text>

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
                    Register
                </Button>
            </Form>
            <Stack className="mt-4">
                <p>
                    Already have an account? <Link to="/">Login</Link>{" "}
                </p>
            </Stack>
        </Container>
    );
}
