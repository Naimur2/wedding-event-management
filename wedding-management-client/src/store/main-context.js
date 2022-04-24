import React from "react";

const MainContext = React.createContext({
    user: null,
    friends: [],
    addFriend: () => {},
    removeFriend: () => {},
    login: () => {},
    logout: () => {},
    validate: () => {},
    error: null,
    setError: () => {},
});

export default MainContext;
