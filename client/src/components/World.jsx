import React from "react"
import { useState, useCallback, useEffect } from "react"
import { Canvas, extend } from "@react-three/fiber"
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Box, OrbitControls, Edges, useGLTF } from "@react-three/drei"
extend({ Box, OrbitControls, Edges, useGLTF })

import './styles/World.css'

const CriticalBlocks = {
    "minecraft:diorite": true,
    "minecraft:granite": true,
    "minecraft:andesite": true,
    "minecraft:tuff": true,
    "minecraft:redstone_ore": true,
    "minecraft:deepslate_redstone_ore": true,
    "minecraft:iron_ore": true,
    "minecraft:deepslate_iron_ore": true,
    "minecraft:diamond_ore": true,
    "minecraft:deepslate_diamond_ore": true,
    "minecraft:coal_ore": true,
    "minecraft:deepslate_coal_ore": true,
    "minecraft:lapis_ore": true,
    "minecraft:deepslate_lapis_ore": true,
    "minecraft:sand": true,
    "minecraft:oak_log": true,
    "minecraft:spruce_log": true,
    "minecraft:birch_log": true,
    "minecraft:jungle_log": true,
    "minecraft:acacia_log": true,
    "minecraft:dark_oak_log": true,
    "minecraft:mangrove_log": true,
    "minecraft:cherry_log": true,
    "minecraft:crimson_stem": true,
    "minecraft:warped_stem": true,
    "minecraft:sugar_cane": true,
    "minecraft:dandelion": true,
    "minecraft:poppy": true,
    "minecraft:blue_orchid": true,
    "minecraft:allium": true,
    "minecraft:azure_bluet": true,
    "minecraft:red_tulip": true,
    "minecraft:orange_tulip": true,
    "minecraft:white_tulip": true,
    "minecraft:pink_tulip": true,
    "minecraft:oxeye_daisy": true,
    "minecraft:cornflower": true,
    "minecraft:lily_of_the_valley": true,
    "minecraft:sunflower": true,
    "minecraft:lilac": true,
    "minecraft:rose_bush": true,
    "minecraft:peony": true
}

function World() {
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:5656', { share: true });
    const [relPosBuf, setRelPosBuf] = useState([])
    const [relPosList, setRelPosList] = useState({});
    const [blocksOnCanvas, setBlocksOnCanvas] = useState([]);
    const [blockMap, setBlockMap] = useState({});
    const [activeCoords, setActiveCoords] = useState([.1, .1, .1]);
    const [newActive, setNewActive] = useState(false);
    const [currentBlock, setCurrentBlock] = useState("");
    const [turtlesOnCanvas, setTurtlesOnCanvas] = useState([]);

    useEffect(() => {
        if (newActive) {
            setNewActive(false);

            let temp = blocksOnCanvas;
            for (let i = 0; i < blocksOnCanvas.length; ++i) {
                if (temp[i]["props"]["position"] === activeCoords) {
                    temp[i] = <Block
                        position={temp[i]["props"]["position"]}
                        blocktype={temp[i]["props"]["blocktype"]}
                        isActive={true}
                    />;
                    setCurrentBlock(temp[i]["props"]["blocktype"]);
                }
                else if (temp[i]["props"]["isActive"] === true) {
                    temp[i] = <Block
                        position={temp[i]["props"]["position"]}
                        blocktype={temp[i]["props"]["blocktype"]}
                        isActive={false}
                    />;
                }
            }

            setBlocksOnCanvas(temp);
        }
    }, [blocksOnCanvas, setNewActive, newActive])

    const turtleDirection = (direction) => {
        if (direction === "North") return Math.PI;
        else if (direction === "East") return Math.PI / 2;
        else if (direction === "South") return 0;
        else if (direction === "West") return 3 * Math.PI / 2;
    }

    const Turtle = (props) => {
        // Credit to Ottomated for 3D model of normal turtle
        const { nodes, materials } = useGLTF('./src/components/models/otherturtle.glb')
        console.log(nodes, materials);
        return (
            <mesh {...props} onClick={(e) => {
                e.stopPropagation();
                setCurrentBlock("ID: " + props["idNum"]);
                setActiveCoords(props["position"]);
                setNewActive(true);
            }}>
                {/* <Box>
                    <meshStandardMaterial
                        color={"red"}
                        opacity={.3}
                        transparent={true}
                        depthTest={true}
                        side={2}
                    />
                    <Edges color={"white"} />
                </Box> */}
                <mesh
                    geometry={nodes.Cube001.geometry}
                    material={materials.Material}
                    position={[0, 0, -0.406]}></mesh>
            </mesh>
        )
    }

    const blockColor = (blocktype, isActive) => {
        if (CriticalBlocks[blocktype] === undefined) {
            if (isActive) return "lime";
            return "green";
        }
        else {
            if (isActive) return "rgb(0, 255, 255)";
            return "rgb(0, 0, 255)";
        }
    }

    const Block = (props) => {
        return (
            <mesh {...props} onClick={(e) => {
                e.stopPropagation();
                setActiveCoords(props["position"]);
                setNewActive(true);
            }}>
                <Box name="something">
                    <meshStandardMaterial
                        color={blockColor(props["blocktype"], props["isActive"])}
                        opacity={.3}
                        transparent={true}
                        depthTest={true}
                        side={2}
                    />
                    <Edges color={"white"} />
                </Box>
            </mesh>
        )
    }

    const removeBlock = (coords) => {
        for (let i = 0; i < blocksOnCanvas.length; ++i) {
            if (blocksOnCanvas[i]["props"]["position"][0] === coords[0] && blocksOnCanvas[i]["props"]["position"][1] === coords[1] && blocksOnCanvas[i]["props"]["position"][2] === coords[2]) {
                let temp = blocksOnCanvas;
                temp[i] = temp[temp.length - 1];
                temp.pop();
                setBlocksOnCanvas(temp);
            }
        }

        // remove key of blockMap
        delete blockMap[coords];
    }

    const changeTurtle = (ID, coords, direction) => {
        // iterate through until found ID
        let temp = turtlesOnCanvas;
        for (let i = 0; i < temp.length; ++i) {
            if (temp[i]["props"]["idNum"] === ID) {
                temp[i] = <Turtle
                    position={coords}
                    idNum={ID}
                    rotation-y={turtleDirection(direction)}
                />;
            }
        }

        // if block is where turtle is, remove block
        if (blockMap[coords] !== undefined) removeBlock(coords);

        setTurtlesOnCanvas(temp);
    }

    const addTurtle = (ID, coords) => {
        // Push a new turtle element onto the blocksOnCanvas state 
        setTurtlesOnCanvas(
            [
                ...turtlesOnCanvas,
                <Turtle
                    position={coords}
                    idNum={ID}
                    rotation-y={turtleDirection("North")}
                />
            ]
        );
    };

    const addBlock = (coords, blockName) => {
        // Push a new block element onto the blocksOnCanvas state 
        // check if block already present
        if (blockMap[coords] !== undefined) {
            console.log(blockMap[coords], blockName);
            if (blockMap[coords] === blockName) return;
            else {
                // update block if blockName has changed
                blockMap[coords] = blockName;

                let temp = blocksOnCanvas;
                for (let i = 0; i < blocksOnCanvas.length; ++i) {
                    console.log(temp[i]["props"]["position"], coords, temp[i]["props"]["position"][0] === coords[0] && temp[i]["props"]["position"][1] === coords[1] && temp[i]["props"]["position"][2] === coords[2]);
                    if (temp[i]["props"]["position"][0] === coords[0] && temp[i]["props"]["position"][1] === coords[1] && temp[i]["props"]["position"][2] === coords[2]) {
                        temp[i] = <Block
                            position={temp[i]["props"]["position"]}
                            blocktype={blockName}
                            isActive={temp[i]["props"]["isActive"]}
                        />;

                        if (temp[i]["props"]["isActive"]) setCurrentBlock(blockName);
                    }
                }
                setBlocksOnCanvas(temp);

                return;
            }
        }

        let temp = blockMap;
        temp[coords] = blockName; // blocksOnCanvas.length; // note initial index of block
        setBlockMap(temp);

        setBlocksOnCanvas(
            [
                ...blocksOnCanvas,
                <Block
                    position={coords}
                    blocktype={blockName}
                    isActive={false}
                />
            ]
        );
    };

    // Listen for new inputs
    useEffect(() => {
        if (lastMessage !== null) {
            const input = JSON.parse(lastMessage.data);

            // Detect if new turtle is about to connect
            if (input['newRelPos'] !== undefined) {
                let temp = [0, 0, 0];
                console.log(input['newRelPos'], relPosList[input['ID']])
                temp[0] = input['newRelPos'][0] + relPosList[input['ID']][0];
                temp[1] = input['newRelPos'][1] + relPosList[input['ID']][1];
                temp[2] = input['newRelPos'][2] + relPosList[input['ID']][2];
                setRelPosBuf(temp);
            }

            // Detect if new turtle connects
            if (input['newID'] !== undefined && Object.keys(input).length === 1) {
                if (relPosBuf.length === 0) {
                    let temp = {};
                    temp[input['newID']] = [0, 0, 0];
                    setRelPosList(Object.assign({}, temp, relPosList));
                    addTurtle(parseInt(input['newID']), [0, 0, 0])
                }
                else {
                    let temp = {};
                    temp[input['newID']] = relPosBuf;
                    setRelPosList(Object.assign({}, temp, relPosList));
                    addTurtle(parseInt(input['newID']), relPosBuf)
                }
            }

            // Check for moved turtle
            if (input['RelPos'] !== undefined && Object.keys(input).length === 3) {
                // find real position and update turtle position
                let actualPos = [0, 0, 0];
                actualPos[0] = (input['RelPos'][0] + relPosList[input['ID']][0]);
                actualPos[1] = (input['RelPos'][1] + relPosList[input['ID']][1]);
                actualPos[2] = (input['RelPos'][2] + relPosList[input['ID']][2]);
                changeTurtle(parseInt(input['ID']), actualPos, input['Direction']);
            }

            // Check for block data
            if (input['RelPos'] !== undefined && Object.keys(input).length !== 3) {
                // find real position and update turtle position
                let actualPos = [0, 0, 0];
                actualPos[0] = (input['RelPos'][0] + relPosList[input['ID']][0]);
                actualPos[1] = (input['RelPos'][1] + relPosList[input['ID']][1]);
                actualPos[2] = (input['RelPos'][2] + relPosList[input['ID']][2]);

                // update front, up, down, left, right
                if (input['front'] !== undefined) {
                    if (input['Direction'] === "North") {
                        changeTurtle(parseInt(input['ID']), actualPos, input['Direction']);
                        if (input['front']['isSolid'] === true)
                            addBlock([actualPos[0], actualPos[1], actualPos[2] - 1], input['front']['name']);
                        else
                            if (blockMap[[actualPos[0], actualPos[1], actualPos[2] - 1]] !== undefined) removeBlock([actualPos[0], actualPos[1], actualPos[2] - 1]);
                    }
                    else if (input['Direction'] === "East") {
                        changeTurtle(parseInt(input['ID']), actualPos, input['Direction']);
                        if (input['front']['isSolid'] === true)
                            addBlock([actualPos[0] + 1, actualPos[1], actualPos[2]], input['front']['name']);
                        else
                            if (blockMap[[actualPos[0] + 1, actualPos[1], actualPos[2]]] !== undefined) removeBlock([actualPos[0] + 1, actualPos[1], actualPos[2]]);
                    }
                    else if (input['Direction'] === "South") {
                        changeTurtle(parseInt(input['ID']), actualPos, input['Direction']);
                        if (input['front']['isSolid'] === true)
                            addBlock([actualPos[0], actualPos[1], actualPos[2] + 1], input['front']['name']);
                        else
                            if (blockMap[[actualPos[0], actualPos[1], actualPos[2] + 1]] !== undefined) removeBlock([actualPos[0], actualPos[1], actualPos[2] + 1]);
                    }
                    else {
                        changeTurtle(parseInt(input['ID']), actualPos, input['Direction']);
                        if (input['front']['isSolid'] === true)
                            addBlock([actualPos[0] - 1, actualPos[1], actualPos[2]], input['front']['name']);
                        else
                            if (blockMap[[actualPos[0] - 1, actualPos[1], actualPos[2]]] !== undefined) removeBlock([actualPos[0] - 1, actualPos[1], actualPos[2]]);
                    }
                }

                else if (input['up'] !== undefined) {
                    if (input['up']['isSolid'] === true)
                        addBlock([actualPos[0], actualPos[1] + 1, actualPos[2]], input['up']['name']);
                    else
                        if (blockMap[[actualPos[0], actualPos[1] + 1, actualPos[2]]] !== undefined) removeBlock([actualPos[0], actualPos[1] + 1, actualPos[2]]);
                }

                else if (input['down'] !== undefined) {
                    if (input['down']['isSolid'] === true)
                        addBlock([actualPos[0], actualPos[1] - 1, actualPos[2]], input['down']['name']);
                    else
                        if (blockMap[[actualPos[0], actualPos[1] - 1, actualPos[2]]] !== undefined) removeBlock([actualPos[0], actualPos[1] - 1, actualPos[2]]);
                }

                else if (input['left'] !== undefined) {
                    if (input['Direction'] === "North") {
                        if (input['left']['isSolid'] === true)
                            addBlock([actualPos[0] - 1, actualPos[1], actualPos[2]], input['left']['name']);
                        else
                            if (blockMap[[actualPos[0] - 1, actualPos[1], actualPos[2]]] !== undefined) removeBlock([actualPos[0] - 1, actualPos[1], actualPos[2]]);
                    }
                    else if (input['Direction'] === "East") {
                        if (input['left']['isSolid'] === true)
                            addBlock([actualPos[0], actualPos[1], actualPos[2] - 1], input['left']['name']);
                        else
                            if (blockMap[[actualPos[0], actualPos[1], actualPos[2] - 1]] !== undefined) removeBlock([actualPos[0], actualPos[1], actualPos[2] - 1]);
                    }
                    else if (input['Direction'] === "South") {
                        if (input['left']['isSolid'] === true)
                            addBlock([actualPos[0] + 1, actualPos[1], actualPos[2]], input['left']['name']);
                        else
                            if (blockMap[[actualPos[0] + 1, actualPos[1], actualPos[2]]] !== undefined) removeBlock([actualPos[0] + 1, actualPos[1], actualPos[2]]);
                    }
                    else {
                        if (input['left']['isSolid'] === true)
                            addBlock([actualPos[0], actualPos[1], actualPos[2] + 1], input['left']['name']);
                        else
                            if (blockMap[[actualPos[0], actualPos[1], actualPos[2] + 1]] !== undefined) removeBlock([actualPos[0], actualPos[1], actualPos[2] + 1]);
                    }
                }

                else if (input['right'] !== undefined) {
                    if (input['Direction'] === "North") {
                        if (input['right']['isSolid'] === true)
                            addBlock([actualPos[0] + 1, actualPos[1], actualPos[2]], input['right']['name']);
                        else
                            if (blockMap[[actualPos[0] + 1, actualPos[1], actualPos[2]]] !== undefined) removeBlock([actualPos[0] + 1, actualPos[1], actualPos[2]]);
                    }
                    else if (input['Direction'] === "East") {
                        if (input['right']['isSolid'] === true)
                            addBlock([actualPos[0], actualPos[1], actualPos[2] + 1], input['right']['name']);
                        else
                            if (blockMap[[actualPos[0], actualPos[1], actualPos[2] + 1]] !== undefined) removeBlock([actualPos[0], actualPos[1], actualPos[2] + 1]);
                    }
                    else if (input['Direction'] === "South") {
                        if (input['right']['isSolid'] === true)
                            addBlock([actualPos[0] - 1, actualPos[1], actualPos[2]], input['right']['name']);
                        else
                            if (blockMap[[actualPos[0] - 1, actualPos[1], actualPos[2]]] !== undefined) removeBlock([actualPos[0] - 1, actualPos[1], actualPos[2]]);
                    }
                    else {
                        if (input['right']['isSolid'] === true)
                            addBlock([actualPos[0], actualPos[1], actualPos[2] - 1], input['right']['name']);
                        else
                            if (blockMap[[actualPos[0], actualPos[1], actualPos[2] - 1]] !== undefined) removeBlock([actualPos[0], actualPos[1], actualPos[2] - 1]);
                    }
                }
            }
        }
    }, [lastMessage, setRelPosList]);

    // map of relative initial positions for each turtle by ID
    // -- relative to initial position of first ID

    // each block update will consist of
    // ID, relPos, blockName

    // actual position in 3d render is
    // relPos + relative initial position for ID

    return (
        <div style={{ height: "100%" }}>
            <Canvas
                style={{ background: "black" }}
                camera={{ fov: 75, position: [0, 0, -5] }}
            >
                <directionalLight position={[1000, 0, 0]} intensity={.5} />
                <directionalLight position={[0, 1000, 0]} intensity={1} />
                <directionalLight position={[0, 0, 1000]} intensity={.9} />
                <directionalLight position={[-1000, 0, 0]} intensity={.5} />
                <directionalLight position={[0, -1000, 0]} intensity={1} />
                <directionalLight position={[0, 0, -1000]} intensity={.9} />
                <OrbitControls enableDamping={false} />
                {[...turtlesOnCanvas]}
                {[...blocksOnCanvas]}
            </Canvas>
            <p>{currentBlock}</p>
        </div>
    )
}

export default World;
