const express = require("express")
const bcrypt = require("bcrypt")
require('dotenv').config()
const pgp = require("pg-promise")()

const app = express()
const connectionString = process.env.CONNECTION_STRING
const db = pgp(connectionString)
console.log(db)

app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// const users = [
//     {
//         username: "test@gmail.com",
//         password: "$2b$10$SikSiFzmhWdlkXpwhymOyOiESru8XlF62s5fhRZy8OnkN9bFNc9lq"
//     },
//     {
//         username: "9876543210",
//         password: "$2b$10$SikSiFzmhWdlkXpwhymOyOiESru8XlF62s5fhRZy8OnkN9bFNc9lq"
//     }
// ]

app.post("/users/login", async (req, res) => {
    const query = `SELECT * FROM users WHERE Username=$1`
    const values = [req.body.username]
    const userList = await db.query(query, values)
    if (userList.length > 1) {
        res.status(500).send()
    }
    const user = userList[0]
    if (user === undefined) {
        res.status(400).send("user not found")
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.status(200).send("Logged in!")
        } else {
            res.status(400).send("incorrect password")
        }
    } catch {
        res.status(500).send()
    }
})

app.listen(3000)