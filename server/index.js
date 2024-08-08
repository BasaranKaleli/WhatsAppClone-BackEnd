const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // Eksik mongoose importu eklendi
const database = require("./config/database.js");
const Room = require("./routes/Room.js");
const Message = require("./routes/Message.js");
const Pusher = require("pusher"); // Eksik pusher importu eklendi

const pusher = new Pusher({
  appId: "1846502",
  key: "3f100950c26fcdc3b2c7",
  secret: "b59d619f38fba8a4035e",
  cluster: "eu",
  useTLS: true,
});

dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/", Room);
app.use("/", Message);

const PORT = 5000;

database(); // Bu, MongoDB bağlantısını başlatır

const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB bağlantısı sağlandı");

  const roomCollection = db.collection("rooms");
  const changeStream = roomCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const roomDetails = change.fullDocument;
      pusher.trigger("rooms", "inserted", roomDetails);
    } else {
      console.log("Trigger olayı gerçekleşmedi...");
    }
  });

  const msgCollection = db.collection("messages");
  const changeStream1 = msgCollection.watch();

  changeStream1.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", messageDetails);
    } else {
      console.log("Trigger olayı gerçekleşmedi...");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
