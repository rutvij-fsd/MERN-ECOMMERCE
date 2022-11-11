const app = require("./app");
const dotenv = require("dotenv");

const connectDatabase = require("./config/database");

//Handling Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Sutting down due to uncaught exception");
  process.exit(1);
});

// config
dotenv.config({ path: "backend/config/config.env" });

//Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Sutting down server due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
