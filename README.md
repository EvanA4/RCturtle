# RCturtle
Use a local websocket server to remote control a CC: Tweaked Mining Crafty Turtle. Uses Vite, React, Yarn, Nodejs, and Lua for CC: Tweaked turtles.
<br>
<br>
## Instructions

> [!IMPORTANT]
> Ensure you have both NodeJS and Yarn installed.

### 1. Clone Git repository
Change into the directory you want the project folder in<br>
`git clone https://github.com/EvanA4/RCturtle.git`<br>
`cd RCturtle`<br>

### 2. Add Websocket Server Dependencies
`cd server`<br>
`yarn add ws`<br>
`cd ..`<br>

### 3. Create Vite Project and Add Dependencies
`yarn create vite client --template react`<br>
`mv -force src/* client/src`<br>
`rm src`<br>
`cd client`<br>
`yarn add three @types/three @react-three/fiber @react-three/drei react-use-websocket`<br>

### 4. Set Up Minecraft World
Create a Minecraft world with CC: Tweaked installed.<br>
Find your world in the `saves` directory of `.minecraft`<br>
Go into the `serverconfig` folder and open `computercraft-server.toml` in a text editor<br>
Find and delete the line which reads `action = "deny"` (around line 118 as of 1.20.1 10/31/2023)<br>

### 5. Run Client and Server
Create a new terminal in the main RCturtle folder:<br>
`cd server`<br>
`node server.js`<br>

In your original terminal:<br>
`yarn run dev`<br>
Hit 'o' on the keyboard to start up the application<br>


### 6. Set Up Turtle
Open the same world in Minecraft and craft a Mining Crafty Turtle<br>
Place the turtle and right-click to open its terminal:<br>
`pastebin get GTLPXvb8 startup.lua`<br>
`reboot`<br>

