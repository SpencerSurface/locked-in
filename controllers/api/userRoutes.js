import express from "express"; // import the express module

const router = require("express").Router(); // Create an app object
const User =require("../../models/User");
router.post("/",async (req,res)=>{

    try {
        const newUser =await User.create(req.body);
        req.session.save(()=>{

            req.session.user_id =newUser.id;
            req.session.logged_in =true;
            res.status(200).json(newUser);


        })
    }catch (error){

        res.status(400).json(error);

    }
})
app.disable("x-powered-by"); // Reduce fingerprinting (optional)
// home route with the get method and a handler
app.get("/v1", (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            data: [],
            message: "Welcome to our API homepage!",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
});
export default app;