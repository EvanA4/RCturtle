const socket = require("ws");
var clients = [];
const wss = new socket.Server({ port: 5656 });

console.log('\n\n\n')

wss.on("connection", wsClient => {
  console.log("Something connected" + '\n\n');
  clients.push(wsClient);

  wsClient.on("message", messageData => {
    console.log("Received Message: " + messageData.toString() + '\n\n');

    clients.forEach(function (client) {
      client.send(messageData.toString());
    });

  });

  wsClient.on("close", () => {
    console.log("Something disconnected" + '\n\n');
  });
});