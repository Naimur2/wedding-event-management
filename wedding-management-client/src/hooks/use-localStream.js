import React from "react";

export default function useLocalStream() {
    const [stream, setStream] = React.useState(null);

    React.useEffect(() => {
        const getStream = async () => {
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
                        setStream(str);
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            } catch (err) {
                console.log(err);
            }
        };

        getStream();
    }, []);

    return stream;
}
