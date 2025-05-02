const express = require('express')
const { connection } = require("./database/db")

const app = express()

app.get("/",(req,res)=>{
    res.send("Home page for Stamurai")
})

app.listen(5000, async (req,res)=>{
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log("Cannot connected to DB")
    }
    console.log(`Server is running on port 5000`)
})
