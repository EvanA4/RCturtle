import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WebSocketDemo = () => {
    //Public API that will echo messages sent to it back to the client
    const [socketUrl, setSocketUrl] = useState('ws://localhost:5656');
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    const [messageHistory, setMessageHistory] = useState([]);

    const commandRef = React.useRef()

    // const [turtleData, setData] = useState("")

    const handleClickSendMessage = useCallback(() => {
        sendMessage(commandRef.current.value)
    }, []);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage, setMessageHistory]);

    return (
        <div>
            <p></p>
            <label>&nbsp;&nbsp;Enter a command:&nbsp;&nbsp;
                <input
                    id="command"
                    type="text"
                    ref={commandRef}>
                </input>
            </label>
            <button
                onClick={handleClickSendMessage}
            >
                Submit
            </button>

            <p></p>
            <label>&nbsp;&nbsp;Most recent data:&nbsp;&nbsp;
                {lastMessage ? <span>{lastMessage.data}</span> : null}
            </label>
        </div>
    );
};

export default WebSocketDemo;