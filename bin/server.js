const app = require("../app");
const { connectMongo } = require("../db/connections");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectMongo();
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.log(`error`, error);
    process.exit(1);
  }
};

start();
