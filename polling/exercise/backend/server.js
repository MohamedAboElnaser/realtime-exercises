import express from "express";
import bodyParser from "body-parser";
import nanobuffer from "nanobuffer";
import morgan from "morgan";

// set up a limited array
const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

// feel free to take out, this just seeds the server with at least one message
msg.push({
  user: "Mohamed",
  text: "Hola",
  time: Date.now(),
});

// get express ready to run
const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static("frontend"));

app.get("/poll", function (req, res) {
  // use getMsgs to get messages to send back
  // write code here
  res.json(getMsgs());
  // this will return an array of messages
});

app.post("/poll", function (req, res) {
  // add a new message to the server
  // write code here
  const { user, text } = req.body;
  if (user && text) {
    const newMsg = {
      user,
      text,
      time: Date.now(),
    };
    msg.push(newMsg);
    res.status(201).json(newMsg); // respond with the created message
  } else {
    res.status(400).json({ error: "User and text are required" });
  }
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`listening on http://localhost:${port}`);
