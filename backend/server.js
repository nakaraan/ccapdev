const connect = require("./connect")
const express = require("express");
const cors = require("cors");
const users = require("./userRoutes")
const reservations = require("./reservationRoutes")

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(users)
app.use(reservations)

app.listen(PORT, () => {
  connect.connectToServer();
  console.log(`Server is running on port ${PORT}`);
})
