# RCturtle
Use a local websocket server to remote control a CC: Tweaked Mining Crafty Turtle. Uses Vite, React, Yarn, Nodejs, and Lua for CC: Tweaked turtles.
<br>
<br>

## How It Works
A websocket is initially opened on a local port. Then, the web application is connected to detect any turtles which connect. The buttons within the web application send serialized JSONs of commands (necessary arguments are included) a turtle can execute. From there, the turtle will execute the command and respond with a serialized JSON. This JSON includes the fuel level, ID, label, and inventory.

When a turtle first connects, the turtle initializes its local coordinates as `[0, 0, 0]` and its direction as `North`. Whenever this turtle moves, it will note the direction it is facing and its new position relative to the initial local cordinates. When the web application recieves this information, it will add the turtle's local coordinates to the relative position the local coordinates have to the *true* `[0, 0, 0]`. This accounts for when turtles reproduce away from the true `[0, 0, 0]`.

When a turtle turns on, it automatically runs `startup.lua`, even if the program is located on a disk. So, turtle reproduction requires a disk drive and floppy disk for a new turtle to automatically connect to the websocket server and be controlled by the client.
<br><br>

> [!IMPORTANT]
> Ensure you have both NodeJS and Yarn installed. The instructions below assume you are using Windows, although Linux and macOS would require similar intructions. A desktop computer and monitor is recommended to avoid a vertical scrollbar in the web application.
<br>

## Instructions

### 1. Set Up Minecraft World
Create a Minecraft world with CC: Tweaked installed.<br>
Find your world in the `saves` directory of `.minecraft`<br>
Go into the `serverconfig` folder and open `computercraft-server.toml` in a text editor<br>
Find and delete the line which reads `action = "deny"` (around line 118 as of 1.20.1 10/31/2023)<br>

### 2. Clone Git Repository
Change into the directory you want the project folder in<br>
`git clone https://github.com/EvanA4/RCturtle.git`<br>
`cd RCturtle`<br>

### 3. Start WebSocket Server
`cd server`<br>
`yarn`<br>
`node server.js`<br>

### 4. Start Vite Server
Open a new terminal and change directories into `client` directory.<br>
`yarn`<br>
`yarn dev`<br>
Enter 'o' on the keyboard to start up the application<br>

### 6. Set Up Turtle
Open the same world in Minecraft and craft a Mining Crafty Turtle<br>
Place the turtle and right-click to open its terminal:<br>
`pastebin get GTLPXvb8 startup.lua`<br>
`reboot`<br>

