const express = require("express");
const { UserModel } = require("../models/userModel");
const { hashing } = require("../middleware/bcrypt")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
require("dotenv").config();
const userRoute = express.Router();

userRoute.post("/login", async (req, res) => {
    let { username, password } = req.body;
    try {
        let user = await UserModel.find({ "username": username });
        if (user.length == 0) {
            res.send("please enter correct credentials");
        }
        else {
            bcrypt.compare(password, user[0].password, function (err, result) {
                if (err) {
                    res.send("please enter correct credentials");
                }
                else {
                    let token = jwt.sign({ userID: user[0]._id }, process.env.privateKey);
                    res.send({ "msg": "Login Successfull", "token": token });
                }
            });
        }
    }
    catch (err) {
        res.send(err);
    }
})
userRoute.get("/confirm/:email", async (req, res) => {
    let email = req.params.email;
    try {
        console.log(email);
        let data = await UserModel.find({ "email": email });
        data[0].verified = true;
        await UserModel.findByIdAndUpdate({ "_id": data[0]._id }, data[0]);
        res.send("Registration completed");
    }
    catch (err) {
        res.send(err);
    }
})



userRoute.use(hashing);
userRoute.post("/register", async (req, res) => {
    let { username, email, password, verified } = req.body;
    try {
        let user = await UserModel.find({ "email": email });
        if (user.length == 0) {
            // let token = jwt.sign({ userID: user[0]._id }, process.env.privateKey);
            let link = `${process.env.BaseUrl}/user/confirm/${email}`;
            // let testAccount = await nodemailer.createTestAccount();
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'beau.spencer53@ethereal.email',
                    pass: 'pdRZugCzQbUj6Ncpf7'
                }
            });
            let info = await transporter.sendMail({
                from: '"Rahul Sharma 👻" beau.spencer53@ethereal.email', // sender address
                to: `${email}`, // list of receivers
                subject: "Verification mail", // Subject line
                text: "Hello Welcome to chat app. Please click on the link to verify your account" + link, // plain text body
                html: `<a href="${link}">verify email</b>`, // html body
            });

            // alert(`Varifiaction mail is to ${email}. Please verify it.`, info.messageId);
            await UserModel.insertMany(req.body);
            res.send({ "msg": "An verification mail is end to your account", "alert": `Varifiaction mail is to ${email}.Please verify it.` });
        }
        else {
            res.send("Already registered")
        }
    }
    catch (err) {
        res.send(err);
    }
})







module.exports =
{
    userRoute
}



