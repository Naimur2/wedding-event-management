import React from "react";

const MainContext = React.createContext({
    user: null,
    validateToken: () => {},
    error: null,
    setError: () => {},
    setUser: () => {},
});

export default MainContext;
