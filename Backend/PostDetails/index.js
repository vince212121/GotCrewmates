const express = require("express");
const { TransactionWraper } = require("../DatabaseUtil");

const router = express.Router();

const GET_USERS_FROM_POSTS_SQL_STATEMENT =
  "SELECT u.userid, p.postid, u.username, p.title, p.postbody, p.status, p.numberofspots, p.datecreated FROM gotcrewmates.users u JOIN gotcrewmates.groups g ON u.userid = g.userid JOIN gotcrewmates.postings p ON p.postid = g.postid WHERE g.postID = $1;";

const POST_GROUPS_SQL_STATEMENT =
  "INSERT INTO gotcrewmates.groups (postID, userID) VALUES ($1, $2);";

const GET_NUM_GROUPS_SQL_STATEMENT =
  "SELECT * FROM gotcrewmates.groups WHERE postID = $1;";

const GET_POSTINGINFO_SQL_STATEMENT =
  "SELECT * FROM gotcrewmates.postings WHERE postID = $1;";

const UPDATE_POSTING_STATUS =
  "UPDATE gotcrewmates.postings SET Status = '3' WHERE postID = $1";

// gets the user list from a specific post
router.get("/userlist", async (req, res) => {
  try {
    let postID;

    if (req.query.postID) {
      if (/^\d+$/.test(req.query.postID)) {
        postID = BigInt(req.query.postID);
      } else {
        res.status(400).send(`Invalid postID`);
        return;
      }
    }

    TransactionWraper((client) =>
      client.query(GET_USERS_FROM_POSTS_SQL_STATEMENT, [postID])
    )
      .then((result) => {
        if (result.rows.length > 0) res.status(200).send(result.rows);
        else res.sendStatus(400);
      })
      .catch((e) => {
        res.sendStatus(500);
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

// POST to group table when a user joins the post
router.post("/postdetails", async (req, res) => {
  let postID;
  let userID;

  if (req.body.postID) {
    if (/^\d+$/.test(req.body.postID)) {
      postID = BigInt(req.body.postID);
    } else {
      res.status(400).send(`Invalid postID`);
      return;
    }
  }

  // Check if the user is already in the thing or not.
  if (req.body.userID) {
    if (/^\d+$/.test(req.body.userID)) {
      userID = BigInt(req.body.userID);
    } else {
      res.status(400).send(`Invalid userID`);
      return;
    }
  }

  // Change query back to body for the post
  TransactionWraper((client) =>
    //First check if its full yet.
    client.query(GET_POSTINGINFO_SQL_STATEMENT, [postID]).then((post) => {
      //Got the people within the group, now get
      if (post.rows.length === 1) {
        //This implies there is only one post per id its good.
        if (post.rows[0].status === "1") {
          //The posting is not full, else throw error.
          //now try to find the current people in it
          TransactionWraper((client) =>
            client
              .query(GET_NUM_GROUPS_SQL_STATEMENT, [postID])
              .then((people) => {
                if (people.rows.length < Number(post.rows[0].numberofspots)) {
                  // This implies that that its not full we can add them.
                  TransactionWraper((client) =>
                    client
                      .query(POST_GROUPS_SQL_STATEMENT, [postID, userID])
                      .then((final) =>
                        changeStatus(final, people, post, postID, res)
                      )
                  );
                } else {
                  //This means its now full, please close it.
                  if (post.rows[0].status == "1") {
                    TransactionWraper((client) =>
                      client
                        .query(UPDATE_POSTING_STATUS, [postID])
                        .then(res.status(200).send("Party full"))
                    );
                  } else {
                    res.status(400).send("Party full");
                    return;
                  }
                }
              })
          );
        }
      } else {
        return;
      }
    })
  );
});

const changeStatus = (final, people, post, postID, res) => {
  //if we got this far it works.
  res.status(200).send("Good");
  return;
};

module.exports = router;
