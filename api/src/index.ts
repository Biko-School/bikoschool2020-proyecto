import http from "http";
import { createApp } from "./app";
import Lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { DbSchema } from "./dbSchema";

const adapter = new FileSync<DbSchema>("../material/db.json");
const db = Lowdb(adapter);
const app = createApp(db);
app.set("port", port);

var server = http.createServer(app);
var port = process.env.PORT || "3000";
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
    case "EADDRINUSE":
      console.error(`Port ${port} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  console.log(`Listening on port ${port}`);
}
