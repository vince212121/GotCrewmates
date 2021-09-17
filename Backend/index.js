const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

// Custom routers
const authRouter = require("./Auth");

const PORT = process.env.PORT || 5000;

const main = () => {
  const apiLayer = express();
  // Allow cross-origin-resouce-sharing
  apiLayer.use(cors());
  // Data will be JSON
  apiLayer.use(express.json());
  // Something for parsing cookies
  apiLayer.use(cookieParser());

  // Health endpoint
  apiLayer.get("/health", (req, res) => res.sendStatus(200));
  apiLayer.use("/api", authRouter);

  apiLayer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};

main();