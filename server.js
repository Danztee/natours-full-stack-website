require("colors");
require("dotenv").config();
const connectDB = require("./config/connect");
const app = require("./app");

connectDB(process.env.MONGO_URI);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
