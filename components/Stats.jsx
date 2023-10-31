import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';


import './styles/Stats.css'

const Stats = () => {
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:5656', { share: true });
    const [messageHistory, setMessageHistory] = useState([]);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage, setMessageHistory]);

    const sendCmd = useCallback((command) => {
        sendMessage(command)
    }, []);

    const slotBackground = (slotNum, selectedSlot) => {
        if (slotNum === selectedSlot) {
            return "rgb(29, 51, 29)";
        }
        else {
            return "rgb(29, 29, 29)";
        }
    }

    // Current turtle data
    const [fuelLvl, setFuel] = useState('None');
    const [currentID, setCurrentID] = useState('None');
    const [currentLbl, setCurrentLbl] = useState('None');
    const [selectedSlot, setSelected] = useState(0);
    const [slotNames, setSlotNames] = useState(Array(16).fill(""));
    const [slotCounts, setSlotCounts] = useState(Array(16).fill(""));

    // Listen for new inputs
    useEffect(() => {
        if (lastMessage !== null) {
            const input = JSON.parse(lastMessage.data);

            // Detect if new turtle connects
            if (input['newID'] !== undefined && Object.keys(input).length === 1) {
                sendCmd("{\"command\": \"swapTurtle\", \"newID\": \"" + input['newID'] + "\"}");
            }

            // Check for new turtle data
            if (input["Fuel"] !== undefined) {
                // There's new turtle data!
                setFuel(input["Fuel"]);
                setCurrentID(input["ID"]);
                setCurrentLbl(input["Label"]);
                setSelected(parseInt(input["Selected"]));

                let newNames = Array(16).fill("");
                let newCounts = Array(16).fill("");
                for (let i = 1; i <= 16; ++i) {
                    let key = "SlotName" + i;
                    newNames[i - 1] = input[key];
                    key = "SlotCount" + i;
                    newCounts[i - 1] = input[key];
                }
                setSlotNames(newNames);
                setSlotCounts(newCounts);
            }

            // Check if turtle disconnected
            if (input["command"] === "exit") {
                setFuel('None');
                setCurrentID('None');
                setCurrentLbl('None');
                setSelected(0);
                setSlotNames(Array(16).fill(""));
                setSlotCounts(Array(16).fill(""));
            }
        }
    }, [lastMessage]);

    return (
        <div className='statistics'>
            <div className='inv'>
                <div style={{ backgroundColor: slotBackground(1, selectedSlot) }} className='slot' title={slotNames[0]}><p>{slotCounts[0]}</p></div>
                <div style={{ backgroundColor: slotBackground(2, selectedSlot) }} className='slot' title={slotNames[1]}><p>{slotCounts[1]}</p></div>
                <div style={{ backgroundColor: slotBackground(3, selectedSlot) }} className='slot' title={slotNames[2]}><p>{slotCounts[2]}</p></div>
                <div style={{ backgroundColor: slotBackground(4, selectedSlot) }} className='slot' title={slotNames[3]}><p>{slotCounts[3]}</p></div>
                <div style={{ backgroundColor: slotBackground(5, selectedSlot) }} className='slot' title={slotNames[4]}><p>{slotCounts[4]}</p></div>
                <div style={{ backgroundColor: slotBackground(6, selectedSlot) }} className='slot' title={slotNames[5]}><p>{slotCounts[5]}</p></div>
                <div style={{ backgroundColor: slotBackground(7, selectedSlot) }} className='slot' title={slotNames[6]}><p>{slotCounts[6]}</p></div>
                <div style={{ backgroundColor: slotBackground(8, selectedSlot) }} className='slot' title={slotNames[7]}><p>{slotCounts[7]}</p></div>
                <div style={{ backgroundColor: slotBackground(9, selectedSlot) }} className='slot' title={slotNames[8]}><p>{slotCounts[8]}</p></div>
                <div style={{ backgroundColor: slotBackground(10, selectedSlot) }} className='slot' title={slotNames[9]}><p>{slotCounts[9]}</p></div>
                <div style={{ backgroundColor: slotBackground(11, selectedSlot) }} className='slot' title={slotNames[10]}><p>{slotCounts[10]}</p></div>
                <div style={{ backgroundColor: slotBackground(12, selectedSlot) }} className='slot' title={slotNames[11]}><p>{slotCounts[11]}</p></div>
                <div style={{ backgroundColor: slotBackground(13, selectedSlot) }} className='slot' title={slotNames[12]}><p>{slotCounts[12]}</p></div>
                <div style={{ backgroundColor: slotBackground(14, selectedSlot) }} className='slot' title={slotNames[13]}><p>{slotCounts[13]}</p></div>
                <div style={{ backgroundColor: slotBackground(15, selectedSlot) }} className='slot' title={slotNames[14]}><p>{slotCounts[14]}</p></div>
                <div style={{ backgroundColor: slotBackground(16, selectedSlot) }} className='slot' title={slotNames[15]}><p>{slotCounts[15]}</p></div>
            </div>
            <div className='textstats'>
                <p>Fuel Level: {fuelLvl}</p>
                <p>Current ID: {currentID}</p>
                <p id='cpuLabel'>Label: <b>{currentLbl}</b></p>
            </div>
        </div>
    );
}

export default Stats;