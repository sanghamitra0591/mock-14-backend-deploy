const express= require("express");
const { UserModel } = require("../models/user.model");

const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");

const userRouter= express.Router();

userRouter.get("/user", async(req, res)=>{
    try {
        const data= await UserModel.find();
        res.send(data)
    } catch (error) {
        console.log(error);
        res.send("Unable to fetch User data")
    }
})

userRouter.post("/signup", async(req, res)=>{
    const data= req.body;
    try {
        bcrypt.hash(data.password, 3, async(err, hashed)=>{
            if(err){
                res.send("Unable to signup")
            }else{
                const newData= new UserModel({...data, password:hashed});
                await newData.save();
                res.send("Successfully Signed Up");
            }
        })
    } catch (error) {
        console.log({"err":error});
        res.send("Unable to signup")
    }
})

userRouter.post("/login", async(req, res)=>{
    const data= req.body;
    try {
        const user= await UserModel.find({"email":data.email});
        if(user.length>0){
            bcrypt.compare(data.password, user[0].password, (err, result)=>{
                if(result){
                    const token= jwt.sign({userId:user[0]._id}, 'bugtracker');
                    res.send({"msg":"Login Successful", token});
                }else{
                    res.send("Invalid Credentials");
                }
            })
        }else{
            res.send("Invalid Credentials")
        }
    } catch (error) {
        console.log({"err":error});
        res.send("Unable to signin")
    }
})



module.exports= {
    userRouter
}