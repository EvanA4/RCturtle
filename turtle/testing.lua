function SelectItem(targetName)
    for i = 1, 16, 1 do
        turtle.select(i);
        local slotData = turtle.getItemDetail();
        if (slotData) then
            if (slotData.name == targetName) then return end
        end
    end

    if targetName == 'computercraft:disk_drive' then
        print("Missing disk drive!")
        error()
    end
end

-- Place disk drive and write startup.lua
SelectItem('computercraft:disk_drive')
turtle.place()
SelectItem('computercraft:disk')
turtle.drop()
fs.copy('startup.lua', 'disk/startup.lua')

-- Place turtle
turtle.up()
SelectItem('computercraft:turtle_normal')
turtle.place()

-- Reboot new turtle
peripheral.call('front', 'turnOn')

-- Move back to station
turtle.down()
