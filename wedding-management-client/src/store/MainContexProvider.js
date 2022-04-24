import React from "react";
import MainContext from "./main-context";
const api = "http://localhost:4000";

const defaultState = {
    user: null,
    friends: [],
    error: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD_FRIEND":
            return {
                ...state,
                friends: [...state.friends, action.friend],
            };
        case "REMOVE_FRIEND":
            return {
                ...state,
                friends: state.friends.filter(
                    (friend) => friend.id !== action.friend.id
                ),
            };
        case "LOGIN":
            return {
                ...state,
                user: action.user,
            };

        case "LOGOUT":
            return {
                ...state,
                user: {},
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.error,
            };

        default:
            return state;
    }
};

export default function MainContexProvider({ children }) {
    const [mainReducer, dispatch] = React.useReducer(reducer, defaultState);

    const validateToken = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const response = await fetch(`${api}/user/validate`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.error) {
                localStorage.removeItem("token");
            } else {
                dispatch({
                    type: "LOGIN",
                    user: data,
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const value = {
        user: mainReducer.user,

        friends: mainReducer.friends,
        addFriend: (friend) => dispatch({ type: "ADD_FRIEND", friend }),
        removeFriend: (friend) => dispatch({ type: "REMOVE_FRIEND", friend }),
        login: (user) => dispatch({ type: "LOGIN", user }),
        logout: () => dispatch({ type: "LOGOUT" }),
        validate: () => validateToken(),
        error: mainReducer.error,
        setError: (error) => dispatch({ type: "SET_ERROR", error }),
    };

    return (
        <MainContext.Provider value={value}>{children}</MainContext.Provider>
    );
}
