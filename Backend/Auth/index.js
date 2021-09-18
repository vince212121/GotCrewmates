const express = require("express");
const { TransactionWraper } = require("../DatabaseUtil");
const {
  HashPassword,
  GetUserRow,
  ComparePassword,
  CreateJWTs,
} = require("./util");

const router = express.Router();

const POST_SQL_STATEMENT =
  "INSERT INTO gotcrewmates.users (username, hash) VALUES ($1, $2)";

// Create a new user
router.post("/newuser", async (req, res) => {
  // Gether data from req
  try {
    const { username, password } = req.body;
    // Make sure request has required data
    if (!username || !password) {
      res
        .status(400)
        .send(`Missing ${username && "username"} ${password && "password"}`);
      return;
    }
    const hash = HashPassword(password);
    TransactionWraper((client) =>
      client.query(POST_SQL_STATEMENT, [username, hash])
    )
      .then(() => {
        res.sendStatus(201);
      })
      .catch((e) => {
        // Catch duplicate usernames here
        if (e.code === "23505") {
          res.status(400).send("Username already exists");
          return;
        }
        console.error(e);
        res.sendStatus(500);
      });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Login route
router.post("/session", async (req, res) => {
  // Request should have a username and password
  try {
    const { username, password } = req.body;
    // Make sure request has required data
    if (!username || !password) {
      res
        .status(400)
        .send(`Missing ${username && "username"} ${password && "passowrd"}`);
      return;
    }
    const row = await GetUserRow(username);
    if(!row){
      res.sendStatus(401);
      return;
    }
    const { hash, userid: userID } = row;
    const success = ComparePassword(password, hash);
    if (success) {
      const [accessToken, refreshToken] = CreateJWTs(userID, username);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });
      res.status(201).send(accessToken);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
