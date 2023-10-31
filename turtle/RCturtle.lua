WS = assert(http.websocket("ws://localhost:5656"))
RelPos = { 0, 0, 0 }
Direction = "North" -- East is +x, South +z

function SelectItem(targetName)
    for i = 1, 16, 1 do
        turtle.select(i);
        local slotData = turtle.getItemDetail();
        if (slotData) then
            if (slotData.name == targetName) then return true end
        end
    end

    return false
end

function UpdateRelPos(action)
    -- divide by action type
    if action == 0 then
        -- 0 is forward
        if (Direction == "North") then
            RelPos[3] = RelPos[3] - 1
        elseif (Direction == "East") then
            RelPos[1] = RelPos[1] + 1
        elseif (Direction == "South") then
            RelPos[3] = RelPos[3] + 1
        else
            RelPos[1] = RelPos[1] - 1
        end
    elseif action == 1 then
        -- 1 is back
        if (Direction == "North") then
            RelPos[3] = RelPos[3] + 1
        elseif (Direction == "East") then
            RelPos[1] = RelPos[1] - 1
        elseif (Direction == "South") then
            RelPos[3] = RelPos[3] - 1
        else
            RelPos[1] = RelPos[1] + 1
        end
    elseif action == 2 then
        -- 2 is up
        RelPos[2] = RelPos[2] + 1
    elseif action == 3 then
        -- 3 is down
        RelPos[2] = RelPos[2] - 1
    elseif action == 4 then
        -- 4 is turnLeft
        if (Direction == "North") then
            Direction = "West"
        elseif (Direction == "East") then
            Direction = "North"
        elseif (Direction == "South") then
            Direction = "East"
        else
            Direction = "South"
        end
    else
        -- 5 is turnRight
        if (Direction == "North") then
            Direction = "East"
        elseif (Direction == "East") then
            Direction = "South"
        elseif (Direction == "South") then
            Direction = "West"
        else
            Direction = "North"
        end
    end
end

function SendTurtleData()
    local outJSON = "{"

    -- Fuel
    outJSON = outJSON .. "\"Fuel\": \"" .. tostring(turtle.getFuelLevel()) .. "\", "

    -- ID
    outJSON = outJSON .. "\"ID\": \"" .. tostring(os.getComputerID()) .. "\", "

    -- Label
    local tempLbl = os.getComputerLabel()
    if (type(tempLbl) ~= "nil") then
        outJSON = outJSON .. "\"Label\": \"" .. os.getComputerLabel() .. "\", "
    else
        outJSON = outJSON .. "\"Label\": \"None\", "
    end

    -- Current Selected Slot
    outJSON = outJSON .. "\"Selected\": \"" .. tostring(turtle.getSelectedSlot()) .. "\", "

    -- Inventory
    for i = 1, 16, 1 do
        local slot = turtle.getItemDetail(i)
        if (type(slot) ~= "nil") then
            outJSON = outJSON .. "\"SlotName" .. tostring(i) .. "\": \"" .. slot.name .. "\", "
            outJSON = outJSON .. "\"SlotCount" .. tostring(i) .. "\": \"" .. slot.count .. "\""
        else
            outJSON = outJSON .. "\"SlotName" .. tostring(i) .. "\": \"\", "
            outJSON = outJSON .. "\"SlotCount" .. tostring(i) .. "\": \"\""
        end
        if (i ~= 16) then outJSON = outJSON .. ", " end
    end
    return outJSON .. "}"
end

function LookAround(dir)
    -- look up, down, left, and right
    local output = {}

    -- note ID and RelPos of turtle
    output["ID"] = tostring(os.getComputerID())
    output["RelPos"] = RelPos
    output["Direction"] = Direction
    WS.send(textutils.serialiseJSON(output))

    local isSolid, data, formattedBlockData

    -- up
    if (dir == "" or dir == "up") then
        isSolid, data = turtle.inspectUp()
        formattedBlockData = {}

        formattedBlockData["isSolid"] = isSolid
        formattedBlockData["name"] = data.name
        if data.name == "computercraft:turtle_normal" then
            formattedBlockData["isSolid"] = false
        end

        output["up"] = formattedBlockData
        WS.send(textutils.serialiseJSON(output))
        output["up"] = nil
    end

    -- down
    if (dir == "" or dir == "down") then
        isSolid, data = turtle.inspectDown()
        formattedBlockData = {}

        formattedBlockData["isSolid"] = isSolid
        formattedBlockData["name"] = data.name
        if data.name == "computercraft:turtle_normal" then
            formattedBlockData["isSolid"] = false
        end

        output["down"] = formattedBlockData
        WS.send(textutils.serialiseJSON(output))
        output["down"] = nil
    end

    -- left
    if (dir == "" or dir == "left") then
        turtle.turnLeft()

        UpdateRelPos(4)
        isSolid, data = turtle.inspect()
        formattedBlockData = {}

        formattedBlockData["isSolid"] = isSolid
        formattedBlockData["name"] = data.name
        if data.name == "computercraft:turtle_normal" then
            formattedBlockData["isSolid"] = false
        end

        output["Direction"] = Direction
        output["front"] = formattedBlockData
        WS.send(textutils.serialiseJSON(output))
        output["front"] = nil
        turtle.turnRight()
        UpdateRelPos(5)
    end

    -- right
    if (dir == "" or dir == "right") then
        turtle.turnRight()
        isSolid, data = turtle.inspect()
        formattedBlockData = {}

        UpdateRelPos(5)
        formattedBlockData["isSolid"] = isSolid
        formattedBlockData["name"] = data.name
        if data.name == "computercraft:turtle_normal" then
            formattedBlockData["isSolid"] = false
        end

        output["Direction"] = Direction
        output["front"] = formattedBlockData
        WS.send(textutils.serialiseJSON(output))
        output["front"] = nil
        turtle.turnLeft()
        UpdateRelPos(4)
    end

    -- front
    if (dir == "" or dir == "front") then
        isSolid, data = turtle.inspect()
        formattedBlockData = {}

        formattedBlockData["isSolid"] = isSolid
        formattedBlockData["name"] = data.name
        if data.name == "computercraft:turtle_normal" then
            formattedBlockData["isSolid"] = false
        end

        output["Direction"] = Direction
        output["front"] = formattedBlockData
        WS.send(textutils.serialiseJSON(output))
        output["front"] = nil
    end
end

function HandleCommand(msgJSON)
    local function craft(args)
        return turtle.craft(tonumber(args["limit"]))
    end

    local function forward(args)
        local output = turtle.forward()
        if (output == true) then UpdateRelPos(0) end
        LookAround("")
        return output
    end

    local function back(args)
        local output = turtle.back()
        if (output == true) then UpdateRelPos(1) end
        LookAround("")
        return output
    end

    local function up(args)
        local output = turtle.up()
        if (output == true) then UpdateRelPos(2) end
        LookAround("")
        return output
    end

    local function down(args)
        local output = turtle.down()
        if (output == true) then UpdateRelPos(3) end
        LookAround("")
        return output
    end

    local function turnLeft(args)
        UpdateRelPos(4)
        local output = {}
        output["ID"] = tostring(os.getComputerID())
        output["RelPos"] = RelPos
        output["Direction"] = Direction
        WS.send(textutils.serialiseJSON(output))
        return turtle.turnLeft()
    end

    local function turnRight(args)
        UpdateRelPos(5)
        local output = {}
        output["ID"] = tostring(os.getComputerID())
        output["RelPos"] = RelPos
        output["Direction"] = Direction
        WS.send(textutils.serialiseJSON(output))
        return turtle.turnRight()
    end

    local function dig(args)
        if type(args["side"]) == "nil" then
            local boolout = turtle.dig()
            if boolout == true then LookAround("front") end
            return boolout
        else
            return turtle.dig(args["side"])
        end
    end

    local function digUp(args)
        if type(args["side"]) == "nil" then
            local boolout = turtle.digUp()
            if boolout == true then LookAround("up") end
            return boolout
        else
            return turtle.digUp(args["side"])
        end
    end

    local function digDown(args)
        if type(args["side"]) == "nil" then
            local boolout = turtle.digDown()
            if boolout == true then LookAround("down") end
            return boolout
        else
            return turtle.digDown(args["side"])
        end
    end

    local function place(args)
        if type(args["text"]) == "nil" then
            local boolout = turtle.place()
            if boolout == true then LookAround("front") end
            return boolout
        else
            return turtle.place(args["text"])
        end
    end

    local function placeUp(args)
        if type(args["text"]) == "nil" then
            local boolout = turtle.placeUp()
            if boolout == true then LookAround("up") end
            return boolout
        else
            return turtle.placeUp(args["text"])
        end
    end

    local function placeDown(args)
        if type(args["text"]) == "nil" then
            local boolout = turtle.placeDown()
            if boolout == true then LookAround("down") end
            return boolout
        else
            return turtle.placeDown(args["text"])
        end
    end

    local function drop(args)
        return turtle.drop(tonumber(args["count"]))
    end

    local function dropUp(args)
        return turtle.dropUp(tonumber(args["count"]))
    end

    local function dropDown(args)
        return turtle.dropDown(tonumber(args["count"]))
    end

    local function select(args)
        return turtle.select(tonumber(args["slot"]))
    end

    local function getItemCount(args)
        if type(args["slot"]) == "nil" then
            return turtle.getItemCount()
        else
            return turtle.getItemCount(tonumber(args["slot"]))
        end
    end

    local function getItemSpace(args)
        if type(args["slot"]) == "nil" then
            return turtle.getItemSpace()
        else
            return turtle.getItemSpace(tonumber(args["slot"]))
        end
    end

    local function detect(args)
        return turtle.detect()
    end

    local function detectUp(args)
        return turtle.detectUp()
    end

    local function detectDown(args)
        return turtle.detectDown()
    end

    local function compare(args)
        return turtle.compare()
    end

    local function compareUp(args)
        return turtle.compareUp()
    end

    local function compareDown(args)
        return turtle.compareDown()
    end

    local function attack(args)
        return turtle.attack(args["side"])
    end

    local function attackUp(args)
        return turtle.attackUp(args["side"])
    end

    local function attackDown(args)
        return turtle.attackDown(args["side"])
    end

    local function suck(args)
        return turtle.suck(tonumber(args["count"]))
    end

    local function suckUp(args)
        return turtle.suckUp(tonumber(args["count"]))
    end

    local function suckDown(args)
        return turtle.suckDown(tonumber(args["count"]))
    end

    local function getFuelLevel(args)
        return turtle.getFuelLevel()
    end

    local function refuel(args)
        if type(args["count"]) == "nil" then
            return turtle.refuel()
        else
            return turtle.refuel(tonumber(args["count"]))
        end
    end

    local function compareTo(args)
        return turtle.compareTo(tonumber(args["slot"]))
    end

    local function transferTo(args)
        return turtle.transferTo(tonumber(args["slot"]), tonumber(args["count"]))
    end

    local function getSelectedSlot(args)
        return turtle.getSelectedSlot()
    end

    local function getFuelLimit(args)
        return turtle.getFuelLimit()
    end

    local function equipLeft(args)
        return turtle.equipLeft()
    end

    local function equipRight(args)
        return turtle.equipRight()
    end

    local function inspect(args)
        local isSolid, data = turtle.inspect()
        local output = {}

        output["isSolid"] = isSolid
        output["name"] = data.name

        return textutils.serialiseJSON(output)
    end

    local function inspectUp(args)
        local isSolid, data = turtle.inspectUp()
        local output = {}

        output["isSolid"] = isSolid
        output["name"] = data.name

        return textutils.serialiseJSON(output)
    end

    local function inspectDown(args)
        local isSolid, data = turtle.inspectDown()
        local output = {}

        output["isSolid"] = isSolid
        output["name"] = data.name

        return textutils.serialiseJSON(output)
    end

    local function getItemDetail(args)
        local data

        if type(args["slot"]) == "nil" then
            data = turtle.getItemDetail()
        else
            data = turtle.getItemDetail(tonumber(args["slot"]))
        end

        return textutils.serialiseJSON(data)
    end

    local function setComputerLabel(args)
        os.setComputerLabel(args["label"])
        return true
    end

    local function swapTurtle(args)
        -- return either turtle data or "deactivate"
        if (tostring(os.getComputerID()) == args["newID"]) then
            -- return turtle data
            return SendTurtleData()
        else
            return "deactivate"
        end
    end

    local function mine(args)
        -- args["count"] = how many blocks to mine
        -- will look at both sides and return block data
        local length = tostring(args["count"])
        for i = 1, length, 1 do
            if (turtle.detect() == true) then turtle.dig() end
            turtle.forward()
            UpdateRelPos(0)
            LookAround("")
        end
        LookAround("forward")
        return true
    end

    local function message(args)
        -- args["text"] = text on sign
        if (args["text"] == "") then return false end
        for i = 1, 16, 1 do
            turtle.select(i)
            local slot = turtle.getItemDetail()
            if (type(slot) ~= "nil") then
                if (slot.name == "minecraft:oak_sign" or
                        slot.name == "minecraft:spruce_sign" or
                        slot.name == "minecraft:birch_sign" or
                        slot.name == "minecraft:jungle_sign" or
                        slot.name == "minecraft:acacia_sign" or
                        slot.name == "minecraft:dark_oak_sign" or
                        slot.name == "minecraft:mangrove_sign" or
                        slot.name == "minecraft:cherry_sign" or
                        slot.name == "minecraft:bamboo_sign" or
                        slot.name == "minecraft:crimson_sign" or
                        slot.name == "minecraft:warped_sign") then
                    turtle.place(args["text"])
                    return true
                end
            end
        end

        return false
    end

    -- mitosis credit to https://www.youtube.com/watch?v=MXYZufNQtdQ
    local function mitosis(args)
        -- Check for necessary items
        if not SelectItem('computercraft:disk_drive') then return false end
        if not SelectItem('computercraft:disk') then return false end
        if not SelectItem('computercraft:turtle_normal') then return false end
        if (not SelectItem('minecraft:coal')) and (not SelectItem('minecraft:charcoal')) then return false end

        -- Turn North
        while (Direction ~= "North") do
            turtle.turnLeft()
            UpdateRelPos(4)
            local output = {}
            output["ID"] = tostring(os.getComputerID())
            output["RelPos"] = RelPos
            output["Direction"] = Direction
            WS.send(textutils.serialiseJSON(output))
        end


        -- Place disk drive and write startup.lua
        SelectItem('computercraft:disk_drive')
        turtle.place()
        SelectItem('computercraft:disk')
        turtle.drop()
        if not fs.exists('disk/startup.lua') then
            fs.copy('startup.lua', 'disk/startup.lua')
        end

        -- Place turtle
        turtle.up()
        SelectItem('computercraft:turtle_normal')
        turtle.place()

        -- Add coal or charcoal
        if (SelectItem('minecraft:coal')) then
            turtle.drop(64)
        else
            SelectItem('minecraft:charcoal')
            turtle.drop(64)
        end

        -- Preface new turtle's relPos and reboot new turtle
        UpdateRelPos(2)
        UpdateRelPos(0)
        local temp = {}
        temp["newRelPos"] = RelPos
        temp["ID"] = tostring(os.getComputerID())
        WS.send(textutils.serialiseJSON(temp))
        UpdateRelPos(1)
        UpdateRelPos(3)
        local newTurtle
        while (type(newTurtle) == "nil") do
            newTurtle = peripheral.wrap("front")
        end
        newTurtle.turnOn()

        -- Move back to station
        turtle.down()

        return true
    end

    local cmds = {
        ["craft"] = craft,
        ["forward"] = forward,
        ["back"] = back,
        ["up"] = up,
        ["down"] = down,
        ["turnLeft"] = turnLeft,
        ["turnRight"] = turnRight,
        ["dig"] = dig,
        ["digUp"] = digUp,
        ["digDown"] = digDown,
        ["place"] = place,
        ["placeUp"] = placeUp,
        ["drop"] = drop,
        ["placeDown"] = placeDown,
        ["dropUp"] = dropUp,
        ["dropDown"] = dropDown,
        ["select"] = select,
        ["getItemCount"] = getItemCount,
        ["getItemSpace"] = getItemSpace,
        ["detect"] = detect,
        ["detectUp"] = detectUp,
        ["detectDown"] = detectDown,
        ["compare"] = compare,
        ["compareUp"] = compareUp,
        ["compareDown"] = compareDown,
        ["attack"] = attack,
        ["attackUp"] = attackUp,
        ["attackDown"] = attackDown,
        ["suck"] = suck,
        ["suckUp"] = suckUp,
        ["suckDown"] = suckDown,
        ["getFuelLevel"] = getFuelLevel,
        ["refuel"] = refuel,
        ["compareTo"] = compareTo,
        ["transferTo"] = transferTo,
        ["getSelectedSlot"] = getSelectedSlot,
        ["getFuelLimit"] = getFuelLimit,
        ["equipLeft"] = equipLeft,
        ["equipRight"] = equipRight,
        ["inspect"] = inspect,
        ["inspectUp"] = inspectUp,
        ["inspectDown"] = inspectDown,
        ["getItemDetail"] = getItemDetail,
        ["setComputerLabel"] = setComputerLabel,
        ["swapTurtle"] = swapTurtle,
        ["mine"] = mine,
        ["message"] = message,
        ["mitosis"] = mitosis
    }

    if (type(msgJSON) ~= "table") then
        return "notACommand"
    elseif msgJSON["command"] == "exit" then
        return "exit"
    elseif type(cmds[msgJSON["command"]]) == "nil" then
        return "notACommand"
    else
        return cmds[msgJSON["command"]](msgJSON)
    end
end

function Main()
    -- if disk drive below, copy starup.lua and mine disk drive
    local isSolid, data = turtle.inspectDown()
    if (isSolid) then
        if (data.name == "computercraft:disk_drive") then
            fs.copy('disk/startup.lua', 'startup.lua')
            turtle.suckDown()
            turtle.digDown()
        end
    end

    -- burn anything combustable in inventory
    for i = 1, 16, 1 do
        turtle.select(i)
        if (turtle.refuel(0)) then turtle.refuel(64) end
    end

    -- automatically swap to this ID
    WS.send("{\"newID\": \"" .. tostring(os.getComputerID()) .. "\"}")

    local isActve = false
    while true do
        local input = WS.receive()

        -- {"command": "functionName", ...}
        -- other args included as necessary
        local msgJSON = textutils.unserialiseJSON(input)

        -- either active or deactive and swapTurtle
        local isSwapCmd = false
        if (type(msgJSON) == "table") then
            if (msgJSON["command"] == "swapTurtle") then
                isSwapCmd = true
            end
        end
        if (isActve == true or (isActve == false and isSwapCmd == true)) then
            local output = HandleCommand(msgJSON)

            -- handle for transition between turtles
            if (output == "exit") then
                break
            elseif (output == "deactivate") then
                print("deactivating")
                isActve = false
            elseif (type(output) == "string") then
                if (string.sub(output, 1, 7) == "{\"Fuel\"") then
                    print("activating")
                    isActve = true
                    LookAround("")
                end
            end

            -- if active turtle did a command, send new data
            if (isActve == true) then
                if (type(msgJSON) == "table") then
                    if (type(msgJSON["command"]) ~= "nil") then
                        if (msgJSON["command"] ~= "swapTurtle" and msgJSON["command"] ~= "mitosis") then
                            local temp = SendTurtleData()
                            WS.send(temp)
                        end
                    end
                end
            end

            if (isActve == true and type(output) ~= "boolean") then
                if (output ~= "notACommand") then
                    WS.send(output)
                end
            end
        end
    end

    WS.close()
end

Main()
