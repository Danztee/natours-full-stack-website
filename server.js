require("colors");
require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION🤯... shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

const connectDB = require("./config/connect");
const app = require("./app");

connectDB(process.env.MONGO_URI);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandled REJECTION🤯... shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
