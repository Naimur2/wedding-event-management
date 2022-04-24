import React from "react";
import { PEER_CONFIG } from "../env";
import SocketContext from "./socket-context";
import Peer from "peerjs";

const defaultState = {
    socket: null,
    message: null,
    callDetails: null,
    showCallingModal: false,
    localStream: null,
    remoteStream: null,
    peerId: null,
    peer: null,
    isBusy: false,
    isRejected: false,
    isEndCall: null,
    notFound: false,
    localCall: null,
};

const socketReducerer = (state, action) => {
    switch (action.type) {
        case "SET_SOCKET":
            return {
                ...state,
                socket: action.socket,
            };
        case "SET_MESSAGE":
            return {
                ...state,
                message: action.message,
            };
        case "SET_CALL_DETAILS":
            return {
                ...state,
                callDetails: action.callDetails,
            };
        case "SET_SHOW_CALLING_MODAL":
            return {
                ...state,
                showCallingModal: action.showCallingModal,
            };
        case "SET_LOCAL_STREAM":
            return {
                ...state,
                localStream: action.localStream,
            };
        case "SET_REMOTE_STREAM":
            return {
                ...state,
                remoteStream: action.remoteStream,
            };
        case "SET_PEER_ID":
            return {
                ...state,
                peerId: action.peerId,
            };
        case "SET_PEER":
            return {
                ...state,
                peer: action.peer,
            };
        case "SET_IS_BUSY":
            return {
                ...state,
                isBusy: action.isBusy,
            };
        case "SET_IS_REJECTED":
            return {
                ...state,
                isRejected: action.isRejected,
            };
        case "SET_IS_END_CALL":
            return {
                ...state,
                isEndCall: action.isEndCall,
            };
        case "SET_NOT_FOUND":
            return {
                ...state,
                notFound: action.notFound,
            };
        case "SET_LOCAL_CALL":
            return {
                ...state,
                localCall: action.localCall,
            };

        default:
            return state;
    }
};

export default function SocketProvider({ children }) {
    const [state, dispatch] = React.useReducer(socketReducerer, defaultState);
    const localPeer = React.useRef(null);
    const locCall = React.useRef(null);

    const answerCall = React.useCallback(
        async (peerId, socket, type) => {
            // alert("answerCall");

            const getUserMedia =
                (await navigator.getUserMedia) ||
                (await navigator.webkitGetUserMedia) ||
                (await navigator.mozGetUserMedia);

            const options = {
                video: true,
                audio: true,
                videoConstraints: {
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 720 },
                },
            };

            try {
                await getUserMedia(
                    options,
                    (str) => {
                        dispatch({
                            type: "SET_LOCAL_STREAM",
                            localStream: str,
                        });

                        const call = localPeer.current.call(peerId, str);
                        locCall.current = call;

                        dispatch({
                            type:"SET_IS_END_CALL",
                            isEndCall: false,
                        });

                        dispatch({
                            type: "SET_LOCAL_CALL",
                            localCall: call,
                        });

                        call.on("stream", (remoteStream) => {
                            dispatch({
                                type: "SET_REMOTE_STREAM",
                                remoteStream: remoteStream,
                            });
                        });
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            } catch (err) {
                console.log(err);
            }
        },
        [localPeer]
    );

    const value = React.useMemo(() => {
        const setPeer = () => {
            const peer = new Peer(null, PEER_CONFIG);
            localPeer.current = peer;
            dispatch({
                type: "SET_PEER",
                peer,
            });
        };

        const sendMessage = (message) => {
            console.log(message.type, message);
            const mssg = JSON.stringify(message);

            if (state.socket) {
                state.socket.send(mssg);
            }
        };

        const endCall = (data, socket) => {
            dispatch({
                type: "SET_IS_END_CALL",
                isEndCall: true,
            });

            dispatch({
                type: "SET_LOCAL_CALL",
                localCall: null,
            });

            dispatch({
                type: "SET_REMOTE_STREAM",
                remoteStream: null,
            });

            dispatch({
                type: "SET_LOCAL_STREAM",
                localStream: null,
            });

            dispatch({
                type: "SET_SHOW_CALLING_MODAL",
                showCallingModal: false,
            });

            locCall.current.close();
            locCall.current = null;
        };

        const onRejectCall = (call) => {
            dispatch({
                type: "SET_IS_REJECTED",
                isRejected: true,
            });
            dispatch({
                type: "SET_SHOW_CALLING_MODAL",
                showCallingModal: false,
            });

            dispatch({
                type: "SET_LOCAL_CALL",
                localCall: null,
            });

            dispatch({
                type: "SET_CALL_DETAILS",
                callDetails: null,
            });

            locCall.close();
            alert("Call Rejected");
        };

        const onBusy = (call) => {
            dispatch({
                type: "SET_IS_BUSY",
                isBusy: true,
            });
            alert("User is busy");
        };

        const onCall = async (data) => {
            console.log("alert", data);
            dispatch({
                type: "SET_CALL_DETAILS",
                callDetails: data,
            });
            dispatch({
                type: "SET_SHOW_CALLING_MODAL",
                showCallingModal: true,
            });
        };

        const setMessage = (message) => {
            dispatch({
                type: "SET_MESSAGE",
                message,
            });
        };

        const setSocket = (user) => {
            const socket = new WebSocket("ws://localhost:8080");
            socket.onopen = () => {
                socket.send(
                    JSON.stringify({
                        type: "SET_USER",
                        data: { userId: user._id, phone: user.phone },
                    })
                );
                dispatch({
                    type: "SET_SOCKET",
                    socket,
                });
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case "SET_MESSAGE":
                        setMessage(data);
                        break;
                    case "ANSWER_CLIENT_CALL":
                        answerCall(
                            data.data.callerPeerId,
                            socket,
                            "callerPeerId"
                        );
                        break;
                    case "ANSWER_RECEIVER_CALL":
                        const newData = JSON.stringify({
                            type: "ANSWER_CLIENT_CALL",
                            data: data.data,
                        });
                        socket.send(newData);
                        answerCall(
                            data.data.recieverPeerId,
                            socket,
                            "recieverPeerId"
                        );
                        break;
                    case "END_CALL":
                        socket.send(
                            JSON.stringify({
                                type: "END_CLIENT_CALL",
                                data: data.data,
                            })
                        );
                        endCall(data.data, socket);
                        break;
                    case "END_CLIENT_CALL":
                        endCall(data.data, socket);
                        break;
                    case "REJECT_CALL":
                        onRejectCall(data.data);
                        break;
                    case "CALL_REQUEST":
                        onCall(data.data);
                        break;
                    case "BUSY":
                        onBusy(data.data);
                        break;
                    case "NOT_FOUND":
                        alert("User NOT FOUND");
                        break;
                    default:
                        break;
                }
            };

            socket.onclose = () => {
                dispatch({
                    type: "SET_SOCKET",
                    socket: null,
                });
            };
        };

        const callToUser = (data) => {
            const message = {
                type: "CALL_TO_USER",
                data,
            };
            sendMessage(message);
        };

        return {
            socket: state.socket,
            message: state.message,
            setSocket: setSocket,
            sendMessage: sendMessage,
            setMessage: (message) => dispatch({ type: "SET_MESSAGE", message }),
            callToUser: callToUser,
            endCall: endCall,
            callDetails: state.callDetails,
            setCallDetails: (callDetails) =>
                dispatch({ type: "SET_CALL_DETAILS", callDetails }),
            showCallingModal: state.showCallingModal,
            setShowCallingModal: (showCallingModal) =>
                dispatch({ type: "SET_SHOW_CALLING_MODAL", showCallingModal }),
            localStream: state.localStream,
            setLocalStream: (localStream) =>
                dispatch({ type: "SET_LOCAL_STREAM", localStream }),
            remoteStream: state.remoteStream,
            setRemoteStream: (remoteStream) =>
                dispatch({ type: "SET_REMOTE_STREAM", remoteStream }),
            peerId: state.peerId,
            setPeerId: (peerId) => dispatch({ type: "SET_PEER_ID", peerId }),
            peer: state.peer,
            setPeer,
            isRejected: state.isRejected,
            setIsRejected: (isRejected) =>
                dispatch({ type: "SET_IS_REJECTED", isRejected }),
            isEndCall: state.isEndCall,
            setIsEndCall: (isEndCall) =>
                dispatch({ type: "SET_IS_END_CALL", isEndCall }),
            isBusy: state.isBusy,
            setIsBusy: (isBusy) => dispatch({ type: "SET_IS_BUSY", isBusy }),
            notFound: state.notFound,
            setNotFound: (notFound) =>
                dispatch({ type: "SET_NOT_FOUND", notFound }),
            localCall: state.localCall,
            setLocalCall: (localCall) =>
                dispatch({ type: "SET_LOCAL_CALL", localCall }),
        };
    }, [state, answerCall]);

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}
