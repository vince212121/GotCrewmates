const e = require("express");
const express = require("express");
const { Client } = require("pg");
const { TransactionWraper } = require("../DatabaseUtil");


const router = express.Router();

const GET_USER_SQL_STATEMENT = 
"SELECT * FROM gotcrewmates.user WHERE Username = $1" 
const GET_GROUPS_SQL_STATEMENT = 
"SELECT * FROM gotcrewmates.groups WHERE UserID = $1" 

const GET_POSTING_SQL_STATEMENT = 
"SELECT * FROM gotcrewmates.postings WHERE PostID = $1" 

//given the ID of a user, return a list of all groups and postings.
router.get("/user", (req, res) => {
    res.send('Hi!')
    try {
        console.log("HELLO")
        // Username object, if doesnt exist try. 
        const {username} = req.body;
        if (!username){
            //The username isnt in the db, 404 error. 
            res.status(404).send("Username doesnt exist")
            return 
        }
        // Username exists proceed.
        else{

            const info = Client.query(GET_USER_SQL_STATEMENT, [username])
            console.log(info)
            // check the info to see if its right:

            if (info.length > 1 | info.length === 0){
                //More than one UNIQUE user name or its still somehow empty.
                res.status(400).send("Something went wrong (User doesnt exists/ two unique usersnames")
                
            }
            else{
                
                //It exists continue...
                const groups = Client.query(GET_GROUPS_SQL_STATEMENT, [info[0].id])
                
                // using the info ID and sql statment, attempt to get the groups that the user is in.
                const posts = []
                if (groups.length > 0){
                console.log(groups)
                
                // the user is in a group, try to find post.

                    for (var i = 0; i < groups.length; i++){
                        //User might be in multiple groups, find them all.
                        posts.push(Client.query(GET_POSTING_SQL_STATEMENT, groups.id))
                    }
                    
                    
                }

                // put everything back into one object:
                var groupPosts = {
                    posts : posts,
                    groups : groups
                }
                console.log(groupPosts)
                
            }
        }
    }

    catch(error){
       console.error(error);
       res.sendStatus(500);
    }
});