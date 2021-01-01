const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const mongoose = require("mongoose");
const CoinSchema = require("./models/coin");
const mainRouter = require("./router/route");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const url = `mongodb+srv://pbadmin:Sa9987333@historicaldata.f6qt0.mongodb.net/historicaldata?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

cron.schedule("* * * * *", async () => {
  const response = await axios.get("https://api2.pocketbits.in/api/v1/ticker");
  if (response) {
    // console.log(response);
    for (let coin of response.data) {
      //   console.log(coin);
      const coinObject = new CoinSchema({
        name: coin.symbol,
        buy: coin.buy,
        time: +coin.at,
      });
      try {
        const main = await coinObject.save();
      } catch (err) {
        console.log(err);
      }
    }
  }
});

con.on("open", () => {
  console.log("connected");
});

// app.all((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.header(
//     "Access-Control-Allow-Origin",
//     "Origin, X-Requested-With, Content-type, Accept"
//   );
//   next();
// });

app.use("/coins", mainRouter);

app.listen(process.env.PORT || 9000, () => {
  console.log("Server started successfully on\n  http://localhost:9000");
});

// module.exports = app;
