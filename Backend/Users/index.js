const express = require("express");
const { TransactionWraper } = require("../DatabaseUtil");

const router = express.Router();

const JOIN_POSTING_SQL_STATEMENT =
  "SELECT u.username, p.postid, p.title, p.postcreator, p.postbody, p.numberofspots, p.status FROM gotcrewmates.users u JOIN gotcrewmates.groups g ON u.userid = g.userid JOIN gotcrewmates.postings p ON p.postID = g.postID WHERE u.username = $1;";

router.get("/user", async (req, res) => {
  try {
    const { username } = req.query;
    TransactionWraper((client) =>
      client.query(JOIN_POSTING_SQL_STATEMENT, [username])
    )
      .then((result) => {
        if (result.rows.length === 1) res.status(200).send(result.rows[0]);
        else if (result.rows.legnth > 1)
          res.status(500).send("Multiple users found");
        else
          res
            .status(400)
            .send(
              "User has no postings or doesn't exist (this should not happen [only first one])"
            );
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
