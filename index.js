if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const db_url = process.env.DB_URL;
const corsOptions = require("./config/cors_config");
const cors = require("cors");

const authRoute = require("./routes/auth");
const courseRoute = require("./routes/courses");
const reviewRoute = require("./routes/reviews");

mongoose.connect(db_url);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.use("/user", authRoute);
app.use("/course", courseRoute);
app.use("/review", reviewRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on port:${port}`);
});
