/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import MainContext from "../../store/main-context";
import Call from "../call/call";
import SocketContext from "./../../store/socket-context";

export default function Dashboard() {
    const socketCtx = React.useContext(SocketContext);

    React.useEffect(() => {
        const peerConnection = () => {
            const { peer } = socketCtx;
            peer.on("open", (id) => {
                socketCtx.setPeerId(id);
            });

            peer.on("connection", (connection) => {
                connection.on("data", (data) => {
                    console.log("received data:", data);
                });
            });

            peer.on("close", function () {
                console.log("Connection destroyed");
            });

            peer.on("error", (e) => {
                console.log("peer error", e.message);
            });

            peer.on("disconnected", function () {
                console.log("Connection lost. Please reconnect");
            });
        };

        peerConnection();

        // const endCall = () => {
        //     if (socketCtx.callDetails) {
        //         const msz = {
        //             type: "END_CALL",
        //             data: socketCtx.callDetails,
        //         };
        //         socketCtx.sendMessage(msz);
        //     }
        // };

        // return endCall();
    }, []);

    React.useEffect(() => {
        const peer = socketCtx.peer;
        peer.on("call", async (call) => {
            call.answer(socketCtx.localStream); // Answer the call with an A/V stream.
            call.on("stream", function (remoteStream) {
                socketCtx.setRemoteStream(remoteStream);
            });
        });
    }, [socketCtx]);

    return (
        <>
            <Call />
        </>
    );
}
