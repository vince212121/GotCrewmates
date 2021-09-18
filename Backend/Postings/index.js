const express = require("express");
const { TransactionWraper } = require("../DatabaseUtil");
const { FindUsername } = require("./util");
// const { GetPosts } = require("./util");
const router = express.Router();

const POST_SQL_STATEMENT =
  "INSERT INTO gotcrewmates.postings (postCreator, title, postBody, numberOfSpots) VALUES ($1, $2, $3, $4);";

const DELETE_SQL_STATEMENT =
  //"DELETE FROM gotcrewmates.postings WHERE postID = $1;";
  // "WITH deleted AS (DELETE FROM gotcrewmates.postings WHERE postID = $1 IS TRUE RETURNING *) SELECT count(*) FROM deleted;"
  "DELETE FROM gotcrewmates.postings WHERE postID = $1 IS TRUE RETURNING *;";

// only of they are logged in, if they are not logged in they will get a 401 for now
// request.userid is user id
// request.username = username

// Getting posts from server
router.get("/posting", async (req, res) => {
  try {
    let postID;
    let pageNumber;
    let getSqlStatement = "SELECT * FROM gotcrewmates.postings";

    let additionalStatement = "";
    let queryParamenter = [];

    if (req.query.postID) {
      if (/^\d+$/.test(req.query.postID)) {
        postID = BigInt(req.query.postID);
        additionalStatement += " WHERE postID = $1";
        queryParamenter = [postID];
      } else {
        res.status(400).send(`Invalid postID`);
        return;
      }
    } else {
      pageNumber = parseInt(req.query.pageNumber);
      if (isNaN(pageNumber) || pageNumber <= 0) {
        res.status(400).send(`Invalid page number`);
        return;
      } else if (pageNumber >= 2) {
        additionalStatement += " OFFSET ($1 * 20) ROWS";
        queryParamenter = [pageNumber];
      }
    }

    TransactionWraper((client) =>
      client.query(getSqlStatement + additionalStatement + ";", queryParamenter)
    )
      .then(async (result) => {
        if (!postID || result.rows.length === 1) {
          res.status(200).send(result.rows);
        } else res.sendStatus(400);
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

//****  Need to fix error with invalid user id giving an UnhandledPromiseRejectionWarning
// Posting data to server
router.post("/posting", async (req, res) => {
  // gather the data from req
  try {
    const postCreator = req.userID;
    const { title, postBody } = req.body;
    const numberOfSpots = parseInt(req.body.numberOfSpots);

    if (!postCreator) {
      console.log("Oh shit something catastrophic happened");
      return;
    }

    if (!title) {
      res.status(400).send(`Invalid title`);
      return;
    }

    if (!postBody) {
      res.status(400).send(`Invalid post body`);
      return;
    }

    if (isNaN(numberOfSpots) || numberOfSpots <= 0) {
      res.status(400).send(`Invalid number of spots`);
      return;
    }

    TransactionWraper((client) =>
      client.query(POST_SQL_STATEMENT, [
        postCreator,
        title,
        postBody,
        numberOfSpots,
      ])
    )
      .then(() => {
        res.sendStatus(201);
      })
      .catch((e) => {
        // Catch invalid user
        if (e.code === "23503") {
          res.status(400).send("Invalid user");
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

// deleting post from server
router.delete("/posting", async (req, res) => {
  try {
    let postID;

    if (/^\d+$/.test(req.body.postID)) {
      postID = BigInt(req.body.postID);
    } else {
      res.status(400).send(`Invalid PostID`);
      return;
    }

    TransactionWraper((client) => client.query(DELETE_SQL_STATEMENT, [postID]))
      .then((result) => {
        // res.sendStatus(201);
        console.log("row: " + result.rows.length);
        console.log("count " + result.rows);
        console.log("statement: " + DELETE_SQL_STATEMENT + " query: " + postID);
        if (result.rows.length === 1) {
          // res.status(201).send("Post deleted");
          res.status(201).send(result.rows);
        } else {
          res.status(400).send("Invalid post");
          return;
        }
      })
      .catch((e) => {
        // Catch invalid post
        if (e.code === "23503") {
          res.status(400).send("Invalid postID");
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

module.exports = router;
