const express= require("express");
const { connection } = require("./configs/db");
const { validator } = require("./middlewares/validator.middleware");
const { userRouter } = require("./routes/user.route");

const app= express();

app.use(express.json());

require("dotenv").config();

app.get("/", (req, res)=>{
    res.send("Welcome to Homepage");
})

app.use("/", userRouter);

app.use(validator);



app.listen(process.env.port, async()=>{
    try {
        await connection;
        console.log("Connected to DB")
    } catch (error) {
        console.log("Unable to connect to DB");
    }
    console.log(`Running at port ${process.env.port}`)
})