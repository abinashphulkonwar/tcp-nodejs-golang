import net from "net";

const sockets: { [key: string]: net.Socket } = {};

const server = net.createServer((socket) => {
  socket.write("hiiiiiiiii");
  console.log(socket.address(), socket.remoteAddress, socket.remotePort);
  const key = `${socket.remoteAddress}-${socket.remotePort}`;
  sockets[key] = socket;

  socket.on("data", (data) => {
    console.log(data.toString());

    Object.keys(sockets).forEach((key) => {
      if (sockets[key] === socket) return;
      const payload = { type: "message", data: data.toString(), key: key };
      sockets[key].write(JSON.stringify(payload));
    });
  });

  socket.on("close", () => {
    console.log("closed", socket.remoteAddress, socket.remotePort);
    delete sockets[key];
  });

  socket.on("error", () => {
    console.log("error", socket.remoteAddress, socket.remotePort);
  });
});
server.maxConnections = 1000;
console.log(server.maxConnections);

server.listen(3000);
