import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import './styles/Actions.css'

const Actions = () => {
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:5656', { share: true });
    const slotcount = React.useRef()

    const sendCmd = useCallback((command) => {
        if ((command.substr(23, 4) != 'slot' || command[31] != '\"')
            && (command.substr(22, 5) != 'limit' || command[31] != '\"')) sendMessage(command)
    }, []);

    return (
        <div className='actions'>
            <div className='suck'>
                <button className='above' id='ac'
                    onClick={() => { sendCmd('{\"command\": \"suckUp\", \"count\": \"' + slotcount.current.value + '\"}') }}>&#8593;</button>
                <button className='front' id='ac'
                    onClick={() => { sendCmd('{\"command\": \"suck\", \"count\": \"' + slotcount.current.value + '\"}') }}>SUCK</button>
                <button className='below' id='ac'
                    onClick={() => { sendCmd('{\"command\": \"suckDown\", \"count\": \"' + slotcount.current.value + '\"}') }}>&#8595;</button>
            </div>
            <div className='drop'>
                <button className='above' id='ac'
                    onClick={() => { sendCmd('{\"command\": \"dropUp\", \"count\": \"' + slotcount.current.value + '\"}') }}>&#8593;</button>
                <button className='front' id='ac'
                    onClick={() => { sendCmd('{\"command\": \"drop\", \"count\": \"' + slotcount.current.value + '\"}') }}>DROP</button>
                <button className='below' id='ac'
                    onClick={() => { sendCmd('{\"command\": \"dropDown\", \"count\": \"' + slotcount.current.value + '\"}') }}>&#8595;</button>
            </div>
            <button className='select'
                onClick={() => { sendCmd('{\"command\": \"craft\", \"limit\": \"' + slotcount.current.value + '\"}') }}>CRAFT</button>
            <button className='select'
                onClick={() => { sendCmd('{\"command\": \"select\", \"slot\": \"' + slotcount.current.value + '\"}') }}>SELECT</button>
            <input type='text' placeholder='Slot or count' ref={slotcount}></input>
        </div>
    );
}

export default Actions;