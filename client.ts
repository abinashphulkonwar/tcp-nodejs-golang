import { randomUUID } from "crypto";
import net from "net";

const client = net.connect(8080, "127.0.0.1", () => {
  console.log("connected to server!");
});

const isJSON = (str: string) => {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
};

client.write(JSON.stringify({ Type: "hiii", Data: "data", id: randomUUID() }));

client.on("data", (data) => {
  console.log(data.toString());
  const payload = data.toString();
  if (isJSON(payload)) {
    const { type, data } = JSON.parse(payload);
    if (type === "message") {
      console.log(data);
    }
  } else client.write(JSON.stringify({ Type: "msg", Data: "data" }));
});
client.on("close", () => {
  console.log("Connection closed");
});
client.on("error", (err) => {
  console.log("Connection error:", err.message);
});
client.on("end", () => {});
