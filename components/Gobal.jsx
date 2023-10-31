import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import './styles/Global.css'

const Global = () => {
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:5656', { share: true });
    const signText = React.useRef()
    const swapID = React.useRef()
    const blocksToMine = React.useRef()
    const newLabel = React.useRef()

    const sendCmd = useCallback((command) => {
        if (command.substr(27, 5) != 'newID' || command[36] != '\"') sendMessage(command)
    }, []);

    return (
        <div className="global">
            <button className='gblbttn' id='mitosis'
                onClick={() => { sendCmd('{\"command\": \"mitosis\"}') }}>MITOSIS</button>
            <button className='gblbttn' id='disconnect'
                onClick={() => { sendCmd('{\"command\": \"exit\"}') }}>DISCONNECT</button>
            <div className='textsubmit'>
                <input type='text' placeholder='Message' ref={signText}></input>
                <button
                    onClick={() => { sendCmd('{\"command\": \"message\", \"text\": \"' + signText.current.value + '\"}') }}>TEXT</button>
            </div>
            <div className='textsubmit'>
                <input type='text' placeholder='Swap to ID' ref={swapID}></input>
                <button
                    onClick={() => { sendCmd('{\"command\": \"swapTurtle\", \"newID\": \"' + swapID.current.value + '\"}') }}>SWAP</button>
            </div>
            <div className='textsubmit'>
                <input type='text' placeholder='Blocks to mine' ref={blocksToMine}></input>
                <button
                    onClick={() => { sendCmd('{\"command\": \"mine\", \"count\": \"' + blocksToMine.current.value + '\"}') }}>MINE</button>
            </div>
            <div className='textsubmit'>
                <input type='text' placeholder='New name' ref={newLabel}></input>
                <button
                    onClick={() => { sendCmd('{\"command\": \"setComputerLabel\", \"label\": \"' + newLabel.current.value + '\"}') }}>RENAME</button>
            </div>
        </div>
    );
}

export default Global;