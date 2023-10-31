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
`cd RCturtle`

### 2. Add Websocket Server Dependencies
`cd server`<br>
`yarn add ws`<br>
`cd ..`

### 3. Create Vite Project and Add Dependencies
`yarn create vite client --template react`<br>
`mv -force src/* client/src`<br>
`cd client`<br>
`yarn add three @types/three @react-three/fiber @react-three/drei react-use-websocket`
