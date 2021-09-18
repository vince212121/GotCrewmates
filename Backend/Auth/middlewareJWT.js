const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("./secrets");

const OPEN_URLS = {
  "/api/session": ["POST"],
  "/api/user": ["POST", "GET"],
};

const JWTAuth = (req, res, next) => {
  try {
    const accessToken = req?.headers?.authorization?.split(" ")[1];
    if (!accessToken) {
      // Check if the path and the method should be open
      if (req.path in OPEN_URLS && OPEN_URLS[req.path].includes(req.method)) {
        next();
        return;
      }
      return res.status(400).send({ payload: "Bad request", success: false });
    }
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) throw err;
      req.userID = decoded.userID;
      req.username = decoded.username;
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(401);
  }
};

module.exports = JWTAuth;
