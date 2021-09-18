const express = require("express");
const { TransactionWraper } = require("../DatabaseUtil");

const router = express.Router();

const SELECT_USER_ROW =
  "SELECT userid FROM gotcrewmates.users WHERE username=$1;";
const SELECT_USER_POSTINGS =
  "SELECT u.username,p.postid,p.title,p.postbody,p.numberofspots,p.status FROM gotcrewmates.users u JOIN gotcrewmates.postings p ON p.postcreator = u.userid WHERE u.userid = $1;";

const SELECT_USER_GROUPS =
  "SELECT u.username, p.postid, p.title, p.postcreator, p.postbody, p.numberofspots, p.status FROM gotcrewmates.users u JOIN gotcrewmates.groups g ON u.userid = g.userid JOIN gotcrewmates.postings p ON p.postID = g.postID WHERE u.userid = $1;";

router.get("/user", async (req, res) => {
  try {
    const { username } = req.query;
    const userIdPromise = TransactionWraper((client) =>
      client.query(SELECT_USER_ROW, [username])
    );
    userIdPromise.then(async (result) => {
      if (result.rows.length !== 1) {
        res.status(400).send(`No user ${username} found`);
        return;
      } else {
        const userId = result.rows[0].userid;
        const userData = {};
        const promises = await TransactionWraper((client) => [
          client.query(SELECT_USER_POSTINGS, [userId]).then((result) => {
            userData.postings = result.rows;
          }),
          client.query(SELECT_USER_GROUPS, [userId]).then((result) => {
            userData.groups = result.rows;
          }),
        ]);
        Promise.all(promises).then(() => {
          res.status(200).send(userData);
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
module.exports = router;
