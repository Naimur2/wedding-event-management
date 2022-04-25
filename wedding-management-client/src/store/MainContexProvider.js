import React from "react";
import { API_URI } from "../env";
import MainContext from "./main-context";


const defaultState = {
    user: null,
    error: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
            };
        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
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
            const response = await fetch(`${API_URI}/user/validate`, {
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
                    type: "SET_USER",
                    payload: data,
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const value = {
        user: mainReducer.user,
        error: mainReducer.error,
        validateToken,
        setUser: (user) => dispatch({ type: "SET_USER", payload: user }),
        setError: (error) => dispatch({ type: "SET_ERROR", payload: error }),
    };

    return (
        <MainContext.Provider value={value}>{children}</MainContext.Provider>
    );
}
