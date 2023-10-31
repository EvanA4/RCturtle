import useWebSocket, { ReadyState } from 'react-use-websocket';
const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:5656');

export default lastMessage;