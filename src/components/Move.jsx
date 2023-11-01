import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import './styles/Move.css';

const Move = () => {
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:5656', { share: true });

    const sendCmd = useCallback((command) => {
        sendMessage(command)
    }, []);

    return (
        <div className='move'>
            <div className='arrows'>
                <button className='arrrefuel'
                    onClick={() => { sendCmd("{\"command\": \"up\"}") }}>UP</button>
                <button className='arrrefuel'
                    onClick={() => { sendCmd("{\"command\": \"forward\"}") }}>FORWARD</button>
                <button className='arrrefuel'
                    onClick={() => { sendCmd("{\"command\": \"down\"}") }}>DOWN</button>
                <button className='arrrefuel'
                    onClick={() => { sendCmd("{\"command\": \"turnLeft\"}") }}>LEFT</button>
                <button className='arrrefuel'
                    onClick={() => { sendCmd("{\"command\": \"back\"}") }}>BACK</button>
                <button className='arrrefuel'
                    onClick={() => { sendCmd("{\"command\": \"turnRight\"}") }}>RIGHT</button>
            </div>
            <button className='refuel'
                onClick={() => { sendCmd("{\"command\": \"refuel\", \"count\": \"64\"}") }}>REFUEL</button>
            <div className='digplace'>
                <button className='above' id='mv'
                    onClick={() => { sendCmd("{\"command\": \"digUp\"}") }}>&#8593;</button>
                <button className='front' id='mv'
                    onClick={() => { sendCmd("{\"command\": \"dig\"}") }}>DIG</button>
                <button className='below' id='mv'
                    onClick={() => { sendCmd("{\"command\": \"digDown\"}") }}>&#8595;</button>
            </div>
            <div className='digplace'>
                <button className='above' id='mv'
                    onClick={() => { sendCmd("{\"command\": \"placeUp\"}") }}>&#8593;</button>
                <button className='front' id='mv'
                    onClick={() => { sendCmd("{\"command\": \"place\"}") }}>PLACE</button>
                <button className='below' id='mv'
                    onClick={() => { sendCmd("{\"command\": \"placeDown\"}") }}>&#8595;</button>
            </div>
            <div className='hand'>
                <button className='leftHand'
                    onClick={() => { sendCmd("{\"command\": \"equipLeft\"}") }}>EQUIP<br />LEFT</button>
                <button className='rightHand'
                    onClick={() => { sendCmd("{\"command\": \"equipRight\"}") }}>EQUIP<br />RIGHT</button>
            </div>
        </div>
    );
}

export default Move;
