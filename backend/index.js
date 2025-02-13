const express = require("express");
const app = express();

const { userverify } = require("./verify");
const z = require("zod");

const { User } = require("./db");
const router = require("./routes/index");
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use("/api/v1", router);


app.listen(5000, () => console.log("Server started on port 5000"));