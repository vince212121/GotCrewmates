const express = require("express");
const { Client } = require("pg");
const { TransactionWraper } = require("../DatabaseUtil");

const router = express.Router();

const JOIN_POSTING_SQL_STATEMENT =
  "SELECT u.username, p.postid, p.title, p.postcreator, p.postbody, p.numberofspots, p.status FROM gotcrewmates.users u JOIN gotcrewmates.groups g ON u.userid = g.userid JOIN gotcrewmates.postings p ON p.postID = g.postID WHERE u.username = $1;";

router.get("/user", async (req, res) => {
  try {
    const { username } = req.body;
    TransactionWraper((client) =>
    client.query(JOIN_POSTING_SQL_STATEMENT, [username])
    )
      .then((result) => {
        console.log("query: " + JOIN_POSTING_SQL_STATEMENT)
        console.log("param: " + username)
        console.log(result.rows.length)
        if (result.rows.length > 0)
          res.status(200).send(result.rows);
        
        else res.status(400).send("User has no postings or doesn't exist (this should not happen [only first one])");
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }

});
module.exports = router;
