const express = require("express");
const { TransactionWraper } = require("../DatabaseUtil");
// const { GetPosts } = require("./util");
const router = express.Router();

const POST_SQL_STATEMENT =
  "INSERT INTO gotcrewmates.postings (postCreator, title, postBody, numberOfSpots) VALUES ($1, $2, $3, $4);";

const DELETE_SQL_STATEMENT =
  "DELETE FROM gotcrewmates.postings WHERE postID = $1;";

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

    if (req.body.postID) {
      if (/^\d+$/.test(req.body.postID)) {
        postID = BigInt(req.body.postID);
        additionalStatement += " WHERE postID = $1";
        queryParamenter = [postID];
      } else {
        res.status(400).send(`Invalid postID`);
        return;
      }
    } else {
      pageNumber = parseInt(req.body.pageNumber);
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
      .then((result) => {
        if (!postID || result.rows.length === 1)
          res.status(200).send(result.rows);
        else res.sendStatus(400);
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
    let postCreator;
    const { title, postBody } = req.body;
    const numberOfSpots = parseInt(req.body.numberOfSpots);

    if (/^\d+$/.test(req.body.postCreator)) {
      postCreator = BigInt(req.body.postCreator);
    } else {
      res.status(400).send(`Missing ${postCreator && "post creator"}`);
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
      .then((result) => {
        if (result.rowCount == 1) {
          res.sendStatus(201);
        } else {
          res.sendStatus(400);
        }

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
        if (result.rowCount === 1) {
          res.status(201).send("Post deleted");
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
